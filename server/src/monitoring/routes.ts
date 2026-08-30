import { createHash, timingSafeEqual } from "node:crypto";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { UnauthorizedError } from "../shared/errors.js";
import type { MetricsRegistry } from "./metrics.js";

function tokenMatches(actual: string, expected: string): boolean {
  const actualHash = createHash("sha256").update(actual).digest();
  const expectedHash = createHash("sha256").update(expected).digest();
  return timingSafeEqual(actualHash, expectedHash);
}

export function registerMonitoringRoutes(
  app: FastifyInstance,
  metrics: MetricsRegistry,
  metricsToken?: string,
): void {
  if (!metricsToken) return;

  const authenticateMetrics = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const match = request.headers.authorization?.match(/^Bearer\s+(.+)$/);
    if (!match?.[1] || !tokenMatches(match[1], metricsToken)) {
      reply.header("WWW-Authenticate", "Bearer");
      throw new UnauthorizedError("A valid monitoring token is required");
    }
  };

  app.get("/internal/metrics", { preHandler: authenticateMetrics }, async (_request, reply) => {
    reply.header("Cache-Control", "no-store");
    return reply.type("text/plain; version=0.0.4; charset=utf-8").send(metrics.render());
  });
}
