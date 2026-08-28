import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Pool, PoolClient, QueryResult } from "pg";
import { TutorialExerciseService } from "./service.js";

const now = new Date("2026-08-29T12:00:00.000Z");
const userId = "1d6844fc-3e72-48de-bb59-2ef6ddaa32ef";
const idempotencyKey = "52f881f0-930d-41be-8eeb-07305a695869";

function result(rows: unknown[]): QueryResult {
  return { command: "SELECT", rowCount: rows.length, oid: 0, fields: [], rows };
}

function createPool(options: {
  answerKey?: string | number | string[];
  completed?: boolean;
  revealed?: boolean;
} = {}) {
  const statements: Array<{ text: string; values: readonly unknown[] | undefined }> = [];
  let savedCompleted = options.completed ?? false;
  let savedRevealed = options.revealed ?? false;
  let attempts = 0;
  const client = {
    query: async (text: string, values?: readonly unknown[]): Promise<QueryResult> => {
      statements.push({ text, values });
      if (text.includes("FROM tutorial_exercise_submissions s")) return result([]);
      if (text.includes("FROM tutorial_exercises te")) return result([{
        exerciseId: "python-intro-predict-output-1",
        answerKey: options.answerKey ?? "hello",
        points: 5,
        lessonId: "lesson-1",
        courseId: "course-1",
      }]);
      if (text.includes("FROM tutorial_exercise_progress") && text.includes("FOR UPDATE")) {
        return result([{
          attemptsCount: attempts,
          completed: savedCompleted,
          hintUsed: false,
          solutionRevealed: savedRevealed,
          completedAt: savedCompleted ? now : null,
          lastAttemptedAt: now,
        }]);
      }
      if (text.includes("INSERT INTO tutorial_exercise_submissions")) {
        return result([{ submissionId: "submission-1" }]);
      }
      if (text.includes("UPDATE tutorial_exercise_progress SET")) {
        const action = values?.[2];
        const correct = values?.[3] === true;
        if (action === "check") attempts += 1;
        savedCompleted ||= correct;
        savedRevealed ||= action === "reveal";
        return result([{
          attemptsCount: attempts,
          completed: savedCompleted,
          hintUsed: values?.[4] === true,
          solutionRevealed: savedRevealed,
          completedAt: savedCompleted ? now : null,
          lastAttemptedAt: now,
        }]);
      }
      if (text.includes("UPDATE users SET points")) return result([{ points: 15 }]);
      if (text.includes("SELECT points FROM users")) return result([{ points: 10 }]);
      return result([]);
    },
    release: () => undefined,
  } as unknown as PoolClient;
  return { pool: { connect: async () => client } as unknown as Pool, statements };
}

describe("TutorialExerciseService", () => {
  it("validates the answer on the server, awards points once, and completes the lesson", async () => {
    const { pool, statements } = createPool();
    const response = await new TutorialExerciseService(pool).submit(userId, {
      exerciseId: "python-intro-predict-output-1",
      action: "check",
      answer: "hello",
      hintUsed: false,
      idempotencyKey,
    });

    assert.equal(response.isCorrect, true);
    assert.equal(response.pointsAwarded, 5);
    assert.equal(response.progress.completed, true);
    assert.ok(statements.some(({ text }) => text.includes("UPDATE users SET points")));
    assert.ok(statements.some(({ text }) => text.includes("INSERT INTO lesson_progress")));
    assert.ok(statements.some(({ text }) => text.includes("UPDATE enrollments e SET completed_at")));
    assert.equal(statements.at(-1)?.text, "COMMIT");
  });

  it("records incorrect attempts without awarding points", async () => {
    const { pool, statements } = createPool();
    const response = await new TutorialExerciseService(pool).submit(userId, {
      exerciseId: "python-intro-predict-output-1",
      action: "check",
      answer: "wrong",
      hintUsed: true,
      idempotencyKey,
    });

    assert.equal(response.isCorrect, false);
    assert.equal(response.pointsAwarded, 0);
    assert.equal(response.progress.attemptsCount, 1);
    assert.equal(response.progress.hintUsed, true);
    assert.equal(statements.some(({ text }) => text.includes("UPDATE users SET points")), false);
    assert.ok(statements.some(({ text }) => text.includes("INSERT INTO lesson_progress")));
  });

  it("prevents point farming after completion or revealing the solution", async () => {
    for (const state of [{ completed: true }, { revealed: true }]) {
      const { pool, statements } = createPool(state);
      const response = await new TutorialExerciseService(pool).submit(userId, {
        exerciseId: "python-intro-predict-output-1",
        action: "check",
        answer: "hello",
        hintUsed: false,
        idempotencyKey,
      });
      assert.equal(response.isCorrect, true);
      assert.equal(response.pointsAwarded, 0);
      assert.equal(statements.some(({ text }) => text.includes("UPDATE users SET points")), false);
    }
  });

  it("persists solution reveals without marking the exercise complete", async () => {
    const { pool } = createPool();
    const response = await new TutorialExerciseService(pool).submit(userId, {
      exerciseId: "python-intro-predict-output-1",
      action: "reveal",
      hintUsed: true,
      idempotencyKey,
    });

    assert.equal(response.isCorrect, null);
    assert.equal(response.pointsAwarded, 0);
    assert.equal(response.progress.completed, false);
    assert.equal(response.progress.solutionRevealed, true);
  });
});
