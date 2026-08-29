import type { TutorialLessonContent } from "@/components/tutorials/PythonLessonPage";
import { javascriptLessons } from "./javascript/lessons";
import { gitLessons } from "./git/lessons";
import { sqlLessons } from "./sql/lessons";

const courses = [
  { name: "JavaScript", basePath: "/tutorials/javascript", lessons: javascriptLessons },
  { name: "Git", basePath: "/tutorials/git", lessons: gitLessons },
  { name: "SQL", basePath: "/tutorials/sql", lessons: sqlLessons },
] as const;

describe("expanded course library quality", () => {
  for (const course of courses) {
    describe(course.name, () => {
      const entries = Object.entries(course.lessons) as Array<[string, TutorialLessonContent]>;

      it("contains twelve connected lessons", () => {
        expect(entries).toHaveLength(12);
        for (let index = 0; index < entries.length - 1; index += 1) {
          expect(entries[index]?.[1].next?.path).toBe(`${course.basePath}/${entries[index + 1]?.[0]}`);
        }
        expect(entries.at(-1)?.[1].next).toBeUndefined();
      });

      it("follows the writing and exercise standard", () => {
        const exerciseIds: string[] = [];
        for (const [, lesson] of entries) {
          const paragraphs = lesson.intro.length + lesson.sections.reduce(
            (total, section) => total + (section.paragraphs?.length ?? 0),
            0,
          );
          const exercises = lesson.sections.flatMap((section) => section.exercise ? [section.exercise] : []);
          expect(paragraphs).toBeGreaterThanOrEqual(3);
          expect(lesson.sections.filter(({ code }) => Boolean(code))).toHaveLength(2);
          expect(exercises).toHaveLength(1);
          exerciseIds.push(exercises[0]!.id);
        }
        expect(new Set(exerciseIds).size).toBe(entries.length);
      });
    });
  }
});
