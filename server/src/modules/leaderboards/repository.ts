import type { Queryable } from "../../shared/types.js";

export type LeaderboardPeriod = "weekly" | "all_time";

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  points: number;
  isCurrentUser: boolean;
}

interface LeaderboardRow extends LeaderboardEntry {
  periodStartedAt: Date | null;
}

export interface Achievement {
  key: string;
  title: string;
  description: string;
  iconName: string;
  metric: string;
  threshold: number;
  currentValue: number;
  progressPercentage: number;
  unlockedAt: Date | null;
  isUnlocked: boolean;
}

type AchievementRow = Achievement;

const statisticsCte = `
  WITH activity_days AS (
    SELECT created_at::date AS activity_day FROM attempts WHERE user_id = $1
    UNION
    SELECT created_at::date FROM tutorial_exercise_submissions WHERE user_id = $1
    UNION
    SELECT last_accessed_at::date FROM lesson_progress WHERE user_id = $1
    UNION
    SELECT submitted_at::date FROM multiplayer_answers WHERE user_id = $1
  ),
  numbered_days AS (
    SELECT activity_day, activity_day - (row_number() OVER (ORDER BY activity_day))::integer AS streak_group
    FROM activity_days
  ),
  current_streak AS (
    SELECT count(*)::integer AS days
    FROM numbered_days
    WHERE streak_group = (
      SELECT streak_group FROM numbered_days
      WHERE activity_day >= current_date - 1
      ORDER BY activity_day DESC LIMIT 1
    )
  ),
  statistics AS (
    SELECT
      u.points::integer AS points,
      ((SELECT count(DISTINCT question_id) FROM attempts WHERE user_id = $1) +
       (SELECT count(DISTINCT exercise_id) FROM tutorial_exercise_submissions WHERE user_id = $1 AND action = 'check'))::integer AS answered_questions,
      ((SELECT count(DISTINCT question_id) FROM attempts WHERE user_id = $1 AND is_correct) +
       (SELECT count(DISTINCT exercise_id) FROM tutorial_exercise_submissions WHERE user_id = $1 AND is_correct))::integer AS correct_answers,
      (SELECT count(*)::integer FROM lesson_progress WHERE user_id = $1 AND status = 'completed') AS completed_lessons,
      coalesce((SELECT days FROM current_streak), 0)::integer AS streak_days,
      (SELECT count(*)::integer FROM enrollments WHERE user_id = $1 AND completed_at IS NOT NULL) AS completed_courses,
      (SELECT count(*)::integer FROM multiplayer_matches WHERE winner_user_id = $1 AND status = 'finished') AS multiplayer_wins
    FROM users u WHERE u.id = $1
  ),
  metric_values AS (
    SELECT a.*,
      CASE a.metric
        WHEN 'points' THEN s.points
        WHEN 'answered_questions' THEN s.answered_questions
        WHEN 'correct_answers' THEN s.correct_answers
        WHEN 'completed_lessons' THEN s.completed_lessons
        WHEN 'streak_days' THEN s.streak_days
        WHEN 'completed_courses' THEN s.completed_courses
        WHEN 'multiplayer_wins' THEN s.multiplayer_wins
      END::integer AS current_value
    FROM achievements a CROSS JOIN statistics s
    WHERE a.status = 'published'
  )`;

export class LeaderboardRepository {
  constructor(private readonly database: Queryable) {}

  async getLeaderboard(userId: string, period: LeaderboardPeriod, limit: number) {
    const result = await this.database.query<LeaderboardRow>(`
      WITH weekly_events AS (
        SELECT user_id, points_awarded::integer AS points FROM attempts
        WHERE created_at >= date_trunc('week', now())
        UNION ALL
        SELECT user_id, points_awarded::integer FROM tutorial_exercise_submissions
        WHERE created_at >= date_trunc('week', now())
        UNION ALL
        SELECT mp.user_id, mp.reward_points::integer
        FROM multiplayer_players mp
        JOIN multiplayer_matches mm ON mm.id = mp.match_id
        WHERE mm.status = 'finished' AND mm.finished_at >= date_trunc('week', now())
      ),
      weekly_scores AS (
        SELECT user_id, sum(points)::integer AS points FROM weekly_events GROUP BY user_id
      ),
      scores AS (
        SELECT u.id AS "userId", u.display_name AS "displayName", u.created_at,
          CASE WHEN $2 = 'weekly' THEN coalesce(ws.points, 0) ELSE u.points END::integer AS points
        FROM users u LEFT JOIN weekly_scores ws ON ws.user_id = u.id
      ),
      ranked AS (
        SELECT "userId", "displayName", points,
          rank() OVER (ORDER BY points DESC)::integer AS rank,
          created_at
        FROM scores
      )
      SELECT rank, "userId", "displayName", points,
        ("userId" = $1)::boolean AS "isCurrentUser",
        CASE WHEN $2 = 'weekly' THEN date_trunc('week', now()) ELSE NULL END AS "periodStartedAt"
      FROM ranked
      WHERE rank <= $3 OR "userId" = $1
      ORDER BY rank, created_at, "userId"
    `, [userId, period, limit]);

    const entries = result.rows.filter((row) => row.rank <= limit).map(this.toEntry);
    const me = result.rows.find((row) => row.userId === userId);
    return {
      period,
      periodStartedAt: result.rows[0]?.periodStartedAt ?? null,
      generatedAt: new Date(),
      entries,
      me: me ? this.toEntry(me) : null,
    };
  }

  async getAchievements(userId: string) {
    await this.database.query(`
      ${statisticsCte}
      INSERT INTO user_achievements (user_id, achievement_key, metric_value)
      SELECT $1, key, current_value FROM metric_values WHERE current_value >= threshold
      ON CONFLICT (user_id, achievement_key) DO NOTHING
    `, [userId]);

    const result = await this.database.query<AchievementRow>(`
      ${statisticsCte}
      SELECT mv.key, mv.title, mv.description, mv.icon_name AS "iconName", mv.metric,
        mv.threshold, mv.current_value AS "currentValue",
        least(100, floor((mv.current_value::numeric / mv.threshold) * 100))::integer AS "progressPercentage",
        ua.unlocked_at AS "unlockedAt", (ua.achievement_key IS NOT NULL)::boolean AS "isUnlocked"
      FROM metric_values mv
      LEFT JOIN user_achievements ua
        ON ua.user_id = $1 AND ua.achievement_key = mv.key
      ORDER BY mv.position
    `, [userId]);

    return {
      unlockedCount: result.rows.filter((achievement) => achievement.isUnlocked).length,
      totalCount: result.rows.length,
      achievements: result.rows,
    };
  }

  private toEntry(row: LeaderboardRow): LeaderboardEntry {
    return {
      rank: row.rank,
      userId: row.userId,
      displayName: row.displayName,
      points: row.points,
      isCurrentUser: row.isCurrentUser,
    };
  }
}
