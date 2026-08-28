import type { FastifyInstance } from "fastify";
import type { Pool } from "pg";
import { z } from "zod";
import type { Authenticate } from "../../auth/authenticator.js";
import { UnauthorizedError } from "../../shared/errors.js";
import { AttemptService } from "./service.js";

const submitAttemptSchema = z.object({
  questionId: z.uuid(),
  selectedOptionId: z.uuid(),
  idempotencyKey: z.uuid(),
  timeSpentSeconds: z.number().int().min(0).max(86_400).optional(),
});

export function registerAttemptRoutes(
  app: FastifyInstance,
  pool: Pool,
  authenticate: Authenticate,
): void {
  const attempts = new AttemptService(pool);

  app.post("/attempts", { preHandler: authenticate }, async (request, reply) => {
    if (!request.user) throw new UnauthorizedError();
    const input = submitAttemptSchema.parse(request.body);
    const attempt = await attempts.submit(request.user.id, input);
    return reply.code(attempt.replayed ? 200 : 201).send({ data: attempt });
  });
}
