import type { Pool } from "pg";
import { SESSION_IDLE_TIMEOUT_DAYS } from "../../auth/session.js";

export type NotificationCategory = "multiplayer" | "achievements";
export type NotificationPreferences = {
  enabled: boolean;
  multiplayer: boolean;
  achievements: boolean;
};
export type PushDevice = { id: string; token: string; userId: string };
export type PendingReceipt = { deliveryId: string; ticketId: string; deviceId: string | null };

export class PushNotificationRepository {
  constructor(private readonly database: Pool) {}

  async getPreferences(userId: string): Promise<NotificationPreferences> {
    const result = await this.database.query<NotificationPreferences>(`
      SELECT enabled, multiplayer, achievements
      FROM user_notification_preferences WHERE user_id = $1
    `, [userId]);
    return result.rows[0] ?? { enabled: true, multiplayer: true, achievements: true };
  }

  async updatePreferences(userId: string, input: Partial<NotificationPreferences>): Promise<NotificationPreferences> {
    const result = await this.database.query<NotificationPreferences>(`
      INSERT INTO user_notification_preferences (user_id, enabled, multiplayer, achievements)
      VALUES ($1, coalesce($2, true), coalesce($3, true), coalesce($4, true))
      ON CONFLICT (user_id) DO UPDATE SET
        enabled = coalesce($2, user_notification_preferences.enabled),
        multiplayer = coalesce($3, user_notification_preferences.multiplayer),
        achievements = coalesce($4, user_notification_preferences.achievements)
      RETURNING enabled, multiplayer, achievements
    `, [userId, input.enabled ?? null, input.multiplayer ?? null, input.achievements ?? null]);
    const preferences = result.rows[0];
    if (!preferences) throw new Error("Notification preference update returned no result");
    return preferences;
  }

  async registerDevice(input: {
    userId: string;
    sessionId: string;
    token: string;
    platform: "android" | "ios";
    deviceName?: string;
  }): Promise<void> {
    await this.database.query(`
      INSERT INTO push_notification_devices
        (user_id, auth_session_id, expo_push_token, platform, device_name)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (expo_push_token) DO UPDATE SET
        user_id = EXCLUDED.user_id,
        auth_session_id = EXCLUDED.auth_session_id,
        platform = EXCLUDED.platform,
        device_name = EXCLUDED.device_name,
        active = true,
        disabled_at = NULL,
        last_error_code = NULL,
        last_registered_at = now()
    `, [input.userId, input.sessionId, input.token, input.platform, input.deviceName ?? null]);
  }

  async deactivateDevice(userId: string, token: string): Promise<void> {
    await this.database.query(`
      UPDATE push_notification_devices
      SET active = false, disabled_at = now()
      WHERE user_id = $1 AND expo_push_token = $2
    `, [userId, token]);
  }

  async listDevices(userId: string, category: NotificationCategory): Promise<PushDevice[]> {
    const preferenceColumn = category === "multiplayer" ? "multiplayer" : "achievements";
    const result = await this.database.query<PushDevice>(`
      SELECT d.id, d.expo_push_token AS token, d.user_id AS "userId"
      FROM push_notification_devices d
      JOIN auth_sessions s ON s.id = d.auth_session_id
      LEFT JOIN user_notification_preferences p ON p.user_id = d.user_id
      WHERE d.user_id = $1 AND d.active
        AND s.revoked_at IS NULL AND s.expires_at > now()
        AND s.last_seen_at > now() - ($2 * interval '1 day')
        AND COALESCE(p.enabled, true)
        AND COALESCE(p.${preferenceColumn}, true)
    `, [userId, SESSION_IDLE_TIMEOUT_DAYS]);
    return result.rows;
  }

  async recordTicket(input: {
    userId: string;
    deviceId: string;
    category: NotificationCategory;
    ticketId?: string;
    errorCode?: string;
  }): Promise<void> {
    const status = input.ticketId ? "ticket_ok" : "ticket_error";
    await this.database.query(`
      INSERT INTO push_notification_deliveries
        (user_id, device_id, category, expo_ticket_id, status, error_code, receipt_due_at)
      VALUES ($1, $2, $3, $4, $5, $6,
        CASE WHEN $4::text IS NULL THEN NULL ELSE now() + interval '15 minutes' END)
    `, [input.userId, input.deviceId, input.category, input.ticketId ?? null, status, input.errorCode ?? null]);
    if (input.errorCode === "DeviceNotRegistered") await this.disableDevice(input.deviceId, input.errorCode);
  }

  async dueReceipts(limit = 1000): Promise<PendingReceipt[]> {
    const result = await this.database.query<PendingReceipt>(`
      SELECT id AS "deliveryId", expo_ticket_id AS "ticketId", device_id AS "deviceId"
      FROM push_notification_deliveries
      WHERE status = 'ticket_ok' AND receipt_due_at <= now()
      ORDER BY receipt_due_at ASC LIMIT $1
    `, [limit]);
    return result.rows;
  }

  async completeReceipt(delivery: PendingReceipt, errorCode?: string): Promise<void> {
    await this.database.query(`
      UPDATE push_notification_deliveries SET
        status = $2,
        error_code = $3,
        receipt_checked_at = now(),
        receipt_due_at = NULL
      WHERE id = $1
    `, [delivery.deliveryId, errorCode ? "receipt_error" : "delivered", errorCode ?? null]);
    if (delivery.deviceId && errorCode === "DeviceNotRegistered") {
      await this.disableDevice(delivery.deviceId, errorCode);
    } else if (delivery.deviceId && !errorCode) {
      await this.database.query(
        "UPDATE push_notification_devices SET last_success_at = now(), last_error_code = NULL WHERE id = $1",
        [delivery.deviceId],
      );
    }
  }

  private async disableDevice(deviceId: string, errorCode: string): Promise<void> {
    await this.database.query(`
      UPDATE push_notification_devices
      SET active = false, disabled_at = now(), last_error_code = $2
      WHERE id = $1
    `, [deviceId, errorCode]);
  }
}
