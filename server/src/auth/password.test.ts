import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { hashPassword, verifyPassword } from "./password.js";
import { createSessionToken, hashSessionToken } from "./session.js";

describe("password authentication", () => {
  it("hashes passwords with a unique salt and verifies only the original password", async () => {
    const first = await hashPassword("correct horse battery staple");
    const second = await hashPassword("correct horse battery staple");

    assert.notEqual(first, second);
    assert.equal(await verifyPassword("correct horse battery staple", first), true);
    assert.equal(await verifyPassword("incorrect", first), false);
  });

  it("creates high-entropy opaque tokens and stable one-way session hashes", () => {
    const first = createSessionToken();
    const second = createSessionToken();

    assert.notEqual(first, second);
    assert.ok(first.length >= 40);
    assert.deepEqual(hashSessionToken(first), hashSessionToken(first));
    assert.notDeepEqual(hashSessionToken(first), hashSessionToken(second));
  });
});
