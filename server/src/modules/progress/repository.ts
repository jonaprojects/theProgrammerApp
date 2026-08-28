import type { Queryable } from "../../shared/types.js";

export interface UserSummaryRow {
  id: string;
  displayName: string;
  points: number;
}

export type LessonProgressStatus = "not_started" | "in_progress" | "completed";

export interface LessonProgressRow {
  lessonId: string;
  lessonSlug: string;
  lessonTitle: string;
  position: number;
  status: LessonProgressStatus;
  lastAccessedAt: Date | null;
  completedAt: Date | null;
}

export interface EnrollmentRow {
  courseId: string;
  courseSlug: string;
  courseTitle: string;
  completedLessons: number;
  totalLessons: number;
  completionPercentage: number;
  status: LessonProgressStatus;
  enrolledAt: Date;
  completedAt: Date | null;
  lastAccessedAt: Date | null;
  resumeLesson: LessonProgressRow | null;
  lessons: LessonProgressRow[];
}

export interface TopicProgressRow {
  topicId: string;
  topicSlug: string;
  topicTitle: string;
  questionCount: number;
  attemptsCount: number;
  correctCount: number;
  answeredCount: number;
  correctlyAnsweredCount: number;
  completionPercentage: number;
  accuracyPercentage: number;
  masteryPercentage: number;
  status: "not_started" | "practicing" | "mastered";
  lastAttemptedAt: Date | null;
}

export interface LearningSummaryRow {
  enrolledCourses: number;
  completedCourses: number;
  completedLessons: number;
  totalLessons: number;
  answeredQuestions: number;
  correctlyAnsweredQuestions: number;
  totalAttempts: number;
  correctAttempts: number;
  accuracyPercentage: number;
  activeDays: number;
  currentStreakDays: number;
  lastActivityAt: Date | null;
}

type WritableLessonStatus = "in_progress" | "completed";

export class ProgressRepository {
  constructor(private readonly database: Queryable) {}

  async getUserSummary(userId: string): Promise<UserSummaryRow | null> {
    const result = await this.database.query<UserSummaryRow>(`
      SELECT id, display_name AS "displayName", points
      FROM users WHERE id = $1
    `, [userId]);
    return result.rows[0] ?? null;
  }

  async getLearningSummary(userId: string): Promise<LearningSummaryRow> {
    const result = await this.database.query<LearningSummaryRow>(`
      WITH activity_days AS (
        SELECT created_at::date AS day FROM attempts WHERE user_id = $1
        UNION
        SELECT last_accessed_at::date AS day FROM lesson_progress WHERE user_id = $1
      ), streak_rows AS (
        SELECT
          day,
          row_number() OVER (ORDER BY day DESC) AS sequence,
          max(day) OVER () AS latest_day
        FROM activity_days
      ), attempt_totals AS (
        SELECT
          count(*)::integer AS total_attempts,
          count(*) FILTER (WHERE is_correct)::integer AS correct_attempts,
          count(DISTINCT question_id)::integer AS answered_questions,
          count(DISTINCT question_id) FILTER (WHERE is_correct)::integer AS correctly_answered_questions,
          max(created_at) AS last_attempted_at
        FROM attempts
        WHERE user_id = $1
      ), lesson_totals AS (
        SELECT
          count(*) FILTER (WHERE lp.status = 'completed')::integer AS completed_lessons,
          count(l.id)::integer AS total_lessons,
          max(lp.last_accessed_at) AS last_lesson_at
        FROM enrollments e
        JOIN lessons l ON l.course_id = e.course_id AND l.status = 'published'
        LEFT JOIN lesson_progress lp ON lp.user_id = e.user_id AND lp.lesson_id = l.id
        WHERE e.user_id = $1
      )
      SELECT
        (SELECT count(*)::integer FROM enrollments WHERE user_id = $1) AS "enrolledCourses",
        (SELECT count(*)::integer FROM enrollments WHERE user_id = $1 AND completed_at IS NOT NULL) AS "completedCourses",
        lt.completed_lessons AS "completedLessons",
        lt.total_lessons AS "totalLessons",
        at.answered_questions AS "answeredQuestions",
        at.correctly_answered_questions AS "correctlyAnsweredQuestions",
        at.total_attempts AS "totalAttempts",
        at.correct_attempts AS "correctAttempts",
        CASE WHEN at.total_attempts = 0 THEN 0
          ELSE round(100.0 * at.correct_attempts / at.total_attempts)::integer
        END AS "accuracyPercentage",
        (SELECT count(*)::integer FROM activity_days) AS "activeDays",
        COALESCE((
          SELECT count(*)::integer
          FROM streak_rows
          WHERE latest_day >= current_date - 1
            AND day = latest_day - (sequence::integer - 1)
        ), 0) AS "currentStreakDays",
        GREATEST(at.last_attempted_at, lt.last_lesson_at) AS "lastActivityAt"
      FROM attempt_totals at CROSS JOIN lesson_totals lt
    `, [userId]);
    const summary = result.rows[0];
    if (!summary) throw new Error("Learning summary query did not return a row");
    return summary;
  }

