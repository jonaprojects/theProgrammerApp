import type { FastifyInstance } from "fastify";
import type { Queryable } from "../../shared/types.js";

export function registerHealthRoutes(app: FastifyInstance, database: Queryable): void {
  app.get("/health", async () => {
    await database.query("SELECT 1");
    return {
      status: "ok",
      database: "reachable",
      timestamp: new Date().toISOString(),
    };
  });
}
