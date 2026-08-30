import type { ApiProgress } from "@/services/api/types";
import { applyLessonProgress, compactLessonProgressQueue } from "./logic";

const progress = {
  summary: { completedLessons: 0, completedCourses: 0, lastActivityAt: null },
  enrollments: [{
    courseSlug: "html-basics",
    completedLessons: 0,
    totalLessons: 2,
    completionPercentage: 0,
    status: "not_started",
    completedAt: null,
    lastAccessedAt: null,
    resumeLesson: null,
    lessons: [
      { lessonSlug: "intro", lessonTitle: "Intro", position: 1, status: "not_started", completedAt: null, lastAccessedAt: null },
      { lessonSlug: "links", lessonTitle: "Links", position: 2, status: "not_started", completedAt: null, lastAccessedAt: null },
    ],
  }],
} as unknown as ApiProgress;

describe("offline lesson progress", () => {
  it("compacts changes and never downgrades a completion", () => {
    const completed = { courseSlug: "html-basics", lessonSlug: "intro", status: "completed" as const, updatedAt: "2026-01-01T00:00:00Z" };
    const opened = { ...completed, status: "in_progress" as const, updatedAt: "2026-01-02T00:00:00Z" };
    expect(compactLessonProgressQueue([completed], opened)).toEqual([{ ...opened, status: "completed" }]);
  });

  it("updates cached course totals and the resume lesson", () => {
    const updated = applyLessonProgress(progress, {
      courseSlug: "html-basics",
      lessonSlug: "intro",
      status: "completed",
      updatedAt: "2026-01-01T00:00:00Z",
    });
    const enrollment = updated.enrollments[0]!;
    expect(enrollment.completedLessons).toBe(1);
    expect(enrollment.completionPercentage).toBe(50);
    expect(enrollment.status).toBe("in_progress");
    expect(enrollment.resumeLesson?.lessonSlug).toBe("links");
    expect(updated.summary.completedLessons).toBe(1);
  });
});
