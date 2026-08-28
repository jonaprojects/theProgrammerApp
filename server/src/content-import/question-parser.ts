import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import ts from "typescript";
import { z } from "zod";
import type { ContentNormalization, ContentRejection, ImportedQuestion } from "./types.js";
import { evaluateStaticExpression, type StaticValue } from "./static-evaluator.js";

const baseQuestion = {
  id: z.number().int().nonnegative(),
  question: z.string().trim().min(1),
  explanation: z.string().trim().min(1).optional(),
  codeSnippet: z.object({
    language: z.string().regex(/^[a-z0-9+#._-]+$/),
    code: z.string().min(1),
  }).optional(),
};
const questionSchema = z.discriminatedUnion("type", [
  z.object({
    ...baseQuestion,
    type: z.literal("multiple"),
    correctAnswer: z.string().trim().min(1),
    incorrectAnswers: z.tuple([z.string().trim().min(1), z.string().trim().min(1), z.string().trim().min(1)]),
  }),
  z.object({
    ...baseQuestion,
    type: z.literal("yesno"),
    correctAnswer: z.boolean(),
  }),
]);

function findQuestionArray(sourceFile: ts.SourceFile): ts.ArrayLiteralExpression {
  let array: ts.ArrayLiteralExpression | null = null;
  sourceFile.forEachChild((node) => {
    if (!ts.isVariableStatement(node)) return;
    for (const declaration of node.declarationList.declarations) {
      if (declaration.initializer && ts.isArrayLiteralExpression(declaration.initializer)) {
        array = declaration.initializer;
      }
    }
  });
  if (!array) throw new Error("No top-level question array was found");
  return array;
}

function findCatalogObject(sourceFile: ts.SourceFile): ts.ObjectLiteralExpression {
  let catalog: ts.ObjectLiteralExpression | null = null;
  sourceFile.forEachChild((node) => {
    if (!ts.isVariableStatement(node)) return;
    for (const declaration of node.declarationList.declarations) {
      if (declaration.initializer && ts.isObjectLiteralExpression(declaration.initializer)) {
        catalog = declaration.initializer;
      }
    }
  });
  if (!catalog) throw new Error("No top-level question catalog object was found");
  return catalog;
}

function stableOptionOrder(sourceKey: string, labels: string[]): string[] {
  return [...labels].sort((left, right) => {
    const leftHash = createHash("sha256").update(`${sourceKey}:${left}`).digest("hex");
    const rightHash = createHash("sha256").update(`${sourceKey}:${right}`).digest("hex");
    return leftHash.localeCompare(rightHash);
  });
}

function expandCompactQuestion(value: StaticValue): StaticValue {
  if (!Array.isArray(value)) return value;
  const [id, question, answer, fourth, fifth] = value;
  if (typeof id !== "number" || typeof question !== "string") return value;
  if (typeof answer === "boolean" && typeof fourth === "string") {
    return { id, question, type: "yesno", correctAnswer: answer, explanation: fourth };
  }
  if (
    typeof answer === "string" &&
    Array.isArray(fourth) &&
    fourth.length === 3 &&
    typeof fifth === "string"
  ) {
    return {
      id,
      question,
      type: "multiple",
      correctAnswer: answer,
      incorrectAnswers: fourth,
      explanation: fifth,
    };
  }
  return value;
}

function normalizeQuestions(
  values: readonly StaticValue[],
  path: string,
  topicSlug: string,
): {
  questions: ImportedQuestion[];
  normalizations: ContentNormalization[];
  rejections: ContentRejection[];
} {
  const questions: ImportedQuestion[] = [];
  const normalizations: ContentNormalization[] = [];
  const rejections: ContentRejection[] = [];
  const idOccurrences = new Map<number, number>();

  values.forEach((value, index) => {
    const raw = expandCompactQuestion(value);
    const parsed = questionSchema.safeParse(raw);
    if (!parsed.success) {
      rejections.push({
        source: path,
        record: `array index ${index}`,
        reason: z.prettifyError(parsed.error),
      });
      return;
    }
    const legacy = parsed.data;
    const occurrence = (idOccurrences.get(legacy.id) ?? 0) + 1;
    idOccurrences.set(legacy.id, occurrence);
    if (occurrence > 1) {
      normalizations.push({
        source: path,
        record: `legacy id ${legacy.id}`,
        action: `Assigned deterministic duplicate suffix ${occurrence}`,
      });
    }

    const sourceKey = `legacy:${topicSlug}:${legacy.id}${occurrence > 1 ? `:duplicate-${occurrence}` : ""}`;
    if (legacy.type === "multiple") {
      const labels = [legacy.correctAnswer, ...legacy.incorrectAnswers];
      if (new Set(labels).size !== labels.length) {
        rejections.push({
          source: path,
          record: `legacy id ${legacy.id}`,
          reason: "Answer labels must be unique",
        });
        return;
      }
      const ordered = stableOptionOrder(sourceKey, labels);
      questions.push({
        sourceKey,
        legacyId: legacy.id,
        prompt: legacy.question,
        explanation: legacy.explanation ?? null,
        type: "multiple_choice",
        codeSnippet: legacy.codeSnippet ?? null,
        options: ordered.map((label, optionIndex) => ({
          label,
          isCorrect: label === legacy.correctAnswer,
          position: optionIndex + 1,
        })),
      });
    } else {
      questions.push({
        sourceKey,
        legacyId: legacy.id,
        prompt: legacy.question,
        explanation: legacy.explanation ?? null,
        type: "boolean",
        codeSnippet: legacy.codeSnippet ?? null,
        options: [
          { label: "נכון", isCorrect: legacy.correctAnswer, position: 1 },
          { label: "לא נכון", isCorrect: !legacy.correctAnswer, position: 2 },
        ],
      });
    }
  });

  return { questions, normalizations, rejections };
}

export async function parseQuestionFile(
  path: string,
  topicSlug: string,
): Promise<ReturnType<typeof normalizeQuestions>> {
  const source = await readFile(path, "utf8");
  const sourceFile = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const array = findQuestionArray(sourceFile);
  const values: StaticValue[] = [];
  const evaluationRejections: ContentRejection[] = [];
  array.elements.forEach((element, index) => {
    try {
      values.push(evaluateStaticExpression(element as ts.Expression));
    } catch (error) {
      evaluationRejections.push({
        source: path,
        record: `array index ${index}`,
        reason: error instanceof Error ? error.message : String(error),
      });
    }
  });
  const parsed = normalizeQuestions(values, path, topicSlug);
  parsed.rejections.unshift(...evaluationRejections);
  return parsed;
}

export async function parseQuestionCatalogFile(
  path: string,
): Promise<Map<string, ReturnType<typeof normalizeQuestions>>> {
  const source = await readFile(path, "utf8");
  const sourceFile = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const rawCatalog = evaluateStaticExpression(findCatalogObject(sourceFile));
  if (!rawCatalog || Array.isArray(rawCatalog) || typeof rawCatalog !== "object") {
    throw new Error("Expanded question catalog must be an object of question arrays");
  }

  const catalog = new Map<string, ReturnType<typeof normalizeQuestions>>();
  for (const [topicSlug, rawQuestions] of Object.entries(rawCatalog)) {
    if (!Array.isArray(rawQuestions)) {
      throw new Error(`Expanded catalog entry ${topicSlug} must be an array`);
    }
    catalog.set(topicSlug, normalizeQuestions(rawQuestions, path, topicSlug));
  }
  return catalog;
}
