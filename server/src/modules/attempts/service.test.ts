import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Pool, PoolClient, QueryResult } from "pg";
import { ConflictError } from "../../shared/errors.js";
import { AttemptService } from "./service.js";

const userId = "1d6844fc-3e72-48de-bb59-2ef6ddaa32ef";
const questionId = "15ead27e-cab0-43d9-b0af-8101349e60ac";
const otherQuestionId = "69cb6a67-fd82-4ae5-b06f-4a37a109ad82";
const optionId = "1fdcd92d-5744-419a-9910-2d12d2240f1a";
const otherOptionId = "93855c24-69e6-4aaa-bc0f-7794da037476";
const correctOptionId = "8f6904b6-ebcb-450a-841b-f59297735a95";
const topicId = "28f9b647-26cc-4a72-b5bc-3f3888c01891";
const idempotencyKey = "52f881f0-930d-41be-8eeb-07305a695869";
const createdAt = new Date("2026-08-24T00:00:00.000Z");

function result(rows: unknown[]): QueryResult {
  return { command: "SELECT", rowCount: rows.length, oid: 0, fields: [], rows };
}

type PoolScenario = {
  existing?: boolean;
  selectionExists?: boolean;
  selectionCorrect?: boolean;
  priorCorrect?: boolean;
};

function createPool(scenario: PoolScenario = {}) {
  const statements: Array<{ text: string; values: readonly unknown[] | undefined }> = [];
  const client = {
    query: async (text: string, values?: readonly unknown[]): Promise<QueryResult> => {
      statements.push({ text, values });
      if (text.includes("SELECT id FROM users")) return result([{ id: userId }]);
      if (text.includes("FROM attempts a")) {
        return result(scenario.existing ? [{
          id: "746a0ced-8d07-40b2-b639-d8c82d6e430b",
          questionId,
          selectedOptionId: optionId,
          isCorrect: true,
          pointsAwarded: 10,
          explanation: "Because it is correct",
          correctOptionId,
          correctOptionLabel: "Correct answer",
          createdAt,
          replayed: true,
        }] : []);
      }
      if (text.includes("FROM questions q")) {
        if (scenario.selectionExists === false) return result([]);
        return result([{
          questionId,
          topicId,
          explanation: "Because it is correct",
          isCorrect: scenario.selectionCorrect ?? true,
          correctOptionId,
          correctOptionLabel: "Correct answer",
        }]);
      }
      if (text.includes("SELECT 1 FROM attempts")) return result(scenario.priorCorrect ? [{ exists: 1 }] : []);
      if (text.includes("INSERT INTO attempts")) {
        return result([{
          id: "746a0ced-8d07-40b2-b639-d8c82d6e430b",
          questionId,
          selectedOptionId: optionId,
          isCorrect: scenario.selectionCorrect ?? true,
          pointsAwarded: scenario.selectionCorrect === false || scenario.priorCorrect ? 0 : 10,
          createdAt,
          replayed: false,
        }]);
      }
      return result([]);
    },
    release: () => undefined,
  } as unknown as PoolClient;

  return { pool: { connect: async () => client } as unknown as Pool, statements };
}

describe("AttemptService", () => {
  it("awards points once and snapshots feedback with the attempt", async () => {
    const { pool, statements } = createPool();
    const attempt = await new AttemptService(pool).submit(userId, {
      questionId, selectedOptionId: optionId, idempotencyKey, timeSpentSeconds: 12,
    });

    assert.equal(attempt.isCorrect, true);
    assert.equal(attempt.pointsAwarded, 10);
    assert.equal(attempt.replayed, false);
    assert.ok(statements.some(({ text }) => text.includes("UPDATE users SET points")));
    assert.ok(statements.some(({ text }) => text.includes("INSERT INTO user_topic_progress")));
    const insert = statements.find(({ text }) => text.includes("INSERT INTO attempts"));
    assert.deepEqual(insert?.values?.slice(6), [12, "Because it is correct", correctOptionId, "Correct answer"]);
    assert.equal(statements.at(-1)?.text, "COMMIT");
  });

  it("returns an exact idempotent replay without mutating points or progress", async () => {
    const { pool, statements } = createPool({ existing: true });
    const attempt = await new AttemptService(pool).submit(userId, {
      questionId, selectedOptionId: optionId, idempotencyKey,
    });

    assert.equal(attempt.replayed, true);
    assert.equal(attempt.pointsAwarded, 10);
    assert.equal(statements.some(({ text }) => text.includes("UPDATE users SET points")), false);
    assert.equal(statements.some(({ text }) => text.includes("INSERT INTO user_topic_progress")), false);
  });

  it("rejects reuse of an idempotency key for a different payload", async () => {
    const { pool, statements } = createPool({ existing: true });

    await assert.rejects(
      new AttemptService(pool).submit(userId, {
        questionId: otherQuestionId,
        selectedOptionId: otherOptionId,
        idempotencyKey,
      }),
      (error: unknown) => error instanceof ConflictError && error.code === "IDEMPOTENCY_KEY_REUSED",
    );
    assert.equal(statements.at(-1)?.text, "ROLLBACK");
  });

  it("does not award points for an incorrect answer", async () => {
    const { pool, statements } = createPool({ selectionCorrect: false });
    const attempt = await new AttemptService(pool).submit(userId, {
      questionId, selectedOptionId: optionId, idempotencyKey,
    });

    assert.equal(attempt.isCorrect, false);
    assert.equal(attempt.pointsAwarded, 0);
    assert.equal(statements.some(({ text }) => text.includes("UPDATE users SET points")), false);
    assert.ok(statements.some(({ text }) => text.includes("INSERT INTO user_topic_progress")));
  });

  it("does not award points twice for the same question", async () => {
    const { pool, statements } = createPool({ priorCorrect: true });
    const attempt = await new AttemptService(pool).submit(userId, {
      questionId, selectedOptionId: optionId, idempotencyKey,
    });

    assert.equal(attempt.isCorrect, true);
    assert.equal(attempt.pointsAwarded, 0);
    assert.equal(statements.some(({ text }) => text.includes("UPDATE users SET points")), false);
  });

  it("rolls back an option that does not belong to the published question", async () => {
    const { pool, statements } = createPool({ selectionExists: false });

    await assert.rejects(
      new AttemptService(pool).submit(userId, { questionId, selectedOptionId: optionId, idempotencyKey }),
      (error: unknown) => error instanceof ConflictError && error.code === "INVALID_QUESTION_OPTION",
    );
    assert.equal(statements.at(-1)?.text, "ROLLBACK");
  });
});
