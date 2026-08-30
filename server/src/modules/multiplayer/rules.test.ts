import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { multiplayerAnswerPoints, roundShouldReveal, winningUserId } from "./rules.js";

describe("multiplayer rules", () => {
  it("awards a bounded speed bonus only for correct answers", () => {
    assert.equal(multiplayerAnswerPoints(false, 0, 20_000), 0);
    assert.equal(multiplayerAnswerPoints(true, 0, 20_000), 1_500);
    assert.equal(multiplayerAnswerPoints(true, 10_000, 20_000), 1_250);
    assert.equal(multiplayerAnswerPoints(true, 99_000, 20_000), 1_000);
  });

  it("reveals only when everyone answered, time ended, or an opponent left", () => {
    assert.equal(roundShouldReveal({ activePlayers: 2, answers: 1, roundEndsAtMs: 2_000, nowMs: 1_000 }), false);
    assert.equal(roundShouldReveal({ activePlayers: 2, answers: 2, roundEndsAtMs: 2_000, nowMs: 1_000 }), true);
    assert.equal(roundShouldReveal({ activePlayers: 2, answers: 0, roundEndsAtMs: 1_000, nowMs: 1_000 }), true);
    assert.equal(roundShouldReveal({ activePlayers: 1, answers: 0, roundEndsAtMs: 2_000, nowMs: 1_000 }), true);
  });

  it("resolves score, correctness tie-breaks, and exact draws", () => {
    assert.equal(winningUserId([
      { userId: "a", score: 2_000, correctCount: 2 },
      { userId: "b", score: 1_900, correctCount: 2 },
    ]), "a");
    assert.equal(winningUserId([
      { userId: "a", score: 2_000, correctCount: 3 },
      { userId: "b", score: 2_000, correctCount: 2 },
    ]), "a");
    assert.equal(winningUserId([
      { userId: "a", score: 2_000, correctCount: 2 },
      { userId: "b", score: 2_000, correctCount: 2 },
    ]), null);
  });
});
