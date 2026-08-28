import type { ApiAttemptResult, ApiQuestion } from "@/services/api/types";

export const EXERCISE_SESSION_VERSION = 1;
export const EXERCISE_SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000;

export type ExerciseResponse = {
  selectedOptionId: string | null;
  correctOptionId: string | null;
  correctOptionLabel: string | null;
  explanation: string | null;
  revealed: boolean;
  isCorrect: boolean | null;
  pointsAwarded: number;
  skipped: boolean;
  idempotencyKey: string | null;
  error: string | null;
};

export type ExerciseSessionState = {
  version: typeof EXERCISE_SESSION_VERSION;
  topic: string;
  questions: ApiQuestion[];
  currentQuestionIndex: number;
  responses: Record<string, ExerciseResponse>;
  finished: boolean;
  updatedAt: number;
};

export const EMPTY_EXERCISE_RESPONSE: ExerciseResponse = {
  selectedOptionId: null,
  correctOptionId: null,
  correctOptionLabel: null,
  explanation: null,
  revealed: false,
  isCorrect: null,
  pointsAwarded: 0,
  skipped: false,
  idempotencyKey: null,
  error: null,
};

export type ExerciseSessionAction =
  | { type: "select"; optionId: string; now?: number }
  | { type: "submission_started"; idempotencyKey: string; now?: number }
  | { type: "answer_revealed"; result: ApiAttemptResult; now?: number }
  | { type: "submission_failed"; error: string; now?: number }
  | { type: "skip"; now?: number }
  | { type: "next"; now?: number }
  | { type: "finish"; now?: number }
  | { type: "restart"; now?: number };

export function createExerciseSession(
  topic: string,
  questions: ApiQuestion[],
  now = Date.now(),
): ExerciseSessionState {
  return {
    version: EXERCISE_SESSION_VERSION,
    topic,
    questions,
    currentQuestionIndex: 0,
    responses: {},
    finished: false,
    updatedAt: now,
  };
}

export function currentQuestion(state: ExerciseSessionState): ApiQuestion | null {
  return state.questions[state.currentQuestionIndex] ?? null;
}

export function currentResponse(state: ExerciseSessionState): ExerciseResponse {
  const question = currentQuestion(state);
  return question ? state.responses[question.id] ?? EMPTY_EXERCISE_RESPONSE : EMPTY_EXERCISE_RESPONSE;
}

function updateCurrentResponse(
  state: ExerciseSessionState,
  update: Partial<ExerciseResponse>,
  now: number,
): ExerciseSessionState {
  const question = currentQuestion(state);
  if (!question) return state;
  return {
    ...state,
    responses: {
      ...state.responses,
      [question.id]: { ...(state.responses[question.id] ?? EMPTY_EXERCISE_RESPONSE), ...update },
    },
    updatedAt: now,
  };
}

function moveForward(state: ExerciseSessionState, now: number): ExerciseSessionState {
  if (state.currentQuestionIndex >= state.questions.length - 1) {
    return { ...state, finished: true, updatedAt: now };
  }
  return { ...state, currentQuestionIndex: state.currentQuestionIndex + 1, updatedAt: now };
}

export function exerciseSessionReducer(
  state: ExerciseSessionState,
  action: ExerciseSessionAction,
): ExerciseSessionState {
  const now = action.now ?? Date.now();
  const response = currentResponse(state);
  switch (action.type) {
    case "select":
      if (response.revealed || response.idempotencyKey) return state;
      return updateCurrentResponse(state, {
        selectedOptionId: action.optionId,
        skipped: false,
        error: null,
      }, now);
    case "submission_started":
      if (!response.selectedOptionId || response.revealed) return state;
      return updateCurrentResponse(state, { idempotencyKey: action.idempotencyKey, error: null }, now);
    case "answer_revealed":
      return updateCurrentResponse(state, {
        revealed: true,
        isCorrect: action.result.isCorrect,
        correctOptionId: action.result.correctOptionId,
        correctOptionLabel: action.result.correctOptionLabel,
        explanation: action.result.explanation,
        pointsAwarded: action.result.pointsAwarded,
        error: null,
      }, now);
    case "submission_failed":
      return updateCurrentResponse(state, { error: action.error }, now);
    case "skip": {
      if (response.revealed || response.idempotencyKey) return state;
      const skipped = updateCurrentResponse(state, { skipped: true, error: null }, now);
      return moveForward(skipped, now);
    }
    case "next":
      if (!response.revealed) return state;
      return moveForward(state, now);
    case "finish":
      return { ...state, finished: true, updatedAt: now };
    case "restart":
      return createExerciseSession(state.topic, state.questions, now);
  }
}

