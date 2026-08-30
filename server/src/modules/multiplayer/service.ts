import { randomInt } from "node:crypto";
import type { Pool, PoolClient } from "pg";

import { withTransaction } from "../../db/transaction.js";
import { ConflictError, ForbiddenError, NotFoundError } from "../../shared/errors.js";
import { multiplayerAnswerPoints, roundShouldReveal, winningUserId } from "./rules.js";

const ROOM_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const REVIEW_DURATION_MS = 3_000;

type MatchStatus = "waiting" | "active" | "finished" | "cancelled";
type MatchVisibility = "private" | "public";

interface MatchRow {
  id: string;
  code: string;
  hostUserId: string;
  topicId: string;
  topicSlug: string;
  topicTitle: string;
  visibility: MatchVisibility;
  status: MatchStatus;
  questionCount: number;
  roundDurationSeconds: number;
  currentQuestionPosition: number;
  roundStartedAt: Date | null;
  roundEndsAt: Date | null;
  roundRevealedAt: Date | null;
  winnerUserId: string | null;
  createdAt: Date;
  startedAt: Date | null;
  finishedAt: Date | null;
  expiresAt: Date;
}

interface PlayerRow {
  userId: string;
  displayName: string;
  status: "active" | "left" | "forfeited";
  score: number;
  correctCount: number;
  answeredCount: number;
  rewardPoints: number;
  answeredCurrent: boolean;
}

interface QuestionRow {
  id: string;
  prompt: string;
  type: "multiple_choice" | "boolean";
  difficulty: number;
  codeSnippet: { language: string; code: string } | null;
}

interface OptionRow {
  id: string;
  questionId: string;
  label: string;
  position: number;
}

interface AnswerRow {
  selectedOptionId: string;
  isCorrect: boolean;
  pointsAwarded: number;
}

interface VisibleAnswerRow {
  selectedOptionId: string;
  isCorrect: boolean | null;
  pointsAwarded: number | null;
}

export interface MatchState {
  id: string;
  code: string;
  hostUserId: string;
  topic: { id: string; slug: string; title: string };
  visibility: MatchVisibility;
  status: MatchStatus;
  questionCount: number;
  roundDurationSeconds: number;
  currentQuestionPosition: number;
  winnerUserId: string | null;
  createdAt: string;
  startedAt: string | null;
  finishedAt: string | null;
  expiresAt: string;
  players: PlayerRow[];
  round: null | {
    phase: "answering" | "reveal";
    position: number;
    startedAt: string;
    endsAt: string;
    revealedAt: string | null;
    question: QuestionRow & { options: OptionRow[] };
    correctOptionId: string | null;
    myAnswer: VisibleAnswerRow | null;
  };
}

export interface CreateMatchInput {
  topicSlug: string;
  questionCount: number;
  roundDurationSeconds: number;
}

export interface SubmitMultiplayerAnswerInput {
  questionPosition: number;
  selectedOptionId: string;
  idempotencyKey: string;
}

function createRoomCode(): string {
  return Array.from({ length: 8 }, () => ROOM_ALPHABET[randomInt(ROOM_ALPHABET.length)]).join("");
}

function iso(value: Date | null): string | null {
  return value ? value.toISOString() : null;
}

export class MultiplayerService {
  constructor(private readonly pool: Pool) {}

  async createPrivate(userId: string, input: CreateMatchInput): Promise<MatchState> {
    const matchId = await withTransaction(this.pool, async (database) => {
      await this.lockUserMatchmaking(database, userId);
      await this.requireNoLiveMatch(database, userId);
      return this.createLocked(database, userId, input, "private");
    });
    return this.getState(userId, matchId);
  }

