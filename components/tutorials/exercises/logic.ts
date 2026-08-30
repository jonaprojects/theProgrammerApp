import type {
  TutorialExerciseAnswer,
  TutorialExerciseDefinition,
} from "./types";

export function emptyExerciseAnswer(
  exercise: TutorialExerciseDefinition,
): TutorialExerciseAnswer {
  return exercise.type === "order_code" ||
    exercise.type === "select_multiple" ||
    exercise.type === "match_pairs"
    ? []
    : null;
}

export function correctExerciseAnswer(
  exercise: TutorialExerciseDefinition,
): TutorialExerciseAnswer {
  switch (exercise.type) {
    case "predict_output":
    case "fill_blank":
    case "trace":
      return exercise.correctOptionId;
    case "select_multiple":
      return [...exercise.correctOptionIds];
    case "match_pairs":
      return [...exercise.correctMatches];
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
  if (exercise.type === "select_multiple") {
    return Array.isArray(answer) && answer.length > 0;
  }
  if (exercise.type === "match_pairs") {
    return Array.isArray(answer) && answer.length === exercise.leftItems.length;
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

  if (exercise.type === "select_multiple") {
    return (
      Array.isArray(answer) &&
      answer.length === exercise.correctOptionIds.length &&
      answer.every((optionId, index) => optionId === exercise.correctOptionIds[index])
    );
  }

  if (exercise.type === "match_pairs") {
    return (
      Array.isArray(answer) &&
      answer.length === exercise.correctMatches.length &&
      answer.every((match, index) => match === exercise.correctMatches[index])
    );
  }

  if (exercise.type === "find_bug") {
    return typeof answer === "number" && answer === exercise.correctLineIndex;
  }

  return typeof answer === "string" && answer === exercise.correctOptionId;
}
