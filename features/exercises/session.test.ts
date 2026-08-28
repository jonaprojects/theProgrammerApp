import type { ApiQuestion } from "@/services/api/types";
import {
  createExerciseSession,
  attemptResultMatchesSubmission,
  currentResponse,
  exerciseSessionReducer,
  EXERCISE_SESSION_MAX_AGE_MS,
  restoreExerciseSession,
  summarizeExerciseSession,
} from "./session";

const questions: ApiQuestion[] = [
  {
    id: "question-1",
    prompt: "Question one",
    type: "boolean",
    difficulty: 1,
    codeSnippet: null,
    options: [
      { id: "yes", questionId: "question-1", label: "Yes", position: 1 },
      { id: "no", questionId: "question-1", label: "No", position: 2 },
    ],
  },
  {
    id: "question-2",
    prompt: "Question two",
    type: "multiple_choice",
    difficulty: 1,
    codeSnippet: null,
    options: [
      { id: "a", questionId: "question-2", label: "A", position: 1 },
      { id: "b", questionId: "question-2", label: "B", position: 2 },
    ],
  },
];

describe("exerciseSessionReducer", () => {
  it("locks the selected answer to its idempotency key and reveals the result", () => {
    let state = createExerciseSession("python", questions, 1);
    state = exerciseSessionReducer(state, { type: "select", optionId: "no", now: 2 });
    state = exerciseSessionReducer(state, { type: "submission_started", idempotencyKey: "key-1", now: 3 });
    state = exerciseSessionReducer(state, { type: "select", optionId: "yes", now: 4 });
    expect(currentResponse(state).selectedOptionId).toBe("no");

    state = exerciseSessionReducer(state, {
      type: "answer_revealed",
      now: 5,
      result: {
        id: "attempt-1",
        questionId: "question-1",
        selectedOptionId: "no",
        isCorrect: true,
        pointsAwarded: 10,
        explanation: null,
        correctOptionId: "no",
        correctOptionLabel: "No",
        createdAt: "2026-08-28T00:00:00.000Z",
        replayed: false,
      },
    });
    expect(currentResponse(state)).toMatchObject({ revealed: true, isCorrect: true, pointsAwarded: 10 });
  });

  it("tracks answered, skipped, remaining, score, and accuracy", () => {
    let state = createExerciseSession("python", questions, 1);
    state = exerciseSessionReducer(state, { type: "select", optionId: "no", now: 2 });
    state = exerciseSessionReducer(state, { type: "submission_started", idempotencyKey: "key-1", now: 3 });
    state = exerciseSessionReducer(state, {
      type: "answer_revealed",
      now: 4,
      result: {
        id: "attempt-1", questionId: "question-1", selectedOptionId: "no",
        isCorrect: true, pointsAwarded: 10, explanation: null,
        correctOptionId: "no", correctOptionLabel: "No",
        createdAt: "2026-08-28T00:00:00.000Z", replayed: false,
      },
    });
    state = exerciseSessionReducer(state, { type: "next", now: 5 });
    state = exerciseSessionReducer(state, { type: "skip", now: 6 });

    expect(state.finished).toBe(true);
    expect(summarizeExerciseSession(state)).toEqual({
      answered: 1, correct: 1, skipped: 1, remaining: 0, points: 10, accuracyPercentage: 100,
    });
  });
});

describe("restoreExerciseSession", () => {
  it("restores a recent matching session and rejects stale or malformed data", () => {
    const session = createExerciseSession("python", questions, 100);
    expect(restoreExerciseSession(JSON.stringify(session), "python", 101)).toEqual(session);
    expect(restoreExerciseSession(JSON.stringify(session), "web", 101)).toBeNull();
    expect(restoreExerciseSession(JSON.stringify(session), "python", 100 + EXERCISE_SESSION_MAX_AGE_MS + 1)).toBeNull();
    expect(restoreExerciseSession("{bad json", "python", 101)).toBeNull();
    const malformedResponse = {
      ...session,
      responses: { "question-1": { selectedOptionId: "option-from-another-question" } },
    };
    expect(restoreExerciseSession(JSON.stringify(malformedResponse), "python", 101)).toBeNull();
  });
});

describe("attemptResultMatchesSubmission", () => {
  const result = {
    id: "attempt-1", questionId: "question-1", selectedOptionId: "no",
    isCorrect: true, pointsAwarded: 10, explanation: null,
    correctOptionId: "no", correctOptionLabel: "No",
    createdAt: "2026-08-28T00:00:00.000Z", replayed: false,
  };

  it("accepts only feedback for the submitted question and its options", () => {
    expect(attemptResultMatchesSubmission(questions[0], "no", result)).toBe(true);
    expect(attemptResultMatchesSubmission(questions[0], "yes", result)).toBe(false);
    expect(attemptResultMatchesSubmission(questions[1], "no", result)).toBe(false);
    expect(attemptResultMatchesSubmission(questions[0], "no", { ...result, correctOptionId: "foreign" })).toBe(false);
  });
});
