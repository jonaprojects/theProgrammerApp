import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { Pool } from "pg";

try { process.loadEnvFile(); } catch (error) {
  if (error?.code !== "ENOENT") throw error;
}

const apiBase = process.env.MULTIPLAYER_SMOKE_API_URL ?? "http://localhost:3000/api/v1";
const database = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === "true" ? { rejectUnauthorized: true } : false,
});
const createdUserIds = [];

class RequestError extends Error {
  constructor(status, payload, method, path) {
    super(`${method} ${path} failed (${status}): ${JSON.stringify(payload)}`);
    this.status = status;
    this.payload = payload;
  }
}

async function request(path, { token, method = "GET", body } = {}) {
  const response = await fetch(`${apiBase}${path}`, {
    method,
    headers: {
      Accept: "application/json",
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new RequestError(response.status, payload, method, path);
  return response.status === 204 ? undefined : payload.data;
}

async function register(label) {
  const unique = randomUUID();
  const result = await request("/auth/register", {
    method: "POST",
    body: {
      email: `multiplayer-${label}-${unique}@example.test`,
      password: `Smoke-${unique}!`,
      displayName: `Smoke ${label}`,
    },
  });
  createdUserIds.push(result.user.id);
  return result;
}

try {
  const [host, guest, spectator] = await Promise.all([register("Host"), register("Guest"), register("Spectator")]);
  const topics = await request("/topics");
  const topic = topics.find(({ questionCount }) => questionCount >= 5);
  assert.ok(topic, "A topic with at least five published questions is required");

  const created = await request("/multiplayer/matches", {
    token: host.token,
    method: "POST",
    body: { topicSlug: topic.slug, questionCount: 5, roundDurationSeconds: 15 },
  });
  assert.equal(created.status, "waiting");
  assert.equal(created.players.length, 1);
  assert.match(created.code, /^[A-Z2-9]{8}$/);

  const joined = await request("/multiplayer/join", {
    token: guest.token,
    method: "POST",
    body: { code: created.code },
  });
  assert.equal(joined.players.length, 2);

  const started = await request(`/multiplayer/matches/${created.id}/start`, {
    token: host.token,
    method: "POST",
  });
  assert.equal(started.status, "active");
  assert.equal(started.round.position, 1);
  assert.equal(started.round.correctOptionId, null, "Correctness must be hidden while answers are open");

  await database.query(`
    UPDATE multiplayer_matches SET round_ends_at = now() - interval '1 second'
    WHERE id = $1
  `, [created.id]);
  await assert.rejects(
    request(`/multiplayer/matches/${created.id}`, { token: spectator.token }),
    (error) => error instanceof RequestError && error.status === 404,
  );
  const untouchedBySpectator = await database.query(`
    SELECT round_revealed_at FROM multiplayer_matches WHERE id = $1
  `, [created.id]);
  assert.equal(untouchedBySpectator.rows[0]?.round_revealed_at, null, "A non-member must not synchronize match state");
  await database.query(`
    UPDATE multiplayer_matches SET round_ends_at = now() + interval '15 seconds'
    WHERE id = $1
  `, [created.id]);

  const correct = await database.query(`
    SELECT correct.id AS correct_id, wrong.id AS wrong_id
    FROM multiplayer_match_questions mq
    JOIN question_options correct
      ON correct.question_id = mq.question_id AND correct.is_correct AND correct.active
    JOIN LATERAL (
      SELECT id FROM question_options
      WHERE question_id = mq.question_id AND NOT is_correct AND active
      ORDER BY position LIMIT 1
    ) wrong ON true
    WHERE mq.match_id = $1 AND mq.position = 1
  `, [created.id]);
  const options = correct.rows[0];
  assert.ok(options);

  const hostAnswer = await request(`/multiplayer/matches/${created.id}/answers`, {
    token: host.token,
    method: "POST",
    body: { questionPosition: 1, selectedOptionId: options.correct_id, idempotencyKey: randomUUID() },
  });
  assert.deepEqual(Object.keys(hostAnswer).sort(), ["accepted", "match", "replayed"]);
  assert.equal(hostAnswer.match.round.correctOptionId, null);
  assert.equal(hostAnswer.match.round.myAnswer.isCorrect, null);
  assert.equal(hostAnswer.match.round.myAnswer.pointsAwarded, null);
  assert.equal(hostAnswer.match.players.find(({ userId }) => userId === host.user.id).score, 0);

  const guestBeforeAnswer = await request(`/multiplayer/matches/${created.id}`, { token: guest.token });
  assert.equal(guestBeforeAnswer.round.correctOptionId, null);
  assert.equal(guestBeforeAnswer.players.find(({ userId }) => userId === host.user.id).score, 0);

  const guestAnswer = await request(`/multiplayer/matches/${created.id}/answers`, {
    token: guest.token,
    method: "POST",
    body: { questionPosition: 1, selectedOptionId: options.wrong_id, idempotencyKey: randomUUID() },
  });
  assert.equal(guestAnswer.match.round.phase, "reveal");
  assert.equal(guestAnswer.match.round.correctOptionId, options.correct_id);
  assert.equal(guestAnswer.match.round.myAnswer.isCorrect, false);

  const hostReveal = await request(`/multiplayer/matches/${created.id}`, { token: host.token });
  const hostPlayer = hostReveal.players.find(({ userId }) => userId === host.user.id);
  const guestPlayer = hostReveal.players.find(({ userId }) => userId === guest.user.id);
  assert.equal(hostReveal.round.myAnswer.isCorrect, true);
  assert.ok(hostReveal.round.myAnswer.pointsAwarded >= 1_000);
  assert.equal(hostPlayer.score, hostReveal.round.myAnswer.pointsAwarded);
  assert.equal(hostPlayer.correctCount, 1);
  assert.equal(guestPlayer.score, 0);

  await request(`/multiplayer/matches/${created.id}/leave`, { token: guest.token, method: "POST" });
  const finished = await request(`/multiplayer/matches/${created.id}`, { token: host.token });
  assert.equal(finished.status, "finished");
  assert.equal(finished.winnerUserId, host.user.id);
  assert.equal(finished.players.find(({ userId }) => userId === host.user.id).rewardPoints, 20);
  assert.equal(finished.players.find(({ userId }) => userId === guest.user.id).status, "forfeited");

  const competingCreates = await Promise.allSettled([
    request("/multiplayer/matches", {
      token: host.token,
      method: "POST",
      body: { topicSlug: topic.slug, questionCount: 5, roundDurationSeconds: 15 },
    }),
    request("/multiplayer/matchmaking", {
      token: host.token,
      method: "POST",
      body: { topicSlug: topic.slug, questionCount: 5, roundDurationSeconds: 15 },
    }),
  ]);
  const createdConcurrently = competingCreates.filter(({ status }) => status === "fulfilled");
  const rejectedConcurrently = competingCreates.filter(({ status }) => status === "rejected");
  assert.equal(createdConcurrently.length, 1, "Only one concurrent match creation may succeed per user");
  assert.equal(rejectedConcurrently.length, 1);
  assert.ok(
    rejectedConcurrently[0].reason instanceof RequestError
      && rejectedConcurrently[0].reason.status === 409
      && rejectedConcurrently[0].reason.payload?.error?.code === "ACTIVE_MATCH_EXISTS",
    "The losing concurrent request should report the existing live match",
  );
  const concurrentMatch = createdConcurrently[0].value;
  const concurrentCurrent = await request("/multiplayer/me/current", { token: host.token });
  assert.equal(concurrentCurrent.id, concurrentMatch.id);
  await request(`/multiplayer/matches/${concurrentMatch.id}/leave`, { token: host.token, method: "POST" });

  const hostQueue = await request("/multiplayer/matchmaking", {
    token: host.token,
    method: "POST",
    body: { topicSlug: topic.slug, questionCount: 5, roundDurationSeconds: 15 },
  });
  assert.equal(hostQueue.status, "waiting");
  assert.equal(hostQueue.visibility, "public");
  const resumedQueue = await request("/multiplayer/me/current", { token: host.token });
  assert.equal(resumedQueue.id, hostQueue.id);

  const guestQueue = await request("/multiplayer/matchmaking", {
    token: guest.token,
    method: "POST",
    body: { topicSlug: topic.slug, questionCount: 5, roundDurationSeconds: 15 },
  });
  assert.equal(guestQueue.id, hostQueue.id);
  assert.equal(guestQueue.status, "active");
  assert.equal(guestQueue.players.length, 2);

  let naturalState = guestQueue;
  for (let position = 1; position <= naturalState.questionCount; position += 1) {
    assert.equal(naturalState.round.position, position);
    if (position === 1) {
      await database.query(`
        UPDATE multiplayer_matches SET round_ends_at = now() - interval '1 second'
        WHERE id = $1
      `, [naturalState.id]);
      naturalState = await request(`/multiplayer/matches/${naturalState.id}`, { token: host.token });
      assert.equal(naturalState.round.phase, "reveal");
      assert.equal(naturalState.round.myAnswer, null);
    } else {
      const wrong = await database.query(`
        SELECT qo.id
        FROM multiplayer_match_questions mq
        JOIN question_options qo ON qo.question_id = mq.question_id AND qo.active AND NOT qo.is_correct
        WHERE mq.match_id = $1 AND mq.position = $2
        ORDER BY qo.position
        LIMIT 1
      `, [naturalState.id, position]);
      const wrongOptionId = wrong.rows[0]?.id;
      assert.ok(wrongOptionId);
      await request(`/multiplayer/matches/${naturalState.id}/answers`, {
        token: host.token,
        method: "POST",
        body: { questionPosition: position, selectedOptionId: wrongOptionId, idempotencyKey: randomUUID() },
      });
      naturalState = (await request(`/multiplayer/matches/${naturalState.id}/answers`, {
        token: guest.token,
        method: "POST",
        body: { questionPosition: position, selectedOptionId: wrongOptionId, idempotencyKey: randomUUID() },
      })).match;
      assert.equal(naturalState.round.phase, "reveal");
    }

    await database.query(`
      UPDATE multiplayer_matches SET round_revealed_at = now() - interval '4 seconds'
      WHERE id = $1
    `, [naturalState.id]);
    naturalState = await request(`/multiplayer/matches/${naturalState.id}`, { token: host.token });
  }

  assert.equal(naturalState.status, "finished");
  assert.equal(naturalState.winnerUserId, null);
  assert.equal(naturalState.players.every(({ rewardPoints }) => rewardPoints === 15), true);
  assert.equal(await request("/multiplayer/me/current", { token: host.token }), null);
  const pointsAfterNaturalFinish = await database.query(`
    SELECT id, points FROM users WHERE id = ANY($1::uuid[]) ORDER BY id
  `, [[host.user.id, guest.user.id]]);
  await request(`/multiplayer/matches/${naturalState.id}`, { token: guest.token });
  const pointsAfterReplay = await database.query(`
    SELECT id, points FROM users WHERE id = ANY($1::uuid[]) ORDER BY id
  `, [[host.user.id, guest.user.id]]);
  assert.deepEqual(pointsAfterReplay.rows, pointsAfterNaturalFinish.rows, "Finished-match polling must not apply rewards twice");

  process.stdout.write("Multiplayer smoke test passed: private lobby, quick match, reconnect, member isolation, single-live-match concurrency, hidden answers, timeout, all rounds, scoring, results, forfeit, and idempotent rewards.\n");
} finally {
  if (createdUserIds.length > 0) {
    await database.query("DELETE FROM users WHERE id = ANY($1::uuid[])", [createdUserIds]);
  }
  await database.end();
}
