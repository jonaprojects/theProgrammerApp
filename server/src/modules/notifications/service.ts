import type { FastifyBaseLogger } from "fastify";
import {
  PushNotificationRepository,
  type NotificationCategory,
  type PendingReceipt,
} from "./repository.js";

const SEND_URL = "https://exp.host/--/api/v2/push/send";
const RECEIPTS_URL = "https://exp.host/--/api/v2/push/getReceipts";

type ExpoTicket = { status: "ok"; id: string } | {
  status: "error";
  message?: string;
  details?: { error?: string };
};
type ExpoReceipt = { status: "ok" } | {
  status: "error";
  message?: string;
  details?: { error?: string };
};

export interface NotificationSender {
  sendToUser(userId: string, notification: PushNotification): Promise<number>;
}

export type PushNotification = {
  category: NotificationCategory;
  title: string;
  body: string;
  route: string;
  event: string;
};

export class PushNotificationService implements NotificationSender {
  private receiptTimer: NodeJS.Timeout | null = null;

  constructor(
    private readonly repository: PushNotificationRepository,
    private readonly logger: FastifyBaseLogger,
    private readonly accessToken?: string,
    private readonly fetcher: typeof fetch = fetch,
  ) {}

  start(): void {
    if (this.receiptTimer) return;
    this.receiptTimer = setInterval(() => {
      void this.checkReceipts().catch((error) => this.logger.warn({ err: error }, "Push receipt check failed"));
    }, 60_000);
    this.receiptTimer.unref();
  }

  stop(): void {
    if (this.receiptTimer) clearInterval(this.receiptTimer);
    this.receiptTimer = null;
  }

  async sendToUser(userId: string, notification: PushNotification): Promise<number> {
    const devices = await this.repository.listDevices(userId, notification.category);
    if (devices.length === 0) return 0;
    for (let offset = 0; offset < devices.length; offset += 100) {
      const batch = devices.slice(offset, offset + 100);
      const response = await this.request(SEND_URL, batch.map((device) => ({
        to: device.token,
        title: notification.title,
        body: notification.body,
        sound: "default",
        channelId: "learning-updates",
        priority: "high",
        data: { route: notification.route, event: notification.event },
      })));
      const payload = await response.json() as { data?: ExpoTicket[] };
      if (!response.ok || !Array.isArray(payload.data)) {
        throw new Error(`Expo push request failed with status ${response.status}`);
      }
      await Promise.all(batch.map((device, index) => {
        const ticket = payload.data?.[index];
        return this.repository.recordTicket({
          userId,
          deviceId: device.id,
          category: notification.category,
          ...(ticket?.status === "ok"
            ? { ticketId: ticket.id }
            : { errorCode: ticket?.details?.error ?? "PushTicketError" }),
        });
      }));
    }
    return devices.length;
  }

  async checkReceipts(): Promise<void> {
    const pending = await this.repository.dueReceipts();
    if (pending.length === 0) return;
    const response = await this.request(RECEIPTS_URL, { ids: pending.map((item) => item.ticketId) });
    const payload = await response.json() as { data?: Record<string, ExpoReceipt> };
    if (!response.ok || !payload.data) throw new Error(`Expo receipt request failed with status ${response.status}`);
    await Promise.all(pending.map((delivery) => this.applyReceipt(delivery, payload.data?.[delivery.ticketId])));
  }

  private applyReceipt(delivery: PendingReceipt, receipt?: ExpoReceipt): Promise<void> {
    if (!receipt) return Promise.resolve();
    return this.repository.completeReceipt(
      delivery,
      receipt.status === "error" ? receipt.details?.error ?? "PushReceiptError" : undefined,
    );
  }

  private async request(url: string, body: unknown): Promise<Response> {
    let lastResponse: Response | null = null;
    let lastError: unknown;
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        lastResponse = await this.fetcher(url, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            ...(this.accessToken ? { Authorization: `Bearer ${this.accessToken}` } : {}),
          },
          body: JSON.stringify(body),
        });
        if (lastResponse.status !== 429 && lastResponse.status < 500) return lastResponse;
      } catch (error) {
        lastError = error;
      }
      await new Promise((resolve) => setTimeout(resolve, 250 * (2 ** attempt)));
    }
    if (!lastResponse) throw lastError instanceof Error ? lastError : new Error("Expo push request failed");
    return lastResponse;
  }
}
