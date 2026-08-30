import { createHash } from "node:crypto";
import type { FastifyReply, FastifyRequest } from "fastify";
import { RateLimitError } from "../shared/errors.js";

interface Bucket {
  count: number;
  resetAt: number;
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
  retryAfterSeconds: number;
}

export class FixedWindowRateLimiter {
  private readonly buckets = new Map<string, Bucket>();

  constructor(
    private readonly limit: number,
    private readonly windowMs: number,
    private readonly maxEntries = 10_000,
    private readonly now: () => number = Date.now,
  ) {}

  consume(key: string): RateLimitResult {
    const currentTime = this.now();
    let bucket = this.buckets.get(key);
    if (!bucket || bucket.resetAt <= currentTime) {
      this.ensureCapacity(currentTime);
      bucket = { count: 0, resetAt: currentTime + this.windowMs };
      this.buckets.set(key, bucket);
    }
    bucket.count += 1;
    const remaining = Math.max(0, this.limit - bucket.count);
    return {
      allowed: bucket.count <= this.limit,
      limit: this.limit,
      remaining,
      resetAt: bucket.resetAt,
      retryAfterSeconds: Math.max(1, Math.ceil((bucket.resetAt - currentTime) / 1000)),
    };
  }

  private ensureCapacity(currentTime: number): void {
    for (const [key, bucket] of this.buckets) {
      if (bucket.resetAt <= currentTime) this.buckets.delete(key);
    }
    while (this.buckets.size >= this.maxEntries) {
      const oldestKey = this.buckets.keys().next().value as string | undefined;
      if (!oldestKey) break;
      this.buckets.delete(oldestKey);
    }
  }
}

function applyHeaders(reply: FastifyReply, result: RateLimitResult): void {
  reply.header("RateLimit-Limit", result.limit);
  reply.header("RateLimit-Remaining", result.remaining);
  reply.header("RateLimit-Reset", Math.ceil(result.resetAt / 1000));
  if (!result.allowed) reply.header("Retry-After", result.retryAfterSeconds);
}

function assertAllowed(reply: FastifyReply, result: RateLimitResult): void {
  applyHeaders(reply, result);
  if (!result.allowed) throw new RateLimitError(result.retryAfterSeconds);
}

export function createApiRateLimitHook(limit: number, windowSeconds: number) {
  const limiter = new FixedWindowRateLimiter(limit, windowSeconds * 1000);
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    if (request.method === "OPTIONS" || !request.url.startsWith("/api/")) return;
    assertAllowed(reply, limiter.consume(request.ip));
  };
}

export function createIpRateLimitPreHandler(limit: number, windowSeconds: number) {
  const limiter = new FixedWindowRateLimiter(limit, windowSeconds * 1000);
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    assertAllowed(reply, limiter.consume(request.ip));
  };
}

export function createAuthRateLimitPreHandler(limit: number, windowSeconds: number) {
  const ipLimiter = new FixedWindowRateLimiter(limit, windowSeconds * 1000);
  const accountLimiter = new FixedWindowRateLimiter(limit, windowSeconds * 1000);

  return (scope: "login" | "register") => async (
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> => {
    assertAllowed(reply, ipLimiter.consume(`${scope}:ip:${request.ip}`));
    const body = request.body as { email?: unknown } | null;
    if (typeof body?.email !== "string") return;
    const normalizedEmail = body.email.trim().toLowerCase();
    const accountKey = createHash("sha256").update(normalizedEmail).digest("base64url");
    assertAllowed(reply, accountLimiter.consume(`${scope}:account:${accountKey}`));
  };
}
