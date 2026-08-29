import { readdir, readFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseLessonCatalogFile, parseLessonFile } from "./lesson-parser.js";
import {
  expandedCatalogSourceFiles,
  courseManifest,
  cssLessonCatalogManifest,
  gitLessonCatalogManifest,
  htmlLessonCatalogManifest,
  javascriptLessonCatalogManifest,
  pythonLessonCatalogManifest,
  pythonLessonManifest,
  sqlLessonCatalogManifest,
  topicManifest,
} from "./manifest.js";
import { parseQuestionCatalogFile, parseQuestionFile } from "./question-parser.js";
import type { ContentBundle, ImportedLesson, ImportedTopic } from "./types.js";

export const projectRoot = fileURLToPath(new URL("../../../", import.meta.url));

export async function loadLegacyContent(root = projectRoot): Promise<ContentBundle> {
  const questionDirectory = resolve(root, "data", "questions");
  const tutorialDirectory = resolve(root, "app", "tutorials", "python");
  const topics: ImportedTopic[] = [];
  const lessons: ImportedLesson[] = [];
  const normalizations: ContentBundle["normalizations"] = [];
  const rejections: ContentBundle["rejections"] = [];
  const expandedCatalogs = await Promise.all(
    expandedCatalogSourceFiles.map((file) =>
      parseQuestionCatalogFile(join(questionDirectory, file)),
    ),
  );

  for (const topic of topicManifest) {
    const legacy = topic.sourceFile
      ? await parseQuestionFile(join(questionDirectory, topic.sourceFile), topic.slug)
      : { questions: [], normalizations: [], rejections: [] };
    const expanded = expandedCatalogs.map((catalog) =>
      catalog.get(topic.slug) ?? { questions: [], normalizations: [], rejections: [] },
    );
    topics.push({
      slug: topic.slug,
      title: topic.title,
      description: topic.description,
      questions: [
        ...legacy.questions,
        ...expanded.flatMap(({ questions }) => questions),
      ],
    });
    normalizations.push(
      ...legacy.normalizations,
      ...expanded.flatMap(({ normalizations: items }) => items),
    );
    rejections.push(
      ...legacy.rejections,
      ...expanded.flatMap(({ rejections: items }) => items),
    );
  }

  for (const [index, lesson] of pythonLessonManifest.entries()) {
    try {
      lessons.push(
        await parseLessonFile(
          join(tutorialDirectory, lesson.sourceFile),
          `legacy:python-lesson:${lesson.sourceFile}`,
          lesson.slug,
          index + 1,
        ),
      );
    } catch (error) {
      rejections.push({
        source: join(tutorialDirectory, lesson.sourceFile),
        record: lesson.sourceFile,
        reason: error instanceof Error ? error.message : String(error),
      });
    }
  }

  const lessonCatalogPath = resolve(root, "data", "tutorials", "python", "lessons.ts");
  try {
    lessons.push(
      ...(await parseLessonCatalogFile(
        lessonCatalogPath,
        pythonLessonCatalogManifest,
        pythonLessonManifest.length + 1,
      )),
    );
  } catch (error) {
    rejections.push({
      source: lessonCatalogPath,
      record: "pythonLessons",
      reason: error instanceof Error ? error.message : String(error),
    });
  }

  const htmlLessonCatalogPath = resolve(root, "data", "tutorials", "html", "lessons.ts");
  try {
    lessons.push(...(await parseLessonCatalogFile(
      htmlLessonCatalogPath,
      htmlLessonCatalogManifest,
      1,
      {
        variableName: "htmlLessons",
        sourceKeyPrefix: "catalog:html-lesson",
        courseSlug: "html-basics",
        defaultLanguage: "html",
      },
    )));
  } catch (error) {
    rejections.push({
      source: htmlLessonCatalogPath,
      record: "htmlLessons",
      reason: error instanceof Error ? error.message : String(error),
    });
  }

  const cssLessonCatalogPath = resolve(root, "data", "tutorials", "css", "lessons.ts");
  try {
    lessons.push(...(await parseLessonCatalogFile(
      cssLessonCatalogPath,
      cssLessonCatalogManifest,
      1,
      {
        variableName: "cssLessons",
        sourceKeyPrefix: "catalog:css-lesson",
        courseSlug: "css-basics",
        defaultLanguage: "css",
      },
    )));
  } catch (error) {
    rejections.push({
      source: cssLessonCatalogPath,
      record: "cssLessons",
      reason: error instanceof Error ? error.message : String(error),
    });
  }

  const additionalCatalogs = [
    {
      path: resolve(root, "data", "tutorials", "javascript", "lessons.ts"),
      manifest: javascriptLessonCatalogManifest,
      variableName: "javascriptLessons",
      sourceKeyPrefix: "catalog:javascript-lesson",
      courseSlug: "javascript-basics",
      defaultLanguage: "javascript",
    },
    {
      path: resolve(root, "data", "tutorials", "git", "lessons.ts"),
      manifest: gitLessonCatalogManifest,
      variableName: "gitLessons",
      sourceKeyPrefix: "catalog:git-lesson",
      courseSlug: "git-basics",
      defaultLanguage: "bash",
    },
    {
      path: resolve(root, "data", "tutorials", "sql", "lessons.ts"),
      manifest: sqlLessonCatalogManifest,
      variableName: "sqlLessons",
      sourceKeyPrefix: "catalog:sql-lesson",
      courseSlug: "sql-basics",
      defaultLanguage: "sql",
    },
  ] as const;

  for (const catalog of additionalCatalogs) {
    try {
      lessons.push(...(await parseLessonCatalogFile(
        catalog.path,
        catalog.manifest,
        1,
        {
          variableName: catalog.variableName,
          sourceKeyPrefix: catalog.sourceKeyPrefix,
          courseSlug: catalog.courseSlug,
          defaultLanguage: catalog.defaultLanguage,
        },
      )));
    } catch (error) {
      rejections.push({
        source: catalog.path,
        record: catalog.variableName,
        reason: error instanceof Error ? error.message : String(error),
      });
    }
  }

  const importedFiles = new Set([
    ...pythonLessonManifest.map(({ sourceFile }) => sourceFile),
    ...pythonLessonCatalogManifest.map(({ key }) => `${key}.tsx`),
  ]);
  const tutorialFiles = (await readdir(tutorialDirectory)).filter(
    (file) => file.endsWith(".tsx") && !["CourseTableOfContents.tsx", "PythonTutorialTemplate.tsx"].includes(file),
  );
  const skippedEmptyLessons: string[] = [];
  for (const file of tutorialFiles) {
    if (importedFiles.has(file)) continue;
    const source = await readFile(join(tutorialDirectory, file), "utf8");
    if (!source.trim()) skippedEmptyLessons.push(file);
  }
  skippedEmptyLessons.sort();

  return { topics, courses: [...courseManifest], lessons, skippedEmptyLessons, normalizations, rejections };
}
