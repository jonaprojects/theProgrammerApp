import type { FastifyInstance } from "fastify";
import { z } from "zod";
import type { Authenticate } from "../../auth/authenticator.js";
import { UnauthorizedError } from "../../shared/errors.js";
import type { Queryable } from "../../shared/types.js";
import { LeaderboardRepository } from "./repository.js";

const leaderboardQuerySchema = z.object({
  period: z.enum(["weekly", "all_time"]).default("weekly"),
  limit: z.coerce.number().int().min(3).max(100).default(25),
});

export function registerLeaderboardRoutes(
  app: FastifyInstance,
  database: Queryable,
  authenticate: Authenticate,
): void {
  const repository = new LeaderboardRepository(database);

  app.get("/leaderboards", { preHandler: authenticate }, async (request) => {
    if (!request.user) throw new UnauthorizedError();
    const query = leaderboardQuerySchema.parse(request.query);
    return { data: await repository.getLeaderboard(request.user.id, query.period, query.limit) };
  });

  app.get("/me/achievements", { preHandler: authenticate }, async (request) => {
    if (!request.user) throw new UnauthorizedError();
    return { data: await repository.getAchievements(request.user.id) };
  });
}
