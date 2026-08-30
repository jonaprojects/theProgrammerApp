import type { FastifyReply, FastifyRequest } from "fastify";
import type { Queryable } from "../shared/types.js";
import { UnauthorizedError } from "../shared/errors.js";
import { hashSessionToken, SESSION_IDLE_TIMEOUT_DAYS } from "./session.js";

export type Authenticate = (
  request: FastifyRequest,
  reply: FastifyReply,
) => Promise<void>;

export interface AuthenticatedSession {
  userId: string;
  sessionId: string;
}

export async function resolveSessionToken(
  database: Queryable,
  token: string,
): Promise<AuthenticatedSession | null> {
  if (!/^[A-Za-z0-9_-]+$/.test(token)) return null;
  const result = await database.query<AuthenticatedSession>(`
    UPDATE auth_sessions s
    SET last_seen_at = CASE
      WHEN s.last_seen_at < now() - interval '5 minutes' THEN now()
      ELSE s.last_seen_at
    END
    FROM users u
    WHERE s.token_hash = $1
      AND s.user_id = u.id
      AND s.revoked_at IS NULL
      AND s.expires_at > now()
      AND s.last_seen_at > now() - ($2 * interval '1 day')
    RETURNING u.id AS "userId", s.id AS "sessionId"
  `, [hashSessionToken(token), SESSION_IDLE_TIMEOUT_DAYS]);
  return result.rows[0] ?? null;
}

export function createSessionAuthenticator(database: Queryable): Authenticate {
  return async (request) => {
    const authorization = request.headers.authorization;
    const match = authorization?.match(/^Bearer\s+([A-Za-z0-9_-]+)$/);
    if (!match?.[1]) throw new UnauthorizedError("A valid bearer token is required");

    const session = await resolveSessionToken(database, match[1]);
    if (!session) throw new UnauthorizedError("The session is invalid or expired");

    request.user = { id: session.userId };
    request.authSessionId = session.sessionId;
  };
}
