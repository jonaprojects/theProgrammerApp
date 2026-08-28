import type { FastifyReply, FastifyRequest } from "fastify";
import type { Queryable } from "../shared/types.js";
import { UnauthorizedError } from "../shared/errors.js";
import { hashSessionToken } from "./session.js";

export type Authenticate = (
  request: FastifyRequest,
  reply: FastifyReply,
) => Promise<void>;

export function createSessionAuthenticator(database: Queryable): Authenticate {
  return async (request) => {
    const authorization = request.headers.authorization;
    const match = authorization?.match(/^Bearer\s+([A-Za-z0-9_-]+)$/);
    if (!match?.[1]) throw new UnauthorizedError("A valid bearer token is required");

    const result = await database.query<{ userId: string; sessionId: string }>(`
      UPDATE auth_sessions s
      SET last_seen_at = now()
      FROM users u
      WHERE s.token_hash = $1
        AND s.user_id = u.id
        AND s.revoked_at IS NULL
        AND s.expires_at > now()
      RETURNING u.id AS "userId", s.id AS "sessionId"
    `, [hashSessionToken(match[1])]);
    const session = result.rows[0];
    if (!session) throw new UnauthorizedError("The session is invalid or expired");

    request.user = { id: session.userId };
    request.authSessionId = session.sessionId;
  };
}
