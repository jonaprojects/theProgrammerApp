import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { QueryResult, QueryResultRow } from "pg";
import type { Queryable } from "../../shared/types.js";
import { LeaderboardRepository } from "./repository.js";

function result<Row extends QueryResultRow>(rows: Row[]): QueryResult<Row> {
  return { command: "SELECT", rowCount: rows.length, oid: 0, fields: [], rows };
}

describe("LeaderboardRepository", () => {
  it("returns the top entries and the current user's rank", async () => {
    let values: readonly unknown[] | undefined;
    const rows = [
      { rank: 1, userId: "leader", displayName: "Leader", points: 500, isCurrentUser: false, periodStartedAt: new Date("2026-08-24T00:00:00Z") },
      { rank: 42, userId: "me", displayName: "Me", points: 12, isCurrentUser: true, periodStartedAt: new Date("2026-08-24T00:00:00Z") },
    ];
    const database: Queryable = {
      query: async <Row extends QueryResultRow>(_text: string, queryValues?: readonly unknown[]) => {
        values = queryValues;
        return result(rows as unknown as Row[]);
      },
    };

    const leaderboard = await new LeaderboardRepository(database).getLeaderboard("me", "weekly", 25);

    assert.deepEqual(values, ["me", "weekly", 25]);
    assert.equal(leaderboard.entries.length, 1);
    assert.equal(leaderboard.entries[0]?.userId, "leader");
    assert.equal(leaderboard.me?.rank, 42);
    assert.equal(leaderboard.me?.isCurrentUser, true);
  });

  it("syncs unlocked achievements before returning progress", async () => {
    const statements: string[] = [];
    const database: Queryable = {
      query: async <Row extends QueryResultRow>(text: string) => {
        statements.push(text);
        if (statements.length === 1) return result([] as Row[]);
        return result([{
          key: "first-steps", title: "Steps", description: "Earn points", iconName: "sparkles",
          metric: "points", threshold: 100, currentValue: 120, progressPercentage: 100,
          unlockedAt: new Date("2026-08-30T00:00:00Z"), isUnlocked: true,
        }] as unknown as Row[]);
      },
    };

    const achievements = await new LeaderboardRepository(database).getAchievements("me");

    assert.match(statements[0] ?? "", /ON CONFLICT \(user_id, achievement_key\) DO NOTHING/);
    assert.match(statements[1] ?? "", /LEFT JOIN user_achievements/);
    assert.equal(achievements.unlockedCount, 1);
    assert.equal(achievements.totalCount, 1);
  });
});
