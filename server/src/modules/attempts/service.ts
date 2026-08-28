import type { Pool } from "pg";
import { withTransaction } from "../../db/transaction.js";
import { ConflictError, NotFoundError } from "../../shared/errors.js";

export interface SubmitAttemptInput {
  questionId: string;
  selectedOptionId: string;
  idempotencyKey: string;
  timeSpentSeconds?: number | undefined;
}

export interface AttemptResult {
  id: string;
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  pointsAwarded: number;
  explanation: string | null;
  correctOptionId: string;
  correctOptionLabel: string;
  createdAt: Date;
  replayed: boolean;
}

interface SelectedQuestionRow {
  questionId: string;
  topicId: string;
  explanation: string | null;
  isCorrect: boolean;
  correctOptionId: string;
  correctOptionLabel: string;
}

export class AttemptService {
  constructor(private readonly pool: Pool) {}

  async submit(userId: string, input: SubmitAttemptInput): Promise<AttemptResult> {
    return withTransaction(this.pool, async (database) => {
      const userLock = await database.query("SELECT id FROM users WHERE id = $1 FOR UPDATE", [
        userId,
      ]);
      if (!userLock.rows[0]) throw new NotFoundError("User");

      const existing = await database.query<AttemptResult>(`
        SELECT
          a.id,
          a.question_id AS "questionId",
          a.selected_option_id AS "selectedOptionId",
          a.is_correct AS "isCorrect",
          a.points_awarded AS "pointsAwarded",
          a.explanation,
          a.correct_option_id AS "correctOptionId",
          a.correct_option_label AS "correctOptionLabel",
          a.created_at AS "createdAt",
          true AS replayed
        FROM attempts a
        WHERE a.user_id = $1 AND a.idempotency_key = $2
      `, [userId, input.idempotencyKey]);
      const replay = existing.rows[0];
      if (replay) {
        if (
          replay.questionId !== input.questionId ||
          replay.selectedOptionId !== input.selectedOptionId
        ) {
          throw new ConflictError(
            "IDEMPOTENCY_KEY_REUSED",
            "The idempotency key was already used for a different answer",
          );
        }
        return replay;
      }

      const selection = await database.query<SelectedQuestionRow>(`
        SELECT
          q.id AS "questionId",
          q.topic_id AS "topicId",
          q.explanation,
          qo.is_correct AS "isCorrect",
          correct_option.id AS "correctOptionId",
          correct_option.label AS "correctOptionLabel"
        FROM questions q
        JOIN question_options qo ON qo.question_id = q.id
        JOIN question_options correct_option
          ON correct_option.question_id = q.id
          AND correct_option.is_correct
          AND correct_option.active
        WHERE q.id = $1 AND qo.id = $2 AND q.status = 'published' AND qo.active
      `, [input.questionId, input.selectedOptionId]);
      const selected = selection.rows[0];
      if (!selected) {
        throw new ConflictError(
          "INVALID_QUESTION_OPTION",
          "The question is unavailable or the option does not belong to it",
        );
      }

      const priorCorrect = await database.query(`
        SELECT 1 FROM attempts
        WHERE user_id = $1 AND question_id = $2 AND is_correct
        LIMIT 1
      `, [userId, selected.questionId]);
      const pointsAwarded = selected.isCorrect && !priorCorrect.rows[0] ? 10 : 0;

      const attempt = await database.query<AttemptResult>(`
        INSERT INTO attempts (
          user_id,
          question_id,
          selected_option_id,
          idempotency_key,
          is_correct,
          points_awarded,
          time_spent_seconds,
          explanation,
          correct_option_id,
          correct_option_label
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING
          id,
          question_id AS "questionId",
          selected_option_id AS "selectedOptionId",
          is_correct AS "isCorrect",
          points_awarded AS "pointsAwarded",
          created_at AS "createdAt",
          false AS replayed
      `, [
        userId,
        selected.questionId,
        input.selectedOptionId,
        input.idempotencyKey,
        selected.isCorrect,
        pointsAwarded,
        input.timeSpentSeconds ?? null,
        selected.explanation,
        selected.correctOptionId,
        selected.correctOptionLabel,
      ]);

      if (pointsAwarded > 0) {
        await database.query("UPDATE users SET points = points + $1 WHERE id = $2", [
          pointsAwarded,
          userId,
        ]);
      }

      await database.query(`
        INSERT INTO user_topic_progress (
          user_id, topic_id, attempts_count, correct_count, last_attempted_at
        ) VALUES ($1, $2, 1, $3, now())
        ON CONFLICT (user_id, topic_id) DO UPDATE SET
          attempts_count = user_topic_progress.attempts_count + 1,
          correct_count = user_topic_progress.correct_count + EXCLUDED.correct_count,
          last_attempted_at = now()
      `, [userId, selected.topicId, selected.isCorrect ? 1 : 0]);

      const saved = attempt.rows[0];
      if (!saved) throw new Error("Attempt insert did not return a row");
      return {
        ...saved,
        explanation: selected.explanation,
        correctOptionId: selected.correctOptionId,
        correctOptionLabel: selected.correctOptionLabel,
        replayed: false,
      };
    });
  }
}
