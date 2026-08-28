import type { Pool, PoolClient } from "pg";
import { withTransaction } from "../../db/transaction.js";
import { ConflictError, NotFoundError } from "../../shared/errors.js";

export type TutorialExerciseAnswer = string | number | string[];
export type TutorialExerciseAction = "check" | "reveal";

export interface TutorialExerciseSubmissionInput {
  exerciseId: string;
  idempotencyKey: string;
  action: TutorialExerciseAction;
  answer?: TutorialExerciseAnswer;
  hintUsed: boolean;
}

export interface TutorialExerciseSubmissionResult {
  submissionId: string;
  exerciseId: string;
  action: TutorialExerciseAction;
  isCorrect: boolean | null;
  pointsAwarded: number;
  totalPoints: number;
  replayed: boolean;
  progress: {
    attemptsCount: number;
    completed: boolean;
    hintUsed: boolean;
    solutionRevealed: boolean;
    completedAt: Date | null;
    lastAttemptedAt: Date;
  };
}

interface ExerciseRow {
  exerciseId: string;
  answerKey: TutorialExerciseAnswer;
  points: number;
  lessonId: string;
  courseId: string;
}

interface ProgressRow {
  attemptsCount: number;
  completed: boolean;
  hintUsed: boolean;
  solutionRevealed: boolean;
  completedAt: Date | null;
  lastAttemptedAt: Date;
}

interface ExistingSubmissionRow extends ProgressRow {
  submissionId: string;
  exerciseId: string;
  action: TutorialExerciseAction;
  answer: TutorialExerciseAnswer | null;
  isCorrect: boolean | null;
  hintUsedOnSubmission: boolean;
  pointsAwarded: number;
  totalPoints: number;
}

function answersEqual(left: TutorialExerciseAnswer, right: TutorialExerciseAnswer): boolean {
  if (Array.isArray(left) || Array.isArray(right)) {
    return Array.isArray(left)
      && Array.isArray(right)
      && left.length === right.length
      && left.every((value, index) => value === right[index]);
  }
  return left === right;
}

function sameSubmission(existing: ExistingSubmissionRow, input: TutorialExerciseSubmissionInput): boolean {
  if (
    existing.exerciseId !== input.exerciseId
    || existing.action !== input.action
    || existing.hintUsedOnSubmission !== input.hintUsed
  ) return false;
  if (input.action === "reveal") return existing.answer === null && input.answer === undefined;
  return existing.answer !== null
    && input.answer !== undefined
    && answersEqual(existing.answer, input.answer);
}

function resultFromExisting(existing: ExistingSubmissionRow): TutorialExerciseSubmissionResult {
  return {
    submissionId: existing.submissionId,
    exerciseId: existing.exerciseId,
    action: existing.action,
    isCorrect: existing.isCorrect,
    pointsAwarded: existing.pointsAwarded,
    totalPoints: existing.totalPoints,
    replayed: true,
    progress: {
      attemptsCount: existing.attemptsCount,
      completed: existing.completed,
      hintUsed: existing.hintUsed,
      solutionRevealed: existing.solutionRevealed,
      completedAt: existing.completedAt,
      lastAttemptedAt: existing.lastAttemptedAt,
    },
  };
}

export class TutorialExerciseService {
  constructor(private readonly pool: Pool) {}