  async quickMatch(userId: string, input: CreateMatchInput): Promise<MatchState> {
    const matchId = await withTransaction(this.pool, async (database) => {
      await this.lockUserMatchmaking(database, userId);
      await this.requireNoLiveMatch(database, userId);
      const topic = await this.requireTopic(database, input.topicSlug);
      const candidate = await database.query<{ id: string }>(`
        SELECT m.id
        FROM multiplayer_matches m
        WHERE m.topic_id = $1
          AND m.question_count = $2
          AND m.round_duration_seconds = $3
          AND m.visibility = 'public'
          AND m.status = 'waiting'
          AND m.expires_at > now()
          AND m.host_user_id <> $4
          AND NOT EXISTS (
            SELECT 1 FROM multiplayer_players mine
            WHERE mine.match_id = m.id AND mine.user_id = $4
          )
          AND (
            SELECT count(*) FROM multiplayer_players present
            WHERE present.match_id = m.id AND present.status = 'active'
          ) < 2
        ORDER BY m.created_at
        FOR UPDATE SKIP LOCKED
        LIMIT 1
      `, [topic.id, input.questionCount, input.roundDurationSeconds, userId]);

      const waiting = candidate.rows[0];
      if (!waiting) return this.createLocked(database, userId, input, "public", topic.id);

      await this.insertPlayer(database, waiting.id, userId);
      await this.startLocked(database, waiting.id);
      return waiting.id;
    });
    return this.getState(userId, matchId);
  }

  async joinByCode(userId: string, rawCode: string): Promise<MatchState> {
    const code = rawCode.trim().toUpperCase();
    const matchId = await withTransaction(this.pool, async (database) => {
      await this.lockUserMatchmaking(database, userId);
      const result = await database.query<Pick<MatchRow, "id" | "status" | "visibility">>(`
        SELECT id, status, visibility
        FROM multiplayer_matches
        WHERE code = $1 AND expires_at > now()
        FOR UPDATE
      `, [code]);
      const match = result.rows[0];
      if (!match) throw new NotFoundError("Multiplayer room");
      await this.requireNoLiveMatch(database, userId, match.id);
      const existing = await database.query<{ status: PlayerRow["status"] }>(`
        SELECT status FROM multiplayer_players WHERE match_id = $1 AND user_id = $2
      `, [match.id, userId]);
      if (existing.rows[0]?.status === "active") return match.id;
      if (match.status !== "waiting") {
        throw new ConflictError("MATCH_ALREADY_STARTED", "The multiplayer match is no longer waiting");
      }

      const count = await database.query<{ count: number }>(`
        SELECT count(*)::integer AS count
        FROM multiplayer_players
        WHERE match_id = $1 AND status = 'active'
      `, [match.id]);
      if ((count.rows[0]?.count ?? 0) >= 2) {
        throw new ConflictError("MATCH_FULL", "The multiplayer room is full");
      }

      if (existing.rows[0]) {
        await database.query(`
          UPDATE multiplayer_players
          SET status = 'active', last_seen_at = now()
          WHERE match_id = $1 AND user_id = $2
        `, [match.id, userId]);
      } else {
        await this.insertPlayer(database, match.id, userId);
      }
      if (match.visibility === "public") await this.startLocked(database, match.id);
      return match.id;
    });
    return this.getState(userId, matchId);
  }

  async start(userId: string, matchId: string): Promise<MatchState> {
    await withTransaction(this.pool, async (database) => {
      const match = await this.lockMatch(database, matchId);
      if (match.hostUserId !== userId) throw new ForbiddenError("Only the room host can start the match");
      await this.startLocked(database, matchId);
    });
    return this.getState(userId, matchId);
  }

  async getState(userId: string, matchId: string): Promise<MatchState> {
    return withTransaction(this.pool, async (database) => {
      await this.requireMembership(database, userId, matchId);
      await this.synchronizeLocked(database, matchId);
      await database.query(`
        UPDATE multiplayer_players SET last_seen_at = now()
        WHERE match_id = $1 AND user_id = $2
      `, [matchId, userId]);
      return this.readState(database, userId, matchId);
    });
  }

  async findCurrent(userId: string): Promise<MatchState | null> {
    const result = await this.pool.query<{ matchId: string }>(`
      SELECT p.match_id AS "matchId"
      FROM multiplayer_players p
      JOIN multiplayer_matches m ON m.id = p.match_id
      WHERE p.user_id = $1
        AND p.status = 'active'
        AND m.status IN ('waiting', 'active')
        AND m.expires_at > now()
      ORDER BY m.updated_at DESC
      LIMIT 1
    `, [userId]);
    const current = result.rows[0];
    return current ? this.getState(userId, current.matchId) : null;
  }

