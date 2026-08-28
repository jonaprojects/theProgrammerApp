import type {
  TutorialExerciseAnswer,
  TutorialExerciseDefinition,
} from "./types";

export function emptyExerciseAnswer(
  exercise: TutorialExerciseDefinition,
): TutorialExerciseAnswer {
  return exercise.type === "order_code" ? [] : null;
}

export function correctExerciseAnswer(
  exercise: TutorialExerciseDefinition,
): TutorialExerciseAnswer {
  switch (exercise.type) {
    case "predict_output":
    case "fill_blank":
    case "trace":
      return exercise.correctOptionId;
    case "find_bug":
      return exercise.correctLineIndex;
    case "order_code":
      return [...exercise.correctOrder];
  }
}

export function exerciseAnswerIsComplete(
  exercise: TutorialExerciseDefinition,
  answer: TutorialExerciseAnswer,
): boolean {
  if (exercise.type === "order_code") {
    return Array.isArray(answer) && answer.length === exercise.blocks.length;
  }
  return answer !== null;
}

export function exerciseAnswerIsCorrect(
  exercise: TutorialExerciseDefinition,
  answer: TutorialExerciseAnswer,
): boolean {
  if (exercise.type === "order_code") {
    return (
      Array.isArray(answer) &&
      answer.length === exercise.correctOrder.length &&
      answer.every((blockId, index) => blockId === exercise.correctOrder[index])
    );
  }

  if (exercise.type === "find_bug") {
    return typeof answer === "number" && answer === exercise.correctLineIndex;
  }

  return typeof answer === "string" && answer === exercise.correctOptionId;
}
