import type { FastifyInstance } from "fastify";
import type { Pool } from "pg";
import { z } from "zod";
import type { Authenticate } from "../../auth/authenticator.js";
import { UnauthorizedError } from "../../shared/errors.js";
import { TutorialExerciseService } from "./service.js";

const paramsSchema = z.object({ exerciseId: z.string().min(1).max(160) });
const answerSchema = z.union([
  z.string().min(1),
  z.number().int().nonnegative(),
  z.array(z.string().min(1)).min(1).max(20),
]);
const submissionSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("check"),
    answer: answerSchema,
    hintUsed: z.boolean().default(false),
    idempotencyKey: z.uuid(),
  }),
  z.object({
    action: z.literal("reveal"),
    hintUsed: z.boolean().default(true),
    idempotencyKey: z.uuid(),
  }),
]);

export function registerTutorialExerciseRoutes(
  app: FastifyInstance,
  database: Pool,
  authenticate: Authenticate,
): void {
  const exercises = new TutorialExerciseService(database);
  app.post(
    "/me/tutorial-exercises/:exerciseId/submissions",
    { preHandler: authenticate },
    async (request, reply) => {
      if (!request.user) throw new UnauthorizedError();
      const { exerciseId } = paramsSchema.parse(request.params);
      const body = submissionSchema.parse(request.body);
      const result = await exercises.submit(request.user.id, { exerciseId, ...body });
      return reply.code(result.replayed ? 200 : 201).send({ data: result });
    },
  );
}
