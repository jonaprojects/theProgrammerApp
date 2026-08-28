import { readFile } from "node:fs/promises";
import ts from "typescript";
import { collectStaticVariables, evaluateStaticExpression, type StaticValue } from "./static-evaluator.js";
import type { ImportedLesson, ImportedTutorialExercise, LessonContentBlock } from "./types.js";
import { z } from "zod";
import type { CatalogLessonManifestEntry } from "./manifest.js";

function tagName(node: ts.JsxTagNameExpression): string {
  return node.getText();
}

function attributeExpression(
  attributes: ts.JsxAttributes,
  name: string,
): ts.Expression | null {
  const attribute = attributes.properties.find(
    (property): property is ts.JsxAttribute =>
      ts.isJsxAttribute(property) && property.name.getText() === name,
  );
  if (!attribute?.initializer) return null;
  if (ts.isStringLiteral(attribute.initializer)) return attribute.initializer;
  if (ts.isJsxExpression(attribute.initializer)) return attribute.initializer.expression ?? null;
  return null;
}

function staticString(expression: ts.Expression | null, variables: ReadonlyMap<string, StaticValue>): string {
  if (!expression) throw new Error("Required string expression is missing");
  const value = evaluateStaticExpression(expression, variables);
  if (typeof value !== "string") throw new Error("Expected a static string expression");
  return value;
}

function normalizedText(children: readonly ts.JsxChild[], variables: ReadonlyMap<string, StaticValue>): string {
  let text = "";
  for (const child of children) {
    if (ts.isJsxText(child)) {
      text += child.text;
    } else if (ts.isJsxExpression(child) && child.expression) {
      const value = evaluateStaticExpression(child.expression, variables);
      if (typeof value !== "string" && typeof value !== "number") {
        throw new Error("Tutorial text expressions must resolve to strings or numbers");
      }
      text += value;
    } else if (ts.isJsxElement(child)) {
      text += normalizedText(child.children, variables);
    }
  }
  return text.replace(/\s+/g, " ").trim();
}

