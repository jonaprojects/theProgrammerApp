import type { TutorialLessonContent } from "@/components/tutorials/PythonLessonPage";
import { cssLessons } from "./lessons";

describe("CSS course quality", () => {
  const entries = Object.entries(cssLessons) as Array<[string, TutorialLessonContent]>;
  const exercises = entries.flatMap(([, lesson]) => lesson.sections.flatMap((section) => section.exercise ? [section.exercise] : []));

  it("contains the complete 15-lesson curriculum", () => {
    expect(entries).toHaveLength(15);
    expect(entries[0]?.[0]).toBe("introduction");
    expect(entries.at(-1)?.[0]).toBe("accessible-page");
  });

  it("follows the writing and interaction standard", () => {
    for (const [, lesson] of entries) {
      const paragraphs = lesson.intro.length + lesson.sections.reduce((total, section) => total + (section.paragraphs?.length ?? 0), 0);
      expect(paragraphs).toBeGreaterThanOrEqual(3);
      expect(lesson.sections.filter(({ code }) => Boolean(code))).toHaveLength(2);
      expect(lesson.sections.filter(({ exercise }) => Boolean(exercise))).toHaveLength(1);
    }
  });

  it("uses unique exercises and a continuous next-lesson path", () => {
    expect(exercises).toHaveLength(entries.length);
    expect(new Set(exercises.map(({ id }) => id)).size).toBe(exercises.length);
    for (let index = 0; index < entries.length - 1; index += 1) {
      expect(entries[index]?.[1].next?.path).toBe(`/tutorials/css/${entries[index + 1]?.[0]}`);
    }
    expect(entries.at(-1)?.[1].next).toBeUndefined();
  });
});
