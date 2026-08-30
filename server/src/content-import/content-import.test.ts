import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { deterministicUuid } from "./import-service.js";
import { loadLegacyContent } from "./load-content.js";

describe("legacy content importer", () => {
  it("parses and validates the current question and tutorial sources", async () => {
    const bundle = await loadLegacyContent();
    const questionCount = bundle.topics.reduce(
      (total, topic) => total + topic.questions.length,
      0,
    );

    assert.equal(bundle.topics.length, 10);
    assert.equal(questionCount, 561);
    assert.deepEqual(
      bundle.topics.slice(-4).map(({ slug }) => slug),
      ["cybersecurity", "databases", "git", "algorithms"],
    );
    assert.ok(
      bundle.topics.every((topic) => topic.questions.length >= 50),
      "Every category must contain at least 50 valid questions",
    );
    assert.deepEqual(bundle.courses.map(({ slug }) => slug), [
      "python-basics",
      "html-basics",
      "css-basics",
      "javascript-basics",
      "git-basics",
      "sql-basics",
    ]);
    assert.equal(bundle.lessons.length, 89);
    assert.equal(
      bundle.lessons.reduce((total, lesson) => total + lesson.exercises.length, 0),
      95,
    );
    assert.ok(bundle.lessons.every((lesson) => lesson.exercises.length >= 1));
    assert.equal(bundle.lessons.filter((lesson) => lesson.exercises.length === 3).length, 3);
    assert.equal(
      new Set(bundle.lessons.flatMap((lesson) => lesson.exercises.map(({ id }) => id))).size,
      95,
    );
    assert.equal(bundle.rejections.length, 0);
    assert.equal(bundle.normalizations.length, 2);
    assert.ok(bundle.lessons.every((lesson) => lesson.content.length > 0));
    assert.ok(
      bundle.lessons.every(
        (lesson) => lesson.content.filter(({ type }) => type === "paragraph").length >= 3,
      ),
      "Every lesson should contain at least three explanatory paragraphs",
    );
    assert.ok(
      bundle.lessons.every((lesson) => {
        const codeExamples = lesson.content.filter(({ type }) => type === "code").length;
        return lesson.slug === "introduction" ? codeExamples >= 1 : codeExamples >= 2;
      }),
      "Every non-introduction lesson should contain at least two worked code examples",
    );
    assert.equal(bundle.skippedEmptyLessons.length, 0);
    assert.equal(bundle.lessons.filter(({ courseSlug }) => courseSlug === "python-basics").length, 23);
    assert.equal(bundle.lessons.filter(({ courseSlug }) => courseSlug === "html-basics").length, 15);
    assert.equal(bundle.lessons.filter(({ courseSlug }) => courseSlug === "css-basics").length, 15);
    assert.equal(bundle.lessons.filter(({ courseSlug }) => courseSlug === "javascript-basics").length, 12);
    assert.equal(bundle.lessons.filter(({ courseSlug }) => courseSlug === "git-basics").length, 12);
    assert.equal(bundle.lessons.filter(({ courseSlug }) => courseSlug === "sql-basics").length, 12);
    assert.equal(bundle.lessons.at(-1)?.slug, "transactions");
    const codeQuestions = bundle.topics.flatMap(({ questions }) => questions).filter(
      ({ codeSnippet }) => codeSnippet !== null,
    );
    assert.ok(codeQuestions.length >= 8);
    assert.ok(new Set(codeQuestions.map(({ codeSnippet }) => codeSnippet?.language)).size >= 6);
  });

  it("generates stable UUID-shaped content identifiers", () => {
    const first = deterministicUuid("legacy:python:1");
    const second = deterministicUuid("legacy:python:1");

    assert.equal(first, second);
    assert.match(first, /^[0-9a-f]{8}-[0-9a-f]{4}-5[0-9a-f]{3}-a[0-9a-f]{3}-[0-9a-f]{12}$/);
  });
});