function imageAssetKey(
  attributes: ts.JsxAttributes,
): string {
  const source = attributeExpression(attributes, "source");
  if (!source || !ts.isCallExpression(source) || source.expression.getText() !== "require") {
    throw new Error("Tutorial images must use a static require() source");
  }
  const argument = source.arguments[0];
  if (!argument || !ts.isStringLiteral(argument)) {
    throw new Error("Tutorial image require() must contain a string path");
  }
  return argument.text.replace(/^@\//, "");
}

function blocksFromChildren(
  children: readonly ts.JsxChild[],
  variables: ReadonlyMap<string, StaticValue>,
): LessonContentBlock[] {
  const blocks: LessonContentBlock[] = [];

  for (const child of children) {
    if (ts.isJsxText(child) || (ts.isJsxExpression(child) && !child.expression)) continue;
    if (ts.isJsxExpression(child)) {
      const text = normalizedText([child], variables);
      if (text) blocks.push({ type: "paragraph", text });
      continue;
    }

    if (ts.isJsxFragment(child)) {
      blocks.push(...blocksFromChildren(child.children, variables));
      continue;
    }

    const opening = ts.isJsxElement(child) ? child.openingElement : child;
    const name = tagName(opening.tagName);
    const attributes = opening.attributes;

    if (name === "Section") {
      if (ts.isJsxElement(child)) blocks.push(...blocksFromChildren(child.children, variables));
      continue;
    }
    if (name === "P") {
      if (!ts.isJsxElement(child)) throw new Error("Paragraph elements cannot be self-closing");
      const text = normalizedText(child.children, variables);
      if (text) blocks.push({ type: "paragraph", text });
      continue;
    }
    if (/^H[1-6]$/.test(name)) {
      if (!ts.isJsxElement(child)) throw new Error("Heading elements cannot be self-closing");
      const text = normalizedText(child.children, variables);
      if (text) blocks.push({ type: "heading", level: Number(name.slice(1)), text });
      continue;
    }
    if (name === "CodeSnippet") {
      blocks.push({
        type: "code",
        language: staticString(attributeExpression(attributes, "language"), variables),
        code: staticString(attributeExpression(attributes, "code"), variables),
      });
      continue;
    }
    if (name === "InteractiveExercise") {
      // Interactive exercises are rendered and persisted by the client. The course API
      // continues to import the surrounding guide text and worked examples.
      continue;
    }
    if (name === "TutorialImage" || name === "Image") {
      blocks.push({ type: "image", assetKey: imageAssetKey(attributes) });
      continue;
    }

    throw new Error(`Unsupported tutorial content component: ${name}`);
  }

  return blocks;
}

const exerciseBaseSchema = z.object({
  id: z.string().min(1),
  prompt: z.string().min(1),
  explanation: z.string().min(1),
  hint: z.string().min(1).optional(),
});
const tutorialExerciseSchema = z.discriminatedUnion("type", [
  exerciseBaseSchema.extend({
    type: z.enum(["predict_output", "fill_blank", "trace"]),
    correctOptionId: z.string().min(1),
  }),
  exerciseBaseSchema.extend({
    type: z.literal("find_bug"),
    correctLineIndex: z.number().int().nonnegative(),
  }),
  exerciseBaseSchema.extend({
    type: z.literal("order_code"),
    correctOrder: z.array(z.string().min(1)).min(1),
  }),
]);

function importedExercise(value: unknown): ImportedTutorialExercise {
  const parsed = tutorialExerciseSchema.parse(value);
  const answerKey = "correctOptionId" in parsed
    ? parsed.correctOptionId
    : "correctLineIndex" in parsed
      ? parsed.correctLineIndex
      : parsed.correctOrder;
  return {
    id: parsed.id,
    type: parsed.type,
    prompt: parsed.prompt,
    explanation: parsed.explanation,
    hint: parsed.hint ?? null,
    answerKey,
  };
}

function exercisesFromChildren(
  children: readonly ts.JsxChild[],
  variables: ReadonlyMap<string, StaticValue>,
): ImportedTutorialExercise[] {
  const exercises: ImportedTutorialExercise[] = [];
  for (const child of children) {
    if (ts.isJsxFragment(child)) {
      exercises.push(...exercisesFromChildren(child.children, variables));
      continue;
    }
    if (!ts.isJsxElement(child) && !ts.isJsxSelfClosingElement(child)) continue;
    const opening = ts.isJsxElement(child) ? child.openingElement : child;
    if (tagName(opening.tagName) === "InteractiveExercise") {
      const expression = attributeExpression(opening.attributes, "exercise");
      if (!expression) throw new Error("InteractiveExercise requires an exercise definition");
      exercises.push(importedExercise(evaluateStaticExpression(expression, variables)));
    }
    if (ts.isJsxElement(child)) {
      exercises.push(...exercisesFromChildren(child.children, variables));
    }
  }
  return exercises;
}

function findTutorialRoot(sourceFile: ts.SourceFile): ts.JsxElement {
  let root: ts.JsxElement | null = null;
  function visit(node: ts.Node): void {
    if (
      !root &&
      ts.isJsxElement(node) &&
      tagName(node.openingElement.tagName) === "PythonTutorialTemplate"
    ) {
      root = node;
      return;
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);
  if (!root) throw new Error("PythonTutorialTemplate root was not found");
  return root;
}

export async function parseLessonFile(
  path: string,
  sourceKey: string,
  slug: string,
  position: number,
): Promise<ImportedLesson> {
  const source = await readFile(path, "utf8");
  if (!source.trim()) throw new Error("Lesson source is empty");
  const sourceFile = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const variables = collectStaticVariables(sourceFile);
  const root = findTutorialRoot(sourceFile);
  const title = staticString(attributeExpression(root.openingElement.attributes, "title"), variables);
  const content = blocksFromChildren(root.children, variables);
  const exercises = exercisesFromChildren(root.children, variables);
  if (content.length === 0) throw new Error("Lesson has no importable content blocks");

  return { sourceKey, slug, title, position, content, exercises };
}

const catalogLessonSchema = z.object({
  title: z.string().min(1),
  intro: z.array(z.string().min(1)),
  sections: z.array(z.object({
    title: z.string().min(1).optional(),
    paragraphs: z.array(z.string().min(1)).optional(),
    code: z.string().min(1).optional(),
    language: z.string().min(1).optional(),
    exercise: tutorialExerciseSchema.optional(),
  })),
  next: z.object({ title: z.string(), path: z.string() }).optional(),
});

export async function parseLessonCatalogFile(
  path: string,
  manifest: readonly CatalogLessonManifestEntry[],
  startingPosition: number,
): Promise<ImportedLesson[]> {
  const source = await readFile(path, "utf8");
  const sourceFile = ts.createSourceFile(path, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  let initializer: ts.Expression | null = null;
  sourceFile.forEachChild((node) => {
    if (!ts.isVariableStatement(node)) return;
    for (const declaration of node.declarationList.declarations) {
      if (ts.isIdentifier(declaration.name) && declaration.name.text === "pythonLessons") {
        initializer = declaration.initializer ?? null;
      }
    }
  });
  if (!initializer) throw new Error("pythonLessons catalog was not found");
  const raw = evaluateStaticExpression(initializer);
  if (!raw || Array.isArray(raw) || typeof raw !== "object") {
    throw new Error("pythonLessons must be a static object");
  }

  return manifest.map((entry, index) => {
    const parsed = catalogLessonSchema.parse(raw[entry.key]);
    const content: LessonContentBlock[] = parsed.intro.map((text) => ({
      type: "paragraph" as const,
      text,
    }));
    for (const section of parsed.sections) {
      if (section.title) content.push({ type: "heading", level: 4, text: section.title });
      for (const text of section.paragraphs ?? []) {
        content.push({ type: "paragraph", text });
      }
      if (section.code) {
        content.push({
          type: "code",
          language: section.language ?? "python",
          code: section.code,
        });
      }
    }
    const exercises = parsed.sections.flatMap(({ exercise }) =>
      exercise ? [importedExercise(exercise)] : [],
    );
    return {
      sourceKey: `catalog:python-lesson:${entry.key}`,
      slug: entry.slug,
      title: parsed.title,
      position: startingPosition + index,
      content,
      exercises,
    };
  });
}
