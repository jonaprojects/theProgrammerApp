import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { createIpRateLimitPreHandler } from "../security/rate-limiter.js";
import type { ErrorReporter } from "./error-reporter.js";

const clientErrorSchema = z.object({
  message: z.string().trim().min(1).max(500),
  stack: z.string().max(12_000).optional(),
  componentStack: z.string().max(12_000).optional(),
  route: z.string().trim().min(1).max(250).default("unknown"),
  platform: z.enum(["android", "ios", "web", "unknown"]),
  appVersion: z.string().trim().min(1).max(100),
  clientEventId: z.uuid(),
}).strict();

export function registerClientErrorRoutes(
  app: FastifyInstance,
  reporter: ErrorReporter,
  limit: number,
  windowSeconds: number,
): void {
  app.post("/client-errors", {
    preHandler: createIpRateLimitPreHandler(limit, windowSeconds),
  }, async (request, reply) => {
    const input = clientErrorSchema.parse(request.body);
    const error = new Error(input.message);
    if (input.stack || input.componentStack) {
      error.stack = [input.stack, input.componentStack].filter(Boolean).join("\n\nReact component stack:\n");
    }
    const eventId = reporter.capture(error, {
      source: "client",
      requestId: request.id,
      route: input.route,
      platform: input.platform,
      appVersion: input.appVersion,
      clientEventId: input.clientEventId,
    });
    request.log.error({
      err: error,
      eventId,
      clientEventId: input.clientEventId,
      platform: input.platform,
      appVersion: input.appVersion,
      route: input.route,
    }, "Client application error reported");
    return reply.code(202).send({ data: { eventId } });
  });
}
