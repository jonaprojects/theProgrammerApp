import type { ApiProgress } from "@/services/api/types";

export type LessonProgressStatus = "in_progress" | "completed";
export type PendingLessonProgress = {
  courseSlug: string;
  lessonSlug: string;
  status: LessonProgressStatus;
  updatedAt: string;
};

export function compactLessonProgressQueue(
  queue: PendingLessonProgress[],
  incoming: PendingLessonProgress,
): PendingLessonProgress[] {
  const existing = queue.find((item) =>
    item.courseSlug === incoming.courseSlug && item.lessonSlug === incoming.lessonSlug);
  const status = existing?.status === "completed" ? "completed" : incoming.status;
  return [
    ...queue.filter((item) =>
      item.courseSlug !== incoming.courseSlug || item.lessonSlug !== incoming.lessonSlug),
    { ...incoming, status },
  ];
}

export function applyLessonProgress(
  progress: ApiProgress,
  change: PendingLessonProgress,
): ApiProgress {
  const next = JSON.parse(JSON.stringify(progress)) as ApiProgress;
  const enrollment = next.enrollments.find(({ courseSlug }) => courseSlug === change.courseSlug);
  const lesson = enrollment?.lessons.find(({ lessonSlug }) => lessonSlug === change.lessonSlug);
  if (!enrollment || !lesson) return next;

  if (lesson.status !== "completed") lesson.status = change.status;
  lesson.lastAccessedAt = change.updatedAt;
  if (change.status === "completed" && !lesson.completedAt) lesson.completedAt = change.updatedAt;

  enrollment.completedLessons = enrollment.lessons.filter(({ status }) => status === "completed").length;
  enrollment.completionPercentage = enrollment.totalLessons === 0
    ? 0
    : Math.round((enrollment.completedLessons / enrollment.totalLessons) * 100);
  enrollment.status = enrollment.completedLessons === enrollment.totalLessons
    ? "completed"
    : enrollment.lessons.some(({ status }) => status !== "not_started") ? "in_progress" : "not_started";
  enrollment.completedAt = enrollment.status === "completed"
    ? enrollment.completedAt ?? change.updatedAt
    : null;
  enrollment.lastAccessedAt = change.updatedAt;
  enrollment.resumeLesson = enrollment.lessons.find(({ status }) => status !== "completed") ?? null;

  next.summary.completedLessons = next.enrollments.reduce((sum, item) => sum + item.completedLessons, 0);
  next.summary.completedCourses = next.enrollments.filter(({ status }) => status === "completed").length;
  next.summary.lastActivityAt = change.updatedAt;
  return next;
}
