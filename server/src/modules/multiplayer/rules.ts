export function multiplayerAnswerPoints(
  correct: boolean,
  responseMs: number,
  roundDurationMs: number,
): number {
  if (!correct) return 0;
  const safeDuration = Math.max(1, roundDurationMs);
  const safeResponse = Math.max(0, Math.min(safeDuration, responseMs));
  return 1_000 + Math.floor(((safeDuration - safeResponse) / safeDuration) * 500);
}

export function roundShouldReveal(input: {
  activePlayers: number;
  answers: number;
  roundEndsAtMs: number;
  nowMs: number;
}): boolean {
  return input.activePlayers < 2 || input.answers >= input.activePlayers || input.roundEndsAtMs <= input.nowMs;
}

export function winningUserId(
  leaders: readonly { userId: string; score: number; correctCount: number }[],
): string | null {
  const [first, second] = [...leaders].sort(
    (a, b) => b.score - a.score || b.correctCount - a.correctCount,
  );
  if (!first) return null;
  if (second && first.score === second.score && first.correctCount === second.correctCount) return null;
  return first.userId;
}
