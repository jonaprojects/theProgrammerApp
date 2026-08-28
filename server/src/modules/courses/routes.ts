import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { NotFoundError } from "../../shared/errors.js";
import type { Queryable } from "../../shared/types.js";
import { CourseRepository } from "./repository.js";

const courseParamsSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
});

export function registerCourseRoutes(app: FastifyInstance, database: Queryable): void {
  const courses = new CourseRepository(database);

  app.get("/courses", async () => ({ data: await courses.listPublished() }));

  app.get("/courses/:slug", async (request) => {
    const { slug } = courseParamsSchema.parse(request.params);
    const course = await courses.findPublishedBySlug(slug);
    if (!course) throw new NotFoundError("Course");
    return { data: course };
  });
}
