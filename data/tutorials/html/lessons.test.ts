import { htmlLessons } from "./lessons";
import type { TutorialLessonContent } from "@/components/tutorials/PythonLessonPage";

describe("HTML course quality", () => {
  const entries = Object.entries(htmlLessons) as Array<[string, TutorialLessonContent]>;
  const exercises = entries.flatMap(([, lesson]) =>
    lesson.sections.flatMap((section) => section.exercise ? [section.exercise] : []),
  );

  it("contains the complete 15-lesson curriculum", () => {
    expect(entries).toHaveLength(15);
    expect(entries[0]?.[0]).toBe("introduction");
    expect(entries.at(-1)?.[0]).toBe("accessibility");
  });

  it("follows the tutorial writing and interaction standard", () => {
    for (const [, lesson] of entries) {
      const paragraphCount = lesson.intro.length + lesson.sections.reduce(
        (total, section) => total + (section.paragraphs?.length ?? 0),
        0,
      );
      expect(paragraphCount).toBeGreaterThanOrEqual(3);
      expect(lesson.sections.filter(({ code }) => Boolean(code))).toHaveLength(2);
      expect(lesson.sections.filter(({ exercise }) => Boolean(exercise))).toHaveLength(1);
    }
  });

  it("uses unique exercises with valid choice answers", () => {
    expect(exercises).toHaveLength(entries.length);
    expect(new Set(exercises.map(({ id }) => id)).size).toBe(exercises.length);
    for (const exercise of exercises) {
      if (exercise.type === "predict_output" || exercise.type === "fill_blank" || exercise.type === "trace") {
        expect(exercise.options.map(({ id }) => id)).toContain(exercise.correctOptionId);
      }
    }
  });

  it("links every lesson to the next one in curriculum order", () => {
    for (let index = 0; index < entries.length - 1; index += 1) {
      expect(entries[index]?.[1].next?.path).toBe(`/tutorials/html/${entries[index + 1]?.[0]}`);
    }
    expect(entries.at(-1)?.[1].next).toBeUndefined();
  });
});
