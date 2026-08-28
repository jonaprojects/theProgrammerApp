import { pythonLessons } from "./lessons";

describe("Python tutorial interactive exercises", () => {
  const exercises = Object.values(pythonLessons).flatMap((lesson) =>
    lesson.sections.flatMap((section) =>
      "exercise" in section && section.exercise ? [section.exercise] : [],
    ),
  );

  it("uses unique stable identifiers", () => {
    expect(exercises).toHaveLength(Object.keys(pythonLessons).length);
    expect(new Set(exercises.map(({ id }) => id)).size).toBe(exercises.length);
  });

  it("contains valid answers for every interaction type", () => {
    for (const exercise of exercises) {
      if (
        exercise.type === "predict_output" ||
        exercise.type === "fill_blank" ||
        exercise.type === "trace"
      ) {
        const optionIds = exercise.options.map(({ id }) => id);
        expect(new Set(optionIds).size).toBe(optionIds.length);
        expect(optionIds).toContain(exercise.correctOptionId);
      } else if (exercise.type === "find_bug") {
        expect(exercise.correctLineIndex).toBeGreaterThanOrEqual(0);
        expect(exercise.correctLineIndex).toBeLessThan(exercise.codeLines.length);
      } else {
        const blockIds = exercise.blocks.map(({ id }) => id);
        expect(new Set(blockIds).size).toBe(blockIds.length);
        expect([...exercise.correctOrder].sort()).toEqual([...blockIds].sort());
      }
    }
  });
});
