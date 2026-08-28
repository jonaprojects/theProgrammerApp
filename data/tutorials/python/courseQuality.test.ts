import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { pythonLessons } from "./lessons";

const standaloneLessons = [
  "Intro.tsx",
  "Installation.tsx",
  "FirstPythonProgram.tsx",
  "Datatypes.tsx",
  "Variables.tsx",
  "Operators.tsx",
  "InputOutput.tsx",
  "IFElse.tsx",
] as const;

describe("Python course guide quality", () => {
  const tutorialDirectory = resolve(process.cwd(), "app", "tutorials", "python");

  it("includes a micro-exercise and worked code in every standalone lesson", () => {
    for (const file of standaloneLessons) {
      const source = readFileSync(resolve(tutorialDirectory, file), "utf8");
      expect(source).toContain("<InteractiveExercise");
      expect(source).toContain("<CodeSnippet");
    }
  });

  it("includes an exercise in every catalog-driven lesson", () => {
    for (const lesson of Object.values(pythonLessons)) {
      expect(lesson.sections.some((section) => "exercise" in section)).toBe(true);
    }
  });

  it("uses a unique exercise id for every lesson in the course", () => {
    const standaloneSources = standaloneLessons.map((file) =>
      readFileSync(resolve(tutorialDirectory, file), "utf8"),
    );
    const standaloneIds = standaloneSources.flatMap((source) =>
      [...source.matchAll(/id:\s*"(python-[^"]+)"/g)].map((match) => match[1]!),
    );
    const catalogIds = Object.values(pythonLessons).flatMap((lesson) =>
      lesson.sections.flatMap((section) =>
        "exercise" in section && section.exercise ? [section.exercise.id] : [],
      ),
    );
    const allIds = [...standaloneIds, ...catalogIds];

    expect(allIds).toHaveLength(standaloneLessons.length + Object.keys(pythonLessons).length);
    expect(new Set(allIds).size).toBe(allIds.length);
  });
});
