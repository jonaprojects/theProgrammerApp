import type { FastifyInstance, FastifyReply } from "fastify";
import type { Queryable } from "../../shared/types.js";

export function registerHealthRoutes(app: FastifyInstance, database: Queryable): void {
  app.get("/health/live", async () => ({
    status: "ok",
    timestamp: new Date().toISOString(),
  }));

  const readiness = async (_request: unknown, reply: FastifyReply) => {
    try {
      await database.query("SELECT 1");
      return {
        status: "ok",
        database: "reachable",
        timestamp: new Date().toISOString(),
      };
    } catch {
      return reply.code(503).send({
        status: "unavailable",
        database: "unreachable",
        timestamp: new Date().toISOString(),
      });
    }
  };

  app.get("/health", readiness);
  app.get("/health/ready", readiness);
}