  async submit(
    userId: string,
    input: TutorialExerciseSubmissionInput,
  ): Promise<TutorialExerciseSubmissionResult> {
    return withTransaction(this.pool, async (database) => {
      const existing = await this.findExisting(database, userId, input.idempotencyKey);
      if (existing) {
        if (!sameSubmission(existing, input)) {
          throw new ConflictError(
            "IDEMPOTENCY_KEY_REUSED",
            "The idempotency key was already used for a different tutorial exercise submission",
          );
        }
        return resultFromExisting(existing);
      }

      const exerciseResult = await database.query<ExerciseRow>(`
        SELECT
          te.id AS "exerciseId",
          te.answer_key AS "answerKey",
          te.points,
          l.id AS "lessonId",
          c.id AS "courseId"
        FROM tutorial_exercises te
        JOIN lessons l ON l.id = te.lesson_id AND l.status = 'published'
        JOIN courses c ON c.id = l.course_id AND c.status = 'published'
        WHERE te.id = $1 AND te.status = 'published'
      `, [input.exerciseId]);
      const exercise = exerciseResult.rows[0];
      if (!exercise) throw new NotFoundError("Tutorial exercise");

      await database.query(`
        INSERT INTO tutorial_exercise_progress (user_id, exercise_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, exercise_id) DO NOTHING
      `, [userId, exercise.exerciseId]);
      const progressResult = await database.query<ProgressRow>(`
        SELECT
          attempts_count AS "attemptsCount",
          completed,
          hint_used AS "hintUsed",
          solution_revealed AS "solutionRevealed",
          completed_at AS "completedAt",
          last_attempted_at AS "lastAttemptedAt"
        FROM tutorial_exercise_progress
        WHERE user_id = $1 AND exercise_id = $2
        FOR UPDATE
      `, [userId, exercise.exerciseId]);
      const previous = progressResult.rows[0];
      if (!previous) throw new Error("Tutorial exercise progress initialization failed");

      const isCorrect = input.action === "check"
        ? answersEqual(exercise.answerKey, input.answer as TutorialExerciseAnswer)
        : null;
      const pointsAwarded = isCorrect === true
        && !previous.completed
        && !previous.solutionRevealed
        ? exercise.points
        : 0;

      const submissionResult = await database.query<{ submissionId: string }>(`
        INSERT INTO tutorial_exercise_submissions (
          user_id, exercise_id, idempotency_key, action, answer, is_correct,
          hint_used, points_awarded
        ) VALUES ($1, $2, $3, $4, $5::jsonb, $6, $7, $8)
        RETURNING id AS "submissionId"
      `, [
        userId,
        exercise.exerciseId,
        input.idempotencyKey,
        input.action,
        input.answer === undefined ? null : JSON.stringify(input.answer),
        isCorrect,
        input.hintUsed,
        pointsAwarded,
      ]);
      const submissionId = submissionResult.rows[0]?.submissionId;
      if (!submissionId) throw new Error("Tutorial exercise submission returned no id");

      const savedResult = await database.query<ProgressRow>(`
        UPDATE tutorial_exercise_progress SET
          attempts_count = attempts_count + CASE WHEN $3 = 'check' THEN 1 ELSE 0 END,
          completed = completed OR COALESCE($4, false),
          hint_used = hint_used OR $5,
          solution_revealed = solution_revealed OR $3 = 'reveal',
          completed_at = CASE
            WHEN completed_at IS NOT NULL THEN completed_at
            WHEN COALESCE($4, false) THEN now()
            ELSE NULL
          END,
          last_attempted_at = now()
        WHERE user_id = $1 AND exercise_id = $2
        RETURNING
          attempts_count AS "attemptsCount",
          completed,
          hint_used AS "hintUsed",
          solution_revealed AS "solutionRevealed",
          completed_at AS "completedAt",
          last_attempted_at AS "lastAttemptedAt"
      `, [userId, exercise.exerciseId, input.action, isCorrect, input.hintUsed]);
      const saved = savedResult.rows[0];
      if (!saved) throw new Error("Tutorial exercise progress update returned no row");

      let totalPoints: number;
      if (pointsAwarded > 0) {
        const pointsResult = await database.query<{ points: number }>(
          "UPDATE users SET points = points + $1 WHERE id = $2 RETURNING points",
          [pointsAwarded, userId],
        );
        totalPoints = pointsResult.rows[0]?.points ?? 0;
      } else {
        const pointsResult = await database.query<{ points: number }>(
          "SELECT points FROM users WHERE id = $1",
          [userId],
        );
        totalPoints = pointsResult.rows[0]?.points ?? 0;
      }

      if (isCorrect === true) {
        await this.completeLesson(database, userId, exercise.lessonId, exercise.courseId);
      } else {
        await this.touchLesson(database, userId, exercise.lessonId, exercise.courseId);
      }

      return {
        submissionId,
        exerciseId: exercise.exerciseId,
        action: input.action,
        isCorrect,
        pointsAwarded,
        totalPoints,
        replayed: false,
        progress: saved,
      };
    });
  }

  private async findExisting(
    database: PoolClient,
    userId: string,
    idempotencyKey: string,
  ): Promise<ExistingSubmissionRow | null> {
    const result = await database.query<ExistingSubmissionRow>(`
      SELECT
        s.id AS "submissionId",
        s.exercise_id AS "exerciseId",
        s.action,
        s.answer,
        s.is_correct AS "isCorrect",
        s.hint_used AS "hintUsedOnSubmission",
        s.points_awarded AS "pointsAwarded",
        u.points AS "totalPoints",
        p.attempts_count AS "attemptsCount",
        p.completed,
        p.hint_used AS "hintUsed",
        p.solution_revealed AS "solutionRevealed",
        p.completed_at AS "completedAt",
        p.last_attempted_at AS "lastAttemptedAt"
      FROM tutorial_exercise_submissions s
      JOIN users u ON u.id = s.user_id
      JOIN tutorial_exercise_progress p
        ON p.user_id = s.user_id AND p.exercise_id = s.exercise_id
      WHERE s.user_id = $1 AND s.idempotency_key = $2
    `, [userId, idempotencyKey]);
    return result.rows[0] ?? null;
  }

  private async touchLesson(
    database: PoolClient,
    userId: string,
    lessonId: string,
    courseId: string,
  ): Promise<void> {
    await database.query(`
      INSERT INTO enrollments (user_id, course_id) VALUES ($1, $2)
      ON CONFLICT (user_id, course_id) DO NOTHING
    `, [userId, courseId]);
    await database.query(`
      INSERT INTO lesson_progress (user_id, lesson_id, status, last_accessed_at)
      VALUES ($1, $2, 'in_progress', now())
      ON CONFLICT (user_id, lesson_id) DO UPDATE SET last_accessed_at = now()
    `, [userId, lessonId]);
  }

  private async completeLesson(
    database: PoolClient,
    userId: string,
    lessonId: string,
    courseId: string,
  ): Promise<void> {
    await database.query(`
      INSERT INTO enrollments (user_id, course_id) VALUES ($1, $2)
      ON CONFLICT (user_id, course_id) DO NOTHING
    `, [userId, courseId]);
    await database.query(`
      INSERT INTO lesson_progress (
        user_id, lesson_id, status, last_accessed_at, completed_at
      ) VALUES ($1, $2, 'completed', now(), now())
      ON CONFLICT (user_id, lesson_id) DO UPDATE SET
        status = 'completed',
        last_accessed_at = now(),
        completed_at = COALESCE(lesson_progress.completed_at, now())
    `, [userId, lessonId]);
    await database.query(`
      UPDATE enrollments e SET completed_at = CASE
        WHEN NOT EXISTS (
          SELECT 1 FROM lessons l
          LEFT JOIN lesson_progress lp
            ON lp.lesson_id = l.id AND lp.user_id = $1
          WHERE l.course_id = $2
            AND l.status = 'published'
            AND COALESCE(lp.status, 'not_started') <> 'completed'
        ) THEN COALESCE(e.completed_at, now())
        ELSE NULL
      END
      WHERE e.user_id = $1 AND e.course_id = $2
    `, [userId, courseId]);
  }
}
