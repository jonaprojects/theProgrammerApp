import {
  correctExerciseAnswer,
  emptyExerciseAnswer,
  exerciseAnswerIsComplete,
  exerciseAnswerIsCorrect,
} from "./logic";
import type { TutorialExerciseDefinition } from "./types";

const choice: TutorialExerciseDefinition = {
  id: "choice",
  type: "predict_output",
  prompt: "What is printed?",
  code: "print(2)",
  options: [
    { id: "one", label: "1" },
    { id: "two", label: "2" },
  ],
  correctOptionId: "two",
  explanation: "Python prints 2.",
};

const bug: TutorialExerciseDefinition = {
  id: "bug",
  type: "find_bug",
  prompt: "Find the bug",
  codeLines: ["if True", "    print('yes')"],
  correctLineIndex: 0,
  explanation: "The colon is missing.",
};

const order: TutorialExerciseDefinition = {
  id: "order",
  type: "order_code",
  prompt: "Order the lines",
  blocks: [
    { id: "b", code: "print(value)" },
    { id: "a", code: "value = 1" },
  ],
  correctOrder: ["a", "b"],
  explanation: "Create the value before printing it.",
};

const multiSelect: TutorialExerciseDefinition = {
  id: "multi",
  type: "select_multiple",
  prompt: "Select every comparison",
  options: [
    { id: "a", label: "a > 1" },
    { id: "b", label: "b = 1" },
    { id: "c", label: "c == 1" },
  ],
  correctOptionIds: ["a", "c"],
  explanation: "Two options compare values.",
};

const matching: TutorialExerciseDefinition = {
  id: "matching",
  type: "match_pairs",
  prompt: "Match the terms",
  leftItems: [{ id: "p", label: "padding" }, { id: "m", label: "margin" }],
  rightItems: [{ id: "in", label: "inside" }, { id: "out", label: "outside" }],
  correctMatches: ["p:in", "m:out"],
  explanation: "Padding is inside and margin is outside.",
};

describe("tutorial exercise logic", () => {
  it("evaluates choice and bug answers", () => {
    expect(exerciseAnswerIsCorrect(choice, "two")).toBe(true);
    expect(exerciseAnswerIsCorrect(choice, "one")).toBe(false);
    expect(exerciseAnswerIsCorrect(bug, 0)).toBe(true);
    expect(exerciseAnswerIsCorrect(bug, 1)).toBe(false);
  });

  it("requires every code block and checks its exact order", () => {
    expect(exerciseAnswerIsComplete(order, ["a"])).toBe(false);
    expect(exerciseAnswerIsComplete(order, ["a", "b"])).toBe(true);
    expect(exerciseAnswerIsCorrect(order, ["a", "b"])).toBe(true);
    expect(exerciseAnswerIsCorrect(order, ["b", "a"])).toBe(false);
  });

  it("provides safe empty and correct answers for resets and reveal", () => {
    expect(emptyExerciseAnswer(choice)).toBeNull();
    expect(emptyExerciseAnswer(order)).toEqual([]);
    expect(correctExerciseAnswer(bug)).toBe(0);
    expect(correctExerciseAnswer(order)).toEqual(["a", "b"]);
    expect(emptyExerciseAnswer(multiSelect)).toEqual([]);
    expect(correctExerciseAnswer(matching)).toEqual(["p:in", "m:out"]);
  });

  it("checks multi-select and matching answers in their stable display order", () => {
    expect(exerciseAnswerIsComplete(multiSelect, ["a"])).toBe(true);
    expect(exerciseAnswerIsCorrect(multiSelect, ["a", "c"])).toBe(true);
    expect(exerciseAnswerIsCorrect(multiSelect, ["c", "a"])).toBe(false);
    expect(exerciseAnswerIsComplete(matching, ["p:in"])).toBe(false);
    expect(exerciseAnswerIsComplete(matching, ["p:in", "m:out"])).toBe(true);
    expect(exerciseAnswerIsCorrect(matching, ["p:in", "m:out"])).toBe(true);
  });
});
