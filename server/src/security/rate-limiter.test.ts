import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { FixedWindowRateLimiter } from "./rate-limiter.js";

describe("FixedWindowRateLimiter", () => {
  it("blocks requests above the limit and resets after the window", () => {
    let now = 1_000;
    const limiter = new FixedWindowRateLimiter(2, 5_000, 100, () => now);

    assert.equal(limiter.consume("client").allowed, true);
    assert.equal(limiter.consume("client").remaining, 0);
    const blocked = limiter.consume("client");
    assert.equal(blocked.allowed, false);
    assert.equal(blocked.retryAfterSeconds, 5);

    now = 6_000;
    assert.equal(limiter.consume("client").allowed, true);
  });

  it("keeps separate client buckets", () => {
    const limiter = new FixedWindowRateLimiter(1, 60_000);
    assert.equal(limiter.consume("first").allowed, true);
    assert.equal(limiter.consume("first").allowed, false);
    assert.equal(limiter.consume("second").allowed, true);
  });
});