  async listEnrollments(userId: string): Promise<EnrollmentRow[]> {
    const result = await this.database.query<EnrollmentRow>(`
      WITH lesson_rows AS (
        SELECT
          e.enrolled_at,
          e.completed_at AS enrollment_completed_at,
          c.id AS course_id,
          c.slug AS course_slug,
          c.title AS course_title,
          l.id AS lesson_id,
          l.slug AS lesson_slug,
          l.title AS lesson_title,
          l.position,
          COALESCE(lp.status, 'not_started') AS lesson_status,
          lp.last_accessed_at,
          lp.completed_at AS lesson_completed_at
        FROM enrollments e
        JOIN courses c ON c.id = e.course_id AND c.status = 'published'
        JOIN lessons l ON l.course_id = c.id AND l.status = 'published'
        LEFT JOIN lesson_progress lp ON lp.lesson_id = l.id AND lp.user_id = e.user_id
        WHERE e.user_id = $1
      ), course_stats AS (
        SELECT
          course_id,
          course_slug,
          course_title,
          enrolled_at,
          enrollment_completed_at,
          count(*) FILTER (WHERE lesson_status = 'completed')::integer AS completed_lessons,
          count(*)::integer AS total_lessons,
          max(last_accessed_at) AS last_accessed_at,
          jsonb_agg(jsonb_build_object(
            'lessonId', lesson_id,
            'lessonSlug', lesson_slug,
            'lessonTitle', lesson_title,
            'position', position,
            'status', lesson_status,
            'lastAccessedAt', last_accessed_at,
            'completedAt', lesson_completed_at
          ) ORDER BY position) AS lessons
        FROM lesson_rows
        GROUP BY course_id, course_slug, course_title, enrolled_at, enrollment_completed_at
      )
      SELECT
        cs.course_id AS "courseId",
        cs.course_slug AS "courseSlug",
        cs.course_title AS "courseTitle",
        cs.completed_lessons AS "completedLessons",
        cs.total_lessons AS "totalLessons",
        round(100.0 * cs.completed_lessons / cs.total_lessons)::integer AS "completionPercentage",
        CASE
          WHEN cs.enrollment_completed_at IS NOT NULL THEN 'completed'
          WHEN cs.last_accessed_at IS NOT NULL THEN 'in_progress'
          ELSE 'not_started'
        END AS status,
        cs.enrolled_at AS "enrolledAt",
        cs.enrollment_completed_at AS "completedAt",
        cs.last_accessed_at AS "lastAccessedAt",
        resume.lesson AS "resumeLesson",
        cs.lessons
      FROM course_stats cs
      LEFT JOIN LATERAL (
        SELECT jsonb_build_object(
          'lessonId', lr.lesson_id,
          'lessonSlug', lr.lesson_slug,
          'lessonTitle', lr.lesson_title,
          'position', lr.position,
          'status', lr.lesson_status,
          'lastAccessedAt', lr.last_accessed_at,
          'completedAt', lr.lesson_completed_at
        ) AS lesson
        FROM lesson_rows lr
        WHERE lr.course_id = cs.course_id
        ORDER BY
          CASE WHEN cs.enrollment_completed_at IS NOT NULL THEN lr.position END DESC NULLS LAST,
          CASE lr.lesson_status
            WHEN 'in_progress' THEN 0
            WHEN 'not_started' THEN 1
            ELSE 2
          END,
          lr.last_accessed_at DESC NULLS LAST,
          lr.position
        LIMIT 1
      ) resume ON true
      ORDER BY
        (cs.enrollment_completed_at IS NOT NULL),
        cs.last_accessed_at DESC NULLS LAST,
        cs.enrolled_at DESC
    `, [userId]);
    return result.rows;
  }

