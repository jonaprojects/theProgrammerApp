import type { FastifyInstance } from "fastify";
import { z } from "zod";
import type { Authenticate } from "../../auth/authenticator.js";
import { NotFoundError, UnauthorizedError } from "../../shared/errors.js";
import type { Queryable } from "../../shared/types.js";
import { ProgressRepository } from "./repository.js";

const enrollmentSchema = z.object({ courseId: z.uuid() });
const lessonProgressParamsSchema = z.object({
  courseSlug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  lessonSlug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
});
const lessonProgressSchema = z.object({
  status: z.enum(["in_progress", "completed"]),
});

export function registerProgressRoutes(
  app: FastifyInstance,
  database: Queryable,
  authenticate: Authenticate,
): void {
  const progress = new ProgressRepository(database);

  app.get("/me/progress", { preHandler: authenticate }, async (request) => {
    if (!request.user) throw new UnauthorizedError();
    const user = await progress.getUserSummary(request.user.id);
    if (!user) throw new NotFoundError("User");
    const [summary, enrollments, topics, tutorialExercises] = await Promise.all([
      progress.getLearningSummary(request.user.id),
      progress.listEnrollments(request.user.id),
      progress.listTopicProgress(request.user.id),
      progress.listTutorialExerciseProgress(request.user.id),
    ]);
    return { data: { user, summary, enrollments, topics, tutorialExercises } };
  });

  app.post("/me/enrollments", { preHandler: authenticate }, async (request, reply) => {
    if (!request.user) throw new UnauthorizedError();
    const { courseId } = enrollmentSchema.parse(request.body);
    const enrolled = await progress.enroll(request.user.id, courseId);
    if (!enrolled) throw new NotFoundError("Course");
    return reply.code(204).send();
  });

  app.put(
    "/me/courses/:courseSlug/lessons/:lessonSlug/progress",
    { preHandler: authenticate },
    async (request, reply) => {
      if (!request.user) throw new UnauthorizedError();
      const { courseSlug, lessonSlug } = lessonProgressParamsSchema.parse(request.params);
      const { status } = lessonProgressSchema.parse(request.body);
      const updated = await progress.setLessonProgress(
        request.user.id,
        courseSlug,
        lessonSlug,
        status,
      );
      if (!updated) throw new NotFoundError("Lesson");
      return reply.code(204).send();
    },
  );
}
