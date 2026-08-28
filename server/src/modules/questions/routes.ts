import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { NotFoundError } from "../../shared/errors.js";
import type { Queryable } from "../../shared/types.js";
import { QuestionRepository } from "./repository.js";

const topicParamsSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
});
const questionQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export function registerQuestionRoutes(app: FastifyInstance, database: Queryable): void {
  const questions = new QuestionRepository(database);

  app.get("/topics", async () => ({ data: await questions.listTopics() }));

  app.get("/topics/:slug/questions", async (request) => {
    const { slug } = topicParamsSchema.parse(request.params);
    const { limit } = questionQuerySchema.parse(request.query);
    const result = await questions.listPublishedByTopic(slug, limit);
    if (result === null) throw new NotFoundError("Topic");
    return { data: result };
  });
}