  async listTopicProgress(userId: string): Promise<TopicProgressRow[]> {
    const result = await this.database.query<TopicProgressRow>(`
      WITH eligible_questions AS (
        SELECT q.id, q.topic_id
        FROM questions q
        JOIN question_options qo ON qo.question_id = q.id AND qo.active
        WHERE q.status = 'published'
        GROUP BY q.id
        HAVING count(*) >= 2 AND count(*) FILTER (WHERE qo.is_correct) = 1
      ), question_counts AS (
        SELECT topic_id, count(*)::integer AS question_count
        FROM eligible_questions
        GROUP BY topic_id
      ), attempt_stats AS (
        SELECT
          q.topic_id,
          count(*)::integer AS attempts_count,
          count(*) FILTER (WHERE a.is_correct)::integer AS correct_count,
          count(DISTINCT a.question_id)::integer AS answered_count,
          count(DISTINCT a.question_id) FILTER (WHERE a.is_correct)::integer AS correctly_answered_count,
          max(a.created_at) AS last_attempted_at
        FROM attempts a
        JOIN eligible_questions q ON q.id = a.question_id
        WHERE a.user_id = $1
        GROUP BY q.topic_id
      )
      SELECT
        t.id AS "topicId",
        t.slug AS "topicSlug",
        t.title AS "topicTitle",
        qc.question_count AS "questionCount",
        COALESCE(a.attempts_count, 0) AS "attemptsCount",
        COALESCE(a.correct_count, 0) AS "correctCount",
        COALESCE(a.answered_count, 0) AS "answeredCount",
        COALESCE(a.correctly_answered_count, 0) AS "correctlyAnsweredCount",
        round(100.0 * COALESCE(a.answered_count, 0) / qc.question_count)::integer AS "completionPercentage",
        CASE WHEN COALESCE(a.attempts_count, 0) = 0 THEN 0
          ELSE round(100.0 * a.correct_count / a.attempts_count)::integer
        END AS "accuracyPercentage",
        round(100.0 * COALESCE(a.correctly_answered_count, 0) / qc.question_count)::integer AS "masteryPercentage",
        CASE
          WHEN COALESCE(a.attempts_count, 0) = 0 THEN 'not_started'
          WHEN 100.0 * COALESCE(a.correctly_answered_count, 0) / qc.question_count >= 80 THEN 'mastered'
          ELSE 'practicing'
        END AS status,
        a.last_attempted_at AS "lastAttemptedAt"
      FROM topics t
      JOIN question_counts qc ON qc.topic_id = t.id
      LEFT JOIN attempt_stats a ON a.topic_id = t.id
      ORDER BY a.last_attempted_at DESC NULLS LAST, t.title
    `, [userId]);
    return result.rows;
  }

  async enroll(userId: string, courseId: string): Promise<boolean> {
    const result = await this.database.query<{ courseId: string }>(`
      INSERT INTO enrollments (user_id, course_id)
      SELECT $1, id FROM courses WHERE id = $2 AND status = 'published'
      ON CONFLICT (user_id, course_id) DO NOTHING
      RETURNING course_id AS "courseId"
    `, [userId, courseId]);
    if (result.rows[0]) return true;

    const course = await this.database.query(
      "SELECT 1 FROM courses WHERE id = $1 AND status = 'published'",
      [courseId],
    );
    return Boolean(course.rows[0]);
  }

  async setLessonProgress(
    userId: string,
    courseSlug: string,
    lessonSlug: string,
    status: WritableLessonStatus,
  ): Promise<boolean> {
    const result = await this.database.query<{ lessonId: string }>(`
      WITH target AS (
        SELECT l.id AS lesson_id, c.id AS course_id
        FROM lessons l
        JOIN courses c ON c.id = l.course_id
        WHERE c.slug = $2
          AND c.status = 'published'
          AND l.slug = $3
          AND l.status = 'published'
      ), enrolled AS (
        INSERT INTO enrollments (user_id, course_id)
        SELECT $1, course_id FROM target
        ON CONFLICT (user_id, course_id) DO NOTHING
      ), saved AS (
        INSERT INTO lesson_progress (
          user_id, lesson_id, status, last_accessed_at, completed_at
        )
        SELECT
          $1,
          lesson_id,
          $4,
          now(),
          CASE WHEN $4 = 'completed' THEN now() ELSE NULL END
        FROM target
        ON CONFLICT (user_id, lesson_id) DO UPDATE SET
          status = CASE
            WHEN lesson_progress.status = 'completed' THEN 'completed'
            ELSE EXCLUDED.status
          END,
          last_accessed_at = now(),
          completed_at = CASE
            WHEN lesson_progress.completed_at IS NOT NULL THEN lesson_progress.completed_at
            WHEN EXCLUDED.status = 'completed' THEN now()
            ELSE NULL
          END
        RETURNING lesson_id, status
      ), course_state AS (
        SELECT
          target.course_id,
          count(l.id)::integer AS total_lessons,
          count(l.id) FILTER (
            WHERE CASE
              WHEN l.id = saved.lesson_id THEN saved.status
              ELSE lp.status
            END = 'completed'
          )::integer AS completed_lessons
        FROM target
        CROSS JOIN saved
        JOIN lessons l ON l.course_id = target.course_id AND l.status = 'published'
        LEFT JOIN lesson_progress lp ON lp.user_id = $1 AND lp.lesson_id = l.id
        GROUP BY target.course_id
      ), enrollment_updated AS (
        UPDATE enrollments e
        SET completed_at = CASE
          WHEN cs.total_lessons > 0 AND cs.completed_lessons = cs.total_lessons
            THEN COALESCE(e.completed_at, now())
          ELSE NULL
        END
        FROM course_state cs
        WHERE e.user_id = $1 AND e.course_id = cs.course_id
      )
      SELECT lesson_id AS "lessonId" FROM saved
    `, [userId, courseSlug, lessonSlug, status]);
    return Boolean(result.rows[0]);
  }
}
