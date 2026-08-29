import { createHash } from "node:crypto";
import type { Pool, PoolClient } from "pg";
import { withTransaction } from "../db/transaction.js";
import type { ContentBundle, ImportedQuestion } from "./types.js";

export interface ImportSummary {
  topics: number;
  questions: number;
  options: number;
  courses: number;
  lessons: number;
  tutorialExercises: number;
  skippedEmptyLessons: string[];
  normalizations: ContentBundle["normalizations"];
  rejections: ContentBundle["rejections"];
}

export function deterministicUuid(key: string): string {
  const hex = createHash("sha256").update(`the-programmer:${key}`).digest("hex").slice(0, 32);
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-5${hex.slice(13, 16)}-a${hex.slice(17, 20)}-${hex.slice(20)}`;
}

async function importQuestion(
  database: PoolClient,
  topicId: string,
  question: ImportedQuestion,
): Promise<number> {
  const questionId = deterministicUuid(question.sourceKey);
  const questionResult = await database.query<{ id: string }>(`
    INSERT INTO questions (
      id, topic_id, prompt, explanation, type, difficulty, status, source_key,
      code, code_language
    ) VALUES ($1, $2, $3, $4, $5, 1, 'published', $6, $7, $8)
    ON CONFLICT (source_key) DO UPDATE SET
      topic_id = EXCLUDED.topic_id,
      prompt = EXCLUDED.prompt,
      explanation = EXCLUDED.explanation,
      type = EXCLUDED.type,
      code = EXCLUDED.code,
      code_language = EXCLUDED.code_language,
      status = 'published'
    RETURNING id
  `, [
    questionId,
    topicId,
    question.prompt,
    question.explanation,
    question.type,
    question.sourceKey,
    question.codeSnippet?.code ?? null,
    question.codeSnippet?.language ?? null,
  ]);
  const persistedQuestionId = questionResult.rows[0]?.id;
  if (!persistedQuestionId) throw new Error(`Question upsert returned no id for ${question.sourceKey}`);

  await database.query(
    "UPDATE question_options SET active = false WHERE question_id = $1",
    [persistedQuestionId],
  );
  for (const option of question.options) {
    const optionId = deterministicUuid(`${question.sourceKey}:option:${option.position}`);
    await database.query(`
      INSERT INTO question_options (
        id, question_id, label, is_correct, position, active
      ) VALUES ($1, $2, $3, $4, $5, true)
      ON CONFLICT (question_id, position) DO UPDATE SET
        label = EXCLUDED.label,
        is_correct = EXCLUDED.is_correct,
        active = true
    `, [optionId, persistedQuestionId, option.label, option.isCorrect, option.position]);
  }
  return question.options.length;
}

export class ContentImportService {
  constructor(private readonly pool: Pool) {}

  async import(bundle: ContentBundle): Promise<ImportSummary> {
    return withTransaction(this.pool, async (database) => {
      let questionCount = 0;
      let optionCount = 0;

      for (const topic of bundle.topics) {
        const topicId = deterministicUuid(`topic:${topic.slug}`);
        const topicResult = await database.query<{ id: string }>(`
          INSERT INTO topics (id, slug, title, description)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (slug) DO UPDATE SET
            title = EXCLUDED.title,
            description = EXCLUDED.description
          RETURNING id
        `, [topicId, topic.slug, topic.title, topic.description]);
        const persistedTopicId = topicResult.rows[0]?.id;
        if (!persistedTopicId) throw new Error(`Topic upsert returned no id for ${topic.slug}`);

        for (const question of topic.questions) {
          optionCount += await importQuestion(database, persistedTopicId, question);
          questionCount += 1;
        }
      }

      for (const course of bundle.courses) {
      const courseId = deterministicUuid(`course:${course.slug}`);
      const courseResult = await database.query<{ id: string }>(`
        INSERT INTO courses (
          id, slug, title, description, language_code, image_key, status
        ) VALUES ($1, $2, $3, $4, $5, $6, 'published')
        ON CONFLICT (slug) DO UPDATE SET
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          language_code = EXCLUDED.language_code,
          image_key = EXCLUDED.image_key,
          status = 'published'
        RETURNING id
      `, [
        courseId,
        course.slug,
        course.title,
        course.description,
        course.languageCode,
        course.imageKey,
      ]);
      const persistedCourseId = courseResult.rows[0]?.id;
      if (!persistedCourseId) throw new Error(`Course upsert returned no id for ${course.slug}`);

      for (const lesson of bundle.lessons.filter(({ courseSlug }) => courseSlug === course.slug)) {
        const lessonId = deterministicUuid(lesson.sourceKey);
        const lessonResult = await database.query<{ id: string }>(`
          INSERT INTO lessons (
            id, course_id, slug, title, position, content, status, source_key
          ) VALUES ($1, $2, $3, $4, $5, $6::jsonb, 'published', $7)
          ON CONFLICT (source_key) DO UPDATE SET
            course_id = EXCLUDED.course_id,
            slug = EXCLUDED.slug,
            title = EXCLUDED.title,
            position = EXCLUDED.position,
            content = EXCLUDED.content,
            status = 'published'
          RETURNING id
        `, [
          lessonId,
          persistedCourseId,
          lesson.slug,
          lesson.title,
          lesson.position,
          JSON.stringify(lesson.content),
          lesson.sourceKey,
        ]);
        const persistedLessonId = lessonResult.rows[0]?.id;
        if (!persistedLessonId) throw new Error(`Lesson upsert returned no id for ${lesson.sourceKey}`);

        const activeExerciseIds: string[] = [];
        for (const exercise of lesson.exercises) {
          activeExerciseIds.push(exercise.id);
          await database.query(`
            INSERT INTO tutorial_exercises (
              id, lesson_id, type, prompt, explanation, hint, answer_key, status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, 'published')
            ON CONFLICT (id) DO UPDATE SET
              lesson_id = EXCLUDED.lesson_id,
              type = EXCLUDED.type,
              prompt = EXCLUDED.prompt,
              explanation = EXCLUDED.explanation,
              hint = EXCLUDED.hint,
              answer_key = EXCLUDED.answer_key,
              status = 'published',
              updated_at = now()
          `, [
            exercise.id,
            persistedLessonId,
            exercise.type,
            exercise.prompt,
            exercise.explanation,
            exercise.hint,
            JSON.stringify(exercise.answerKey),
          ]);
        }
        await database.query(`
          UPDATE tutorial_exercises
          SET status = 'archived', updated_at = now()
          WHERE lesson_id = $1 AND NOT (id = ANY($2::text[]))
        `, [persistedLessonId, activeExerciseIds]);
      }
      }

      return {
        topics: bundle.topics.length,
        questions: questionCount,
        options: optionCount,
        courses: bundle.courses.length,
        lessons: bundle.lessons.length,
        tutorialExercises: bundle.lessons.reduce((total, lesson) => total + lesson.exercises.length, 0),
        skippedEmptyLessons: bundle.skippedEmptyLessons,
        normalizations: bundle.normalizations,
        rejections: bundle.rejections,
      };
    });
  }
}
