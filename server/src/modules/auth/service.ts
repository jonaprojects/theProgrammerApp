import type { Pool, PoolClient } from "pg";
import { withTransaction } from "../../db/transaction.js";
import { ConflictError, UnauthorizedError } from "../../shared/errors.js";
import { hashPassword, verifyPassword } from "../../auth/password.js";
import {
  createSessionToken,
  hashSessionToken,
  MAX_ACTIVE_SESSIONS,
  SESSION_DURATION_DAYS,
  SESSION_IDLE_TIMEOUT_DAYS,
} from "../../auth/session.js";

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  bio: string;
  points: number;
  createdAt: Date;
}

export interface AuthResult {
  token: string;
  user: AuthUser;
}

interface CredentialRow extends AuthUser {
  passwordHash: string;
}

const dummyPasswordHash = hashPassword("not-a-real-user-password");

export class AuthService {
  constructor(private readonly database: Pool) {}

  async register(input: { email: string; password: string; displayName: string }): Promise<AuthResult> {
    const email = input.email.trim().toLowerCase();
    const passwordHash = await hashPassword(input.password);
    const token = createSessionToken();

    try {
      const user = await withTransaction(this.database, async (client) => {
        const result = await client.query<AuthUser>(`
          INSERT INTO users (auth_provider, auth_subject, display_name)
          VALUES ('password', $1, $2)
          RETURNING
            id,
            auth_subject AS email,
            display_name AS "displayName",
            bio,
            points,
            created_at AS "createdAt"
        `, [email, input.displayName.trim()]);
        const created = result.rows[0];
        if (!created) throw new Error("User creation did not return a user");

        await client.query(
          "INSERT INTO password_credentials (user_id, password_hash) VALUES ($1, $2)",
          [created.id, passwordHash],
        );
        await this.insertSession(client, created.id, token);
        return created;
      });
      return { token, user };
    } catch (error) {
      if ((error as { code?: string }).code === "23505") {
        throw new ConflictError("EMAIL_ALREADY_REGISTERED", "An account already exists for this email");
      }
      throw error;
    }
  }

  async login(input: { email: string; password: string }): Promise<AuthResult> {
    const email = input.email.trim().toLowerCase();
    const result = await this.database.query<CredentialRow>(`
      SELECT
        u.id,
        u.auth_subject AS email,
        u.display_name AS "displayName",
        u.bio,
        u.points,
        u.created_at AS "createdAt",
        c.password_hash AS "passwordHash"
      FROM users u
      JOIN password_credentials c ON c.user_id = u.id
      WHERE u.auth_provider = 'password' AND lower(u.auth_subject) = $1
    `, [email]);
    const credential = result.rows[0];
    const passwordMatches = await verifyPassword(
      input.password,
      credential?.passwordHash ?? await dummyPasswordHash,
    );
    if (!credential || !passwordMatches) {
      throw new UnauthorizedError("The email or password is incorrect");
    }

    const token = createSessionToken();
    await this.insertSession(this.database, credential.id, token);
    const { passwordHash: _, ...user } = credential;
    return { token, user };
  }

  async logout(userId: string, sessionId: string): Promise<void> {
    await this.database.query(`
      WITH revoked AS (
        UPDATE auth_sessions SET revoked_at = now()
        WHERE id = $1 AND user_id = $2
        RETURNING id
      )
      UPDATE push_notification_devices
      SET active = false, disabled_at = now()
      WHERE auth_session_id IN (SELECT id FROM revoked)
    `, [sessionId, userId]);
  }

  private async insertSession(database: Pool | PoolClient, userId: string, token: string): Promise<void> {
    await database.query(`
      WITH revoked_expired AS (
        UPDATE auth_sessions
        SET revoked_at = now()
        WHERE user_id = $1 AND revoked_at IS NULL
          AND (expires_at <= now() OR last_seen_at <= now() - ($5 * interval '1 day'))
      ),
      overflow AS (
        SELECT id FROM auth_sessions
        WHERE user_id = $1 AND revoked_at IS NULL
          AND expires_at > now() AND last_seen_at > now() - ($5 * interval '1 day')
        ORDER BY last_seen_at DESC, created_at DESC
        OFFSET $4
      ),
      revoked_overflow AS (
        UPDATE auth_sessions SET revoked_at = now() WHERE id IN (SELECT id FROM overflow)
      )
      INSERT INTO auth_sessions (user_id, token_hash, expires_at)
      VALUES ($1, $2, now() + ($3 * interval '1 day'))
    `, [
      userId,
      hashSessionToken(token),
      SESSION_DURATION_DAYS,
      MAX_ACTIVE_SESSIONS - 1,
      SESSION_IDLE_TIMEOUT_DAYS,
    ]);
  }
}