  async submitAnswer(
    userId: string,
    matchId: string,
    input: SubmitMultiplayerAnswerInput,
  ): Promise<{ accepted: true; replayed: boolean; match: MatchState }> {
    const result = await withTransaction(this.pool, async (database) => {
      await this.requireMembership(database, userId, matchId);
      await this.synchronizeLocked(database, matchId);
      const match = await this.lockMatch(database, matchId);
      if (match.status !== "active") {
        throw new ConflictError("MATCH_NOT_ACTIVE", "The multiplayer match is not active");
      }
      if (match.currentQuestionPosition !== input.questionPosition) {
        throw new ConflictError("ROUND_CHANGED", "This multiplayer round is no longer active");
      }
      if (match.roundRevealedAt || !match.roundStartedAt || !match.roundEndsAt || match.roundEndsAt.getTime() <= Date.now()) {
        throw new ConflictError("ROUND_CLOSED", "The answer window has closed");
      }

      const player = await database.query<{ status: PlayerRow["status"] }>(`
        SELECT status FROM multiplayer_players
        WHERE match_id = $1 AND user_id = $2
        FOR UPDATE
      `, [matchId, userId]);
      if (player.rows[0]?.status !== "active") throw new NotFoundError("Multiplayer player");

      const replay = await database.query<AnswerRow & { questionPosition: number }>(`
        SELECT
          selected_option_id AS "selectedOptionId",
          question_position AS "questionPosition",
          is_correct AS "isCorrect",
          points_awarded AS "pointsAwarded"
        FROM multiplayer_answers
        WHERE match_id = $1 AND user_id = $2 AND idempotency_key = $3
      `, [matchId, userId, input.idempotencyKey]);
      const existing = replay.rows[0];
      if (existing) {
        if (existing.questionPosition !== input.questionPosition || existing.selectedOptionId !== input.selectedOptionId) {
          throw new ConflictError("IDEMPOTENCY_KEY_REUSED", "The idempotency key was used for another multiplayer answer");
        }
        return { accepted: true as const, replayed: true };
      }

      const selection = await database.query<{ isCorrect: boolean }>(`
        SELECT qo.is_correct AS "isCorrect"
        FROM multiplayer_match_questions mq
        JOIN question_options qo ON qo.question_id = mq.question_id AND qo.active
        WHERE mq.match_id = $1 AND mq.position = $2 AND qo.id = $3
      `, [matchId, input.questionPosition, input.selectedOptionId]);
      const selected = selection.rows[0];
      if (!selected) {
        throw new ConflictError("INVALID_QUESTION_OPTION", "The option does not belong to the current multiplayer question");
      }

      const totalMs = match.roundDurationSeconds * 1_000;
      const responseMs = Math.max(0, Math.min(totalMs, Date.now() - match.roundStartedAt.getTime()));
      const pointsAwarded = multiplayerAnswerPoints(selected.isCorrect, responseMs, totalMs);

      try {
        await database.query(`
          INSERT INTO multiplayer_answers (
            match_id, question_position, user_id, selected_option_id,
            idempotency_key, is_correct, response_ms, points_awarded
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [
          matchId,
          input.questionPosition,
          userId,
          input.selectedOptionId,
          input.idempotencyKey,
          selected.isCorrect,
          responseMs,
          pointsAwarded,
        ]);
      } catch (error) {
        if ((error as { code?: string }).code === "23505") {
          throw new ConflictError("ANSWER_ALREADY_SUBMITTED", "An answer was already submitted for this round");
        }
        throw error;
      }

      await database.query(`
        UPDATE multiplayer_players SET last_seen_at = now()
        WHERE match_id = $1 AND user_id = $2
      `, [matchId, userId]);
      await this.synchronizeLocked(database, matchId);
      return { accepted: true as const, replayed: false };
    });
    return { ...result, match: await this.getState(userId, matchId) };
  }

  async leave(userId: string, matchId: string): Promise<void> {
    await withTransaction(this.pool, async (database) => {
      await this.lockUserMatchmaking(database, userId);
      const match = await this.lockMatch(database, matchId);
      const player = await database.query<{ status: PlayerRow["status"] }>(`
        SELECT status FROM multiplayer_players WHERE match_id = $1 AND user_id = $2 FOR UPDATE
      `, [matchId, userId]);
      if (!player.rows[0]) throw new NotFoundError("Multiplayer match");
      if (match.status === "finished" || match.status === "cancelled") return;

      if (match.status === "waiting") {
        if (match.hostUserId === userId) {
          await database.query(`
            UPDATE multiplayer_matches SET status = 'cancelled', finished_at = now()
            WHERE id = $1
          `, [matchId]);
        } else {
          await database.query(`
            UPDATE multiplayer_players SET status = 'left', last_seen_at = now()
            WHERE match_id = $1 AND user_id = $2
          `, [matchId, userId]);
        }
        return;
      }

      await database.query(`
        UPDATE multiplayer_players SET status = 'forfeited', last_seen_at = now()
        WHERE match_id = $1 AND user_id = $2
      `, [matchId, userId]);
      const opponent = await database.query<{ userId: string }>(`
        SELECT user_id AS "userId" FROM multiplayer_players
        WHERE match_id = $1 AND user_id <> $2 AND status = 'active'
        LIMIT 1
      `, [matchId, userId]);
      await this.finishLocked(database, matchId, opponent.rows[0]?.userId ?? null);
    });
  }

  private async createLocked(
    database: PoolClient,
    userId: string,
    input: CreateMatchInput,
    visibility: MatchVisibility,
    knownTopicId?: string,
  ): Promise<string> {
    const topicId = knownTopicId ?? (await this.requireTopic(database, input.topicSlug)).id;
    let matchId: string | undefined;
    for (let attempt = 0; attempt < 5 && !matchId; attempt += 1) {
      const result = await database.query<{ id: string }>(`
        INSERT INTO multiplayer_matches (
          code, host_user_id, topic_id, visibility, question_count, round_duration_seconds
        ) VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (code) DO NOTHING
        RETURNING id
      `, [createRoomCode(), userId, topicId, visibility, input.questionCount, input.roundDurationSeconds]);
      matchId = result.rows[0]?.id;
    }
    if (!matchId) throw new Error("Could not allocate a unique multiplayer room code");
    await this.insertPlayer(database, matchId, userId);
    return matchId;
  }

  private async lockUserMatchmaking(database: PoolClient, userId: string): Promise<void> {
    await database.query("SELECT pg_advisory_xact_lock(hashtextextended($1, 0))", [userId]);
  }

  private async requireNoLiveMatch(
    database: PoolClient,
    userId: string,
    allowedMatchId?: string,
  ): Promise<void> {
    const result = await database.query<{ matchId: string }>(`
      SELECT p.match_id AS "matchId"
      FROM multiplayer_players p
      JOIN multiplayer_matches m ON m.id = p.match_id
      WHERE p.user_id = $1
        AND p.status = 'active'
        AND m.status IN ('waiting', 'active')
        AND m.expires_at > now()
        AND ($2::uuid IS NULL OR p.match_id <> $2)
      ORDER BY m.updated_at DESC
      LIMIT 1
    `, [userId, allowedMatchId ?? null]);
    if (result.rows[0]) {
      throw new ConflictError("ACTIVE_MATCH_EXISTS", "Leave the current multiplayer match before joining another one");
    }
  }

  private async requireMembership(database: PoolClient, userId: string, matchId: string): Promise<void> {
    const result = await database.query<{ exists: boolean }>(`
      SELECT true AS exists
      FROM multiplayer_players
      WHERE match_id = $1 AND user_id = $2
    `, [matchId, userId]);
    if (!result.rows[0]) throw new NotFoundError("Multiplayer match");
  }

  private async requireTopic(database: PoolClient, topicSlug: string): Promise<{ id: string }> {
    const result = await database.query<{ id: string }>("SELECT id FROM topics WHERE slug = $1", [topicSlug]);
    const topic = result.rows[0];
    if (!topic) throw new NotFoundError("Topic");
    return topic;
  }

  private async insertPlayer(database: PoolClient, matchId: string, userId: string): Promise<void> {
    const result = await database.query(`
      INSERT INTO multiplayer_players (match_id, user_id, display_name)
      SELECT $1, id, display_name FROM users WHERE id = $2
    `, [matchId, userId]);
    if (result.rowCount !== 1) throw new NotFoundError("User");
  }

  private async startLocked(database: PoolClient, matchId: string): Promise<void> {
    const match = await this.lockMatch(database, matchId);
    if (match.status === "active") return;
    if (match.status !== "waiting") {
      throw new ConflictError("MATCH_NOT_WAITING", "The multiplayer match cannot be started");
    }
    const players = await database.query<{ count: number }>(`
      SELECT count(*)::integer AS count FROM multiplayer_players
      WHERE match_id = $1 AND status = 'active'
    `, [matchId]);
    if (players.rows[0]?.count !== 2) {
      throw new ConflictError("PLAYERS_REQUIRED", "Two active players are required to start");
    }

    await database.query(`
      WITH eligible AS (
        SELECT q.id
        FROM questions q
        JOIN question_options qo ON qo.question_id = q.id AND qo.active
        WHERE q.topic_id = $2 AND q.status = 'published'
        GROUP BY q.id
        HAVING count(*) >= 2 AND count(*) FILTER (WHERE qo.is_correct) = 1
      ), chosen AS (
        SELECT id
        FROM eligible
        ORDER BY random()
        LIMIT $3
      ), selected AS (
        SELECT id, row_number() OVER ()::smallint AS position
        FROM chosen
      )
      INSERT INTO multiplayer_match_questions (match_id, position, question_id)
      SELECT $1, position, id FROM selected
    `, [matchId, match.topicId, match.questionCount]);
    const selected = await database.query<{ count: number }>(`
      SELECT count(*)::integer AS count FROM multiplayer_match_questions WHERE match_id = $1
    `, [matchId]);
    if (selected.rows[0]?.count !== match.questionCount) {
      throw new ConflictError("NOT_ENOUGH_QUESTIONS", "The topic does not have enough multiplayer questions");
    }

    await database.query(`
      UPDATE multiplayer_matches SET
        status = 'active',
        current_question_position = 1,
        started_at = now(),
        round_started_at = now(),
        round_ends_at = now() + round_duration_seconds * interval '1 second',
        round_revealed_at = NULL,
        expires_at = now() + interval '2 hours'
      WHERE id = $1
    `, [matchId]);
  }

  private async synchronizeLocked(database: PoolClient, matchId: string): Promise<void> {
    const match = await this.lockMatch(database, matchId);
    if (match.status === "waiting" && match.expiresAt.getTime() <= Date.now()) {
      await database.query(`
        UPDATE multiplayer_matches SET status = 'cancelled', finished_at = now() WHERE id = $1
      `, [matchId]);
      return;
    }
    if (match.status !== "active" || !match.roundEndsAt) return;

    const counts = await database.query<{ players: number; answers: number }>(`
      SELECT
        (SELECT count(*)::integer FROM multiplayer_players
          WHERE match_id = $1 AND status = 'active') AS players,
        (SELECT count(*)::integer FROM multiplayer_answers
          WHERE match_id = $1 AND question_position = $2) AS answers
    `, [matchId, match.currentQuestionPosition]);
    const count = counts.rows[0] ?? { players: 0, answers: 0 };
    if (!match.roundRevealedAt) {
      if (roundShouldReveal({
        activePlayers: count.players,
        answers: count.answers,
        roundEndsAtMs: match.roundEndsAt.getTime(),
        nowMs: Date.now(),
      })) {
        await database.query(`
          UPDATE multiplayer_players p SET
            score = p.score + totals.points,
            answered_count = p.answered_count + totals.answered,
            correct_count = p.correct_count + totals.correct
          FROM (
            SELECT
              user_id,
              coalesce(sum(points_awarded), 0)::integer AS points,
              count(*)::integer AS answered,
              count(*) FILTER (WHERE is_correct)::integer AS correct
            FROM multiplayer_answers
            WHERE match_id = $1 AND question_position = $2
            GROUP BY user_id
          ) totals
          WHERE p.match_id = $1 AND p.user_id = totals.user_id
        `, [matchId, match.currentQuestionPosition]);
        await database.query(`
          UPDATE multiplayer_matches SET round_revealed_at = now() WHERE id = $1
        `, [matchId]);
      }
      return;
    }

    if (match.roundRevealedAt.getTime() + REVIEW_DURATION_MS > Date.now()) return;
    if (match.currentQuestionPosition >= match.questionCount) {
      await this.finishLocked(database, matchId, null);
      return;
    }
    await database.query(`
      UPDATE multiplayer_matches SET
        current_question_position = current_question_position + 1,
        round_started_at = now(),
        round_ends_at = now() + round_duration_seconds * interval '1 second',
        round_revealed_at = NULL
      WHERE id = $1
    `, [matchId]);
  }

  private async finishLocked(database: PoolClient, matchId: string, forcedWinnerUserId: string | null): Promise<void> {
    const match = await this.lockMatch(database, matchId);
    if (match.status === "finished") return;

    let winnerUserId = forcedWinnerUserId;
    if (!winnerUserId) {
      const leaders = await database.query<{ userId: string; score: number; correctCount: number }>(`
        SELECT user_id AS "userId", score, correct_count AS "correctCount" FROM multiplayer_players
        WHERE match_id = $1
        ORDER BY score DESC, correct_count DESC
      `, [matchId]);
      winnerUserId = winningUserId(leaders.rows);
    }

    await database.query(`
      UPDATE multiplayer_matches SET
        status = 'finished', winner_user_id = $2, finished_at = now(),
        round_ends_at = NULL, round_revealed_at = NULL
      WHERE id = $1
    `, [matchId, winnerUserId]);
    if (match.rewardsApplied) return;

    await database.query(`
      UPDATE multiplayer_players SET reward_points = CASE
        WHEN $2::uuid IS NULL THEN 15
        WHEN user_id = $2 THEN 20
        ELSE 5
      END
      WHERE match_id = $1
    `, [matchId, winnerUserId]);
    await database.query(`
      UPDATE users u SET points = u.points + p.reward_points
      FROM multiplayer_players p
      WHERE p.match_id = $1 AND p.user_id = u.id
    `, [matchId]);
    await database.query("UPDATE multiplayer_matches SET rewards_applied = true WHERE id = $1", [matchId]);
  }

  private async lockMatch(database: PoolClient, matchId: string): Promise<MatchRow & { rewardsApplied: boolean }> {
    const result = await database.query<MatchRow & { rewardsApplied: boolean }>(`
      SELECT
        m.id,
        m.code,
        m.host_user_id AS "hostUserId",
        m.topic_id AS "topicId",
        t.slug AS "topicSlug",
        t.title AS "topicTitle",
        m.visibility,
        m.status,
        m.question_count AS "questionCount",
        m.round_duration_seconds AS "roundDurationSeconds",
        m.current_question_position AS "currentQuestionPosition",
        m.round_started_at AS "roundStartedAt",
        m.round_ends_at AS "roundEndsAt",
        m.round_revealed_at AS "roundRevealedAt",
        m.winner_user_id AS "winnerUserId",
        m.rewards_applied AS "rewardsApplied",
        m.created_at AS "createdAt",
        m.started_at AS "startedAt",
        m.finished_at AS "finishedAt",
        m.expires_at AS "expiresAt"
      FROM multiplayer_matches m
      JOIN topics t ON t.id = m.topic_id
      WHERE m.id = $1
      FOR UPDATE OF m
    `, [matchId]);
    const match = result.rows[0];
    if (!match) throw new NotFoundError("Multiplayer match");
    return match;
  }

  private async readState(database: PoolClient, userId: string, matchId: string): Promise<MatchState> {
    const matchResult = await database.query<MatchRow>(`
      SELECT
        m.id, m.code, m.host_user_id AS "hostUserId", m.topic_id AS "topicId",
        t.slug AS "topicSlug", t.title AS "topicTitle", m.visibility, m.status,
        m.question_count AS "questionCount",
        m.round_duration_seconds AS "roundDurationSeconds",
        m.current_question_position AS "currentQuestionPosition",
        m.round_started_at AS "roundStartedAt", m.round_ends_at AS "roundEndsAt",
        m.round_revealed_at AS "roundRevealedAt", m.winner_user_id AS "winnerUserId",
        m.created_at AS "createdAt", m.started_at AS "startedAt",
        m.finished_at AS "finishedAt", m.expires_at AS "expiresAt"
      FROM multiplayer_matches m JOIN topics t ON t.id = m.topic_id
      WHERE m.id = $1
    `, [matchId]);
    const match = matchResult.rows[0];
    if (!match) throw new NotFoundError("Multiplayer match");

    const players = await database.query<PlayerRow>(`
      SELECT
        p.user_id AS "userId", p.display_name AS "displayName", p.status,
        p.score, p.correct_count AS "correctCount", p.answered_count AS "answeredCount",
        p.reward_points AS "rewardPoints",
        EXISTS (
          SELECT 1 FROM multiplayer_answers a
          WHERE a.match_id = p.match_id AND a.user_id = p.user_id
            AND a.question_position = $2
        ) AS "answeredCurrent"
      FROM multiplayer_players p
      WHERE p.match_id = $1
      ORDER BY p.score DESC, p.joined_at
    `, [matchId, match.currentQuestionPosition]);

    let round: MatchState["round"] = null;
    if (match.status === "active" && match.currentQuestionPosition > 0 && match.roundStartedAt && match.roundEndsAt) {
      const questionResult = await database.query<QuestionRow>(`
        SELECT
          q.id, q.prompt, q.type, q.difficulty,
          CASE WHEN q.code IS NULL THEN NULL
            ELSE json_build_object('language', q.code_language, 'code', q.code)
          END AS "codeSnippet"
        FROM multiplayer_match_questions mq
        JOIN questions q ON q.id = mq.question_id
        WHERE mq.match_id = $1 AND mq.position = $2
      `, [matchId, match.currentQuestionPosition]);
      const question = questionResult.rows[0];
      if (!question) throw new Error("Active multiplayer round has no question");
      const options = await database.query<OptionRow>(`
        SELECT id, question_id AS "questionId", label, position
        FROM question_options
        WHERE question_id = $1 AND active
        ORDER BY position
      `, [question.id]);
      const myAnswer = await database.query<VisibleAnswerRow>(`
        SELECT
          selected_option_id AS "selectedOptionId",
          CASE WHEN $4::boolean THEN is_correct ELSE NULL END AS "isCorrect",
          CASE WHEN $4::boolean THEN points_awarded ELSE NULL END AS "pointsAwarded"
        FROM multiplayer_answers
        WHERE match_id = $1 AND question_position = $2 AND user_id = $3
      `, [matchId, match.currentQuestionPosition, userId, Boolean(match.roundRevealedAt)]);
      let correctOptionId: string | null = null;
      if (match.roundRevealedAt) {
        const correct = await database.query<{ id: string }>(`
          SELECT qo.id FROM question_options qo
          WHERE qo.question_id = $1 AND qo.is_correct AND qo.active
        `, [question.id]);
        correctOptionId = correct.rows[0]?.id ?? null;
      }
      round = {
        phase: match.roundRevealedAt ? "reveal" : "answering",
        position: match.currentQuestionPosition,
        startedAt: match.roundStartedAt.toISOString(),
        endsAt: match.roundEndsAt.toISOString(),
        revealedAt: iso(match.roundRevealedAt),
        question: { ...question, options: options.rows },
        correctOptionId,
        myAnswer: myAnswer.rows[0] ?? null,
      };
    }

    return {
      id: match.id,
      code: match.code,
      hostUserId: match.hostUserId,
      topic: { id: match.topicId, slug: match.topicSlug, title: match.topicTitle },
      visibility: match.visibility,
      status: match.status,
      questionCount: match.questionCount,
      roundDurationSeconds: match.roundDurationSeconds,
      currentQuestionPosition: match.currentQuestionPosition,
      winnerUserId: match.winnerUserId,
      createdAt: match.createdAt.toISOString(),
      startedAt: iso(match.startedAt),
      finishedAt: iso(match.finishedAt),
      expiresAt: match.expiresAt.toISOString(),
      players: players.rows,
      round,
    };
  }
}
