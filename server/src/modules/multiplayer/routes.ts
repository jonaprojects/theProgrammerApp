import type { FastifyInstance } from "fastify";
import type { Pool } from "pg";
import { z } from "zod";

import type { Authenticate } from "../../auth/authenticator.js";
import { UnauthorizedError } from "../../shared/errors.js";
import { MultiplayerService } from "./service.js";

const matchOptionsSchema = z.object({
  topicSlug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  questionCount: z.number().int().min(5).max(20).default(10),
  roundDurationSeconds: z.number().int().min(10).max(60).default(20),
});
const joinSchema = z.object({ code: z.string().trim().toUpperCase().regex(/^[A-Z2-9]{8}$/) });
const matchParamsSchema = z.object({ matchId: z.uuid() });
const answerSchema = z.object({
  questionPosition: z.number().int().min(1).max(20),
  selectedOptionId: z.uuid(),
  idempotencyKey: z.uuid(),
});

export function registerMultiplayerRoutes(
  app: FastifyInstance,
  pool: Pool,
  authenticate: Authenticate,
): void {
  const multiplayer = new MultiplayerService(pool);
  const userId = (request: { user: { id: string } | null }): string => {
    if (!request.user) throw new UnauthorizedError();
    return request.user.id;
  };

  app.get("/multiplayer/me/current", { preHandler: authenticate }, async (request) => ({
    data: await multiplayer.findCurrent(userId(request)),
  }));

  app.post("/multiplayer/matches", { preHandler: authenticate }, async (request, reply) => {
    const input = matchOptionsSchema.parse(request.body);
    const match = await multiplayer.createPrivate(userId(request), input);
    return reply.code(201).send({ data: match });
  });

  app.post("/multiplayer/matchmaking", { preHandler: authenticate }, async (request, reply) => {
    const input = matchOptionsSchema.parse(request.body);
    const match = await multiplayer.quickMatch(userId(request), input);
    return reply.code(201).send({ data: match });
  });

  app.post("/multiplayer/join", { preHandler: authenticate }, async (request, reply) => {
    const { code } = joinSchema.parse(request.body);
    const match = await multiplayer.joinByCode(userId(request), code);
    return reply.code(201).send({ data: match });
  });

  app.get("/multiplayer/matches/:matchId", { preHandler: authenticate }, async (request) => {
    const { matchId } = matchParamsSchema.parse(request.params);
    return { data: await multiplayer.getState(userId(request), matchId) };
  });

  app.post("/multiplayer/matches/:matchId/start", { preHandler: authenticate }, async (request) => {
    const { matchId } = matchParamsSchema.parse(request.params);
    return { data: await multiplayer.start(userId(request), matchId) };
  });

  app.post("/multiplayer/matches/:matchId/answers", { preHandler: authenticate }, async (request, reply) => {
    const { matchId } = matchParamsSchema.parse(request.params);
    const input = answerSchema.parse(request.body);
    const result = await multiplayer.submitAnswer(userId(request), matchId, input);
    return reply.code(result.replayed ? 200 : 201).send({ data: result });
  });

  app.post("/multiplayer/matches/:matchId/leave", { preHandler: authenticate }, async (request, reply) => {
    const { matchId } = matchParamsSchema.parse(request.params);
    await multiplayer.leave(userId(request), matchId);
    return reply.code(204).send();
  });
}
