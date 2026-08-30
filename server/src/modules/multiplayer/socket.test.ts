import assert from "node:assert/strict";
import type { AddressInfo } from "node:net";
import { describe, it } from "node:test";
import Fastify from "fastify";
import type { Pool } from "pg";
import WebSocket from "ws";

import type { MatchState } from "./service.js";
import {
  matchIdFromSocketUrl,
  nextMatchTransitionAt,
  parseAuthenticationMessage,
  registerMultiplayerRealtime,
} from "./socket.js";
import type { MultiplayerService } from "./service.js";

const matchId = "123e4567-e89b-42d3-a456-426614174000";

function match(overrides: Partial<MatchState> = {}): MatchState {
  return {
    id: matchId,
    code: "ABCDEFGH",
    hostUserId: "user-1",
    topic: { id: "topic-1", slug: "python", title: "Python" },
    visibility: "private",
    status: "waiting",
    questionCount: 5,
    roundDurationSeconds: 20,
    currentQuestionPosition: 0,
    winnerUserId: null,
    createdAt: "2026-01-01T00:00:00.000Z",
    startedAt: null,
    finishedAt: null,
    expiresAt: "2026-01-01T00:10:00.000Z",
    players: [],
    round: null,
    ...overrides,
  };
}

describe("multiplayer WebSocket protocol", () => {
  it("accepts only the exact versioned match socket path", () => {
    assert.equal(
      matchIdFromSocketUrl(`/api/v1/multiplayer/matches/${matchId}/socket?ignored=true`),
      matchId,
    );
    assert.equal(matchIdFromSocketUrl(`/api/v1/multiplayer/matches/not-a-uuid/socket`), null);
    assert.equal(matchIdFromSocketUrl(`/api/v1/multiplayer/matches/${matchId}`), null);
  });

  it("validates the first authentication frame without exposing the token in the URL", () => {
    const token = "a".repeat(43);
    assert.deepEqual(
      parseAuthenticationMessage(Buffer.from(JSON.stringify({ type: "authenticate", token }))),
      { type: "authenticate", token },
    );
    assert.equal(parseAuthenticationMessage(Buffer.from("not-json")), null);
    assert.equal(parseAuthenticationMessage(Buffer.from(JSON.stringify({ type: "authenticate", token: "short" }))), null);
  });

  it("schedules waiting, answering, and review transitions", () => {
    assert.equal(nextMatchTransitionAt(match()), Date.parse("2026-01-01T00:10:00.000Z"));
    assert.equal(nextMatchTransitionAt(match({
      status: "active",
      round: {
        phase: "answering",
        position: 1,
        startedAt: "2026-01-01T00:00:00.000Z",
        endsAt: "2026-01-01T00:00:20.000Z",
        revealedAt: null,
        question: { id: "q1", prompt: "?", type: "boolean", difficulty: 1, codeSnippet: null, options: [] },
        correctOptionId: null,
        myAnswer: null,
      },
    })), Date.parse("2026-01-01T00:00:20.000Z"));
    assert.equal(nextMatchTransitionAt(match({
      status: "active",
      round: {
        phase: "reveal",
        position: 1,
        startedAt: "2026-01-01T00:00:00.000Z",
        endsAt: "2026-01-01T00:00:20.000Z",
        revealedAt: "2026-01-01T00:00:18.000Z",
        question: { id: "q1", prompt: "?", type: "boolean", difficulty: 1, codeSnippet: null, options: [] },
        correctOptionId: "option-1",
        myAnswer: null,
      },
    })), Date.parse("2026-01-01T00:00:21.000Z"));
  });

  it("authenticates a real socket and sends the initial match state", async () => {
    const app = Fastify({ logger: false });
    const state = match();
    const database = {
      query: async () => ({
        rows: [{ userId: "user-1", sessionId: "session-1" }],
        rowCount: 1,
      }),
    } as unknown as Pool;
    const multiplayer = {
      getState: async (userId: string, requestedMatchId: string) => {
        assert.equal(userId, "user-1");
        assert.equal(requestedMatchId, matchId);
        return state;
      },
    } as unknown as MultiplayerService;
    registerMultiplayerRealtime(app, database, multiplayer, "*");
    await app.listen({ host: "127.0.0.1", port: 0 });
    const { port } = app.server.address() as AddressInfo;
    const socket = new WebSocket(`ws://127.0.0.1:${port}/api/v1/multiplayer/matches/${matchId}/socket`);

    const frames = await new Promise<unknown[]>((resolve, reject) => {
      const received: unknown[] = [];
      const timeout = setTimeout(() => reject(new Error("Timed out waiting for WebSocket state")), 2_000);
      socket.on("open", () => {
        socket.send(JSON.stringify({ type: "authenticate", token: "a".repeat(43) }));
      });
      socket.on("message", (data) => {
        received.push(JSON.parse(data.toString()));
        if (received.length === 2) {
          clearTimeout(timeout);
          resolve(received);
        }
      });
      socket.on("error", reject);
    });

    assert.deepEqual(frames, [
      { type: "connection.ready" },
      { type: "match.state", match: state },
    ]);
    socket.close();
    await app.close();
  });
});