export function restoreExerciseSession(
  serialized: string | null,
  topic: string,
  now = Date.now(),
): ExerciseSessionState | null {
  if (!serialized) return null;
  try {
    const candidate = JSON.parse(serialized) as Partial<ExerciseSessionState>;
    if (
      candidate.version !== EXERCISE_SESSION_VERSION ||
      candidate.topic !== topic ||
      !Array.isArray(candidate.questions) ||
      candidate.questions.length === 0 ||
      typeof candidate.currentQuestionIndex !== "number" ||
      candidate.currentQuestionIndex < 0 ||
      candidate.currentQuestionIndex >= candidate.questions.length ||
      !candidate.responses ||
      typeof candidate.responses !== "object" ||
      typeof candidate.finished !== "boolean" ||
      typeof candidate.updatedAt !== "number" ||
      now - candidate.updatedAt > EXERCISE_SESSION_MAX_AGE_MS
    ) return null;

    const questionsAreUsable = candidate.questions.every((question) =>
      question &&
      typeof question.id === "string" &&
      typeof question.prompt === "string" &&
      Array.isArray(question.options) &&
      question.options.length >= 2,
    );
    if (!questionsAreUsable) return null;
    const questionById = new Map(candidate.questions.map((question) => [question.id, question]));
    const responsesAreUsable = Object.entries(candidate.responses).every(([questionId, rawResponse]) => {
      const question = questionById.get(questionId);
      if (!question || !rawResponse || typeof rawResponse !== "object") return false;
      const response = rawResponse as Partial<ExerciseResponse>;
      const optionIds = new Set(question.options.map(({ id }) => id));
      return (
        (response.selectedOptionId === null || (typeof response.selectedOptionId === "string" && optionIds.has(response.selectedOptionId))) &&
        (response.correctOptionId === null || (typeof response.correctOptionId === "string" && optionIds.has(response.correctOptionId))) &&
        (response.correctOptionLabel === null || typeof response.correctOptionLabel === "string") &&
        (response.explanation === null || typeof response.explanation === "string") &&
        typeof response.revealed === "boolean" &&
        (response.isCorrect === null || typeof response.isCorrect === "boolean") &&
        typeof response.pointsAwarded === "number" && response.pointsAwarded >= 0 &&
        typeof response.skipped === "boolean" &&
        (response.idempotencyKey === null || typeof response.idempotencyKey === "string") &&
        (response.error === null || typeof response.error === "string")
      );
    });
    if (!responsesAreUsable) return null;
    return candidate as ExerciseSessionState;
  } catch {
    return null;
  }
}

export function summarizeExerciseSession(state: ExerciseSessionState) {
  const responses = Object.values(state.responses);
  const answered = responses.filter(({ revealed }) => revealed);
  const correct = answered.filter(({ isCorrect }) => isCorrect).length;
  const skipped = responses.filter(({ skipped }) => skipped).length;
  return {
    answered: answered.length,
    correct,
    skipped,
    remaining: Math.max(0, state.questions.length - answered.length - skipped),
    points: answered.reduce((sum, response) => sum + response.pointsAwarded, 0),
    accuracyPercentage: answered.length === 0 ? 0 : Math.round(100 * correct / answered.length),
  };
}

export function attemptResultMatchesSubmission(
  question: ApiQuestion,
  selectedOptionId: string,
  result: ApiAttemptResult,
): boolean {
  const optionIds = new Set(question.options.map(({ id }) => id));
  return (
    result.questionId === question.id &&
    result.selectedOptionId === selectedOptionId &&
    optionIds.has(result.selectedOptionId) &&
    optionIds.has(result.correctOptionId)
  );
}
