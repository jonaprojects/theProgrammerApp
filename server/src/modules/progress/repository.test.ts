import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { QueryResult, QueryResultRow } from "pg";
import type { Queryable } from "../../shared/types.js";
import { ProgressRepository } from "./repository.js";

function result<Row extends QueryResultRow>(rows: Row[]): QueryResult<Row> {
  return { command: "SELECT", rowCount: rows.length, oid: 0, fields: [], rows };
}

describe("ProgressRepository", () => {
  it("returns aggregate learning statistics", async () => {
    const expected = {
      enrolledCourses: 1,
      completedCourses: 0,
      completedLessons: 4,
      totalLessons: 23,
      answeredQuestions: 8,
      correctlyAnsweredQuestions: 6,
      totalAttempts: 10,
      correctAttempts: 7,
      accuracyPercentage: 70,
      activeDays: 3,
      currentStreakDays: 2,
      lastActivityAt: new Date("2026-08-28T08:00:00.000Z"),
    };
    const database: Queryable = {
      query: async <Row extends QueryResultRow>() => result([expected] as unknown as Row[]),
    };

    const summary = await new ProgressRepository(database).getLearningSummary("user-1");

    assert.deepEqual(summary, expected);
  });

  it("preserves completed lessons and completes the enrollment atomically", async () => {
    let statement = "";
    let values: readonly unknown[] | undefined;
    const database: Queryable = {
      query: async <Row extends QueryResultRow>(text: string, queryValues?: readonly unknown[]) => {
        statement = text;
        values = queryValues;
        return result([{ lessonId: "lesson-1" }] as unknown as Row[]);
      },
    };

    const updated = await new ProgressRepository(database).setLessonProgress(
      "user-1",
      "python-basics",
      "introduction",
      "completed",
    );

    assert.equal(updated, true);
    assert.deepEqual(values, ["user-1", "python-basics", "introduction", "completed"]);
    assert.match(statement, /WHEN lesson_progress\.status = 'completed' THEN 'completed'/);
    assert.match(statement, /UPDATE enrollments/);
    assert.match(statement, /cs\.completed_lessons = cs\.total_lessons/);
  });

  it("calculates topic progress from the same eligible question set it delivers", async () => {
    let statement = "";
    const database: Queryable = {
      query: async <Row extends QueryResultRow>(text: string) => {
        statement = text;
        return result([] as Row[]);
      },
    };

    await new ProgressRepository(database).listTopicProgress("user-1");

    assert.match(statement, /WITH eligible_questions AS/);
    assert.match(statement, /HAVING count\(\*\) >= 2/);
    assert.match(statement, /JOIN eligible_questions q ON q\.id = a\.question_id/);
  });
});
