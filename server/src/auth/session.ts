import { createHash, randomBytes } from "node:crypto";

export const SESSION_DURATION_DAYS = 30;
export const SESSION_IDLE_TIMEOUT_DAYS = 14;
export const MAX_ACTIVE_SESSIONS = 5;

export function createSessionToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashSessionToken(token: string): Buffer {
  return createHash("sha256").update(token).digest();
}
