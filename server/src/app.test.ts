import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Pool } from "pg";
import { buildApp } from "./app.js";
import type { AppConfig } from "./config/env.js";

const config: AppConfig = {
  NODE_ENV: "test",
  HOST: "127.0.0.1",
  PORT: 3000,
  LOG_LEVEL: "silent",
  DATABASE_URL: "postgresql://unused",
  DATABASE_SSL: false,
  CORS_ORIGIN: "http://localhost:8081",
  AUTH_MODE: "session",
};

function createFakePool(): Pool {
  return {
    query: async () => ({ rows: [{ "?column?": 1 }], rowCount: 1 }),
  } as unknown as Pool;
}

describe("API", () => {
  it("reports database health", async () => {
    const app = await buildApp({ config, database: createFakePool() });
    const response = await app.inject({ method: "GET", url: "/health" });

    assert.equal(response.statusCode, 200);
    assert.equal(response.json().status, "ok");
    await app.close();
  });

  it("returns a stable validation error envelope", async () => {
    const app = await buildApp({ config, database: createFakePool() });
    const response = await app.inject({
      method: "POST",
      url: "/api/v1/auth/register",
      payload: { email: "not-an-email", password: "short", displayName: "" },
    });

    assert.equal(response.statusCode, 400);
    assert.equal(response.json().error.code, "VALIDATION_ERROR");
    await app.close();
  });

  it("allows browser preflights for lesson progress updates", async () => {
    const app = await buildApp({ config, database: createFakePool() });
    const response = await app.inject({
      method: "OPTIONS",
      url: "/api/v1/me/courses/python-basics/lessons/introduction/progress",
      headers: {
        origin: "http://localhost:8081",
        "access-control-request-method": "PUT",
        "access-control-request-headers": "authorization,content-type",
      },
    });

    assert.equal(response.statusCode, 204);
    assert.match(response.headers["access-control-allow-methods"] ?? "", /PUT/);
    await app.close();
  });
});
