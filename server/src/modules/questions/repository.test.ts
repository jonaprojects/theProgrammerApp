import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { QueryResult, QueryResultRow } from "pg";
import type { Queryable } from "../../shared/types.js";
import { QuestionRepository } from "./repository.js";

function result<Row extends QueryResultRow>(rows: Row[]): QueryResult<Row> {
  return { command: "SELECT", rowCount: rows.length, oid: 0, fields: [], rows };
}

describe("QuestionRepository", () => {
  it("counts only published questions with one correct active option", async () => {
    let statement = "";
    const database: Queryable = {
      query: async <Row extends QueryResultRow>(text: string) => {
        statement = text;
        return result([{ id: "topic-1", slug: "python", title: "Python", description: "", questionCount: 50 }] as unknown as Row[]);
      },
    };

    const topics = await new QuestionRepository(database).listTopics();

    assert.equal(topics[0]?.questionCount, 50);
    assert.match(statement, /HAVING count\(\*\) >= 2/);
    assert.match(statement, /count\(\*\) FILTER \(WHERE qo\.is_correct\) = 1/);
  });

  it("delivers eligible questions without answer-key fields and groups their options", async () => {
    const statements: string[] = [];
    const database: Queryable = {
      query: async <Row extends QueryResultRow>(text: string) => {
        statements.push(text);
        if (text.includes("SELECT id FROM topics")) return result([{ id: "topic-1" }] as unknown as Row[]);
        if (text.includes("WITH eligible_questions")) {
          return result([{
            id: "question-1", prompt: "What?", type: "multiple_choice", difficulty: 1,
            codeSnippet: { language: "python", code: "print(1)" },
          }] as unknown as Row[]);
        }
        return result([
          { id: "option-1", questionId: "question-1", label: "A", position: 1 },
          { id: "option-2", questionId: "question-1", label: "B", position: 2 },
        ] as unknown as Row[]);
      },
    };

    const questions = await new QuestionRepository(database).listPublishedByTopic("python", 20);

    assert.equal(questions?.length, 1);
    assert.equal(questions?.[0]?.options.length, 2);
    assert.equal(JSON.stringify(questions).includes("isCorrect"), false);
    assert.match(statements[1] ?? "", /HAVING count\(\*\) >= 2/);
  });

  it("distinguishes an unknown topic from an empty published topic", async () => {
    const missing: Queryable = {
      query: async <Row extends QueryResultRow>() => result([] as Row[]),
    };
    assert.equal(await new QuestionRepository(missing).listPublishedByTopic("missing", 20), null);

    let calls = 0;
    const empty: Queryable = {
      query: async <Row extends QueryResultRow>() => {
        calls += 1;
        return calls === 1
          ? result([{ id: "topic-1" }] as unknown as Row[])
          : result([] as Row[]);
      },
    };
    assert.deepEqual(await new QuestionRepository(empty).listPublishedByTopic("empty", 20), []);
    assert.equal(calls, 2);
  });
});
