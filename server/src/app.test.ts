import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Pool } from "pg";
import { buildApp } from "./app.js";
import type { AppConfig } from "./config/env.js";
import { UnauthorizedError } from "./shared/errors.js";
import type { ErrorReporter } from "./monitoring/error-reporter.js";

const config: AppConfig = {
  NODE_ENV: "test",
  HOST: "127.0.0.1",
  PORT: 3000,
  LOG_LEVEL: "silent",
  DATABASE_URL: "postgresql://unused",
  DATABASE_SSL: false,
  CORS_ORIGIN: "http://localhost:8081",
  AUTH_MODE: "session",
  TRUST_PROXY: false,
  BODY_LIMIT_BYTES: 65_536,
  API_RATE_LIMIT_MAX: 300,
  API_RATE_LIMIT_WINDOW_SECONDS: 60,
  AUTH_RATE_LIMIT_MAX: 10,
  AUTH_RATE_LIMIT_WINDOW_SECONDS: 900,
  CLIENT_ERROR_RATE_LIMIT_MAX: 20,
  CLIENT_ERROR_RATE_LIMIT_WINDOW_SECONDS: 60,
  APP_VERSION: "test",
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
    const metrics = await app.inject({ method: "GET", url: "/internal/metrics" });
    assert.equal(metrics.statusCode, 404);
    await app.close();
  });

  it("separates liveness from database readiness", async () => {
    const unavailablePool = {
      query: async () => { throw new Error("database unavailable"); },
    } as unknown as Pool;
    const app = await buildApp({ config, database: unavailablePool });

    const live = await app.inject({ method: "GET", url: "/health/live" });
    const ready = await app.inject({ method: "GET", url: "/health/ready" });
    assert.equal(live.statusCode, 200);
    assert.equal(ready.statusCode, 503);
    assert.equal(ready.json().database, "unreachable");
    await app.close();
  });

  it("protects Prometheus metrics with a dedicated token", async () => {
    const metricsToken = "a-strong-monitoring-token-with-32-characters";
    const app = await buildApp({
      config: { ...config, METRICS_TOKEN: metricsToken },
      database: createFakePool(),
    });

    const denied = await app.inject({ method: "GET", url: "/internal/metrics" });
    assert.equal(denied.statusCode, 401);
    const allowed = await app.inject({
      method: "GET",
      url: "/internal/metrics",
      headers: { authorization: `Bearer ${metricsToken}` },
    });
    assert.equal(allowed.statusCode, 200);
    assert.match(allowed.headers["content-type"] ?? "", /text\/plain/);
    assert.match(allowed.body, /the_programmer_http_requests_total/);
    assert.ok(allowed.headers["x-request-id"]);
    await app.close();
  });

  it("returns a correlated error ID and reports unhandled failures", async () => {
    const contexts: unknown[] = [];
    const reporter: ErrorReporter = {
      capture: (_error, context) => { contexts.push(context); return "error-event-123"; },
      flush: async () => undefined,
    };
    const failingPool = {
      query: async () => { throw new Error("database unavailable"); },
    } as unknown as Pool;
    const app = await buildApp({ config, database: failingPool, errorReporter: reporter });
    const response = await app.inject({
      method: "POST",
      url: "/api/v1/auth/login",
      payload: { email: "test@example.com", password: "incorrect-password" },
    });

    assert.equal(response.statusCode, 500);
    assert.equal(response.json().error.errorId, "error-event-123");
    assert.equal(response.json().error.requestId, response.headers["x-request-id"]);
    assert.deepEqual(contexts, [{
      requestId: response.json().error.requestId,
      method: "POST",
      route: "/api/v1/auth/login",
      source: "request",
    }]);
    await app.close();
  });

  it("accepts sanitized client error reports before authentication", async () => {
    const captured: Array<{ error: unknown; context: unknown }> = [];
    const reporter: ErrorReporter = {
      capture: (error, context) => { captured.push({ error, context }); return "client-error-123"; },
      flush: async () => undefined,
    };
    const app = await buildApp({ config, database: createFakePool(), errorReporter: reporter });
    const response = await app.inject({
      method: "POST",
      url: "/api/v1/client-errors",
      payload: {
        message: "Rendering failed",
        stack: "Error: Rendering failed",
        componentStack: "at CourseScreen",
        route: "react-render-tree",
        platform: "web",
        appVersion: "1.0.0",
        clientEventId: "52f881f0-930d-41be-8eeb-07305a695869",
      },
    });

    assert.equal(response.statusCode, 202);
    assert.equal(response.json().data.eventId, "client-error-123");
    assert.equal((captured[0]?.error as Error).message, "Rendering failed");
    assert.deepEqual(captured[0]?.context, {
      source: "client",
      requestId: response.headers["x-request-id"],
      route: "react-render-tree",
      platform: "web",
      appVersion: "1.0.0",
      clientEventId: "52f881f0-930d-41be-8eeb-07305a695869",
    });
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

  it("sets defensive headers and disables caching for authentication", async () => {
    const app = await buildApp({ config, database: createFakePool() });
    const response = await app.inject({
      method: "POST",
      url: "/api/v1/auth/login",
      payload: { email: "test@example.com", password: "incorrect-password" },
    });

    assert.equal(response.headers["x-content-type-options"], "nosniff");
    assert.equal(response.headers["x-frame-options"], "DENY");
    assert.equal(response.headers["cache-control"], "no-store");
    assert.match(response.headers["content-security-policy"] ?? "", /default-src 'none'/);
    await app.close();
  });

  it("rejects request bodies above the configured limit", async () => {
    const app = await buildApp({ config: { ...config, BODY_LIMIT_BYTES: 16_384 }, database: createFakePool() });
    const response = await app.inject({
      method: "POST",
      url: "/api/v1/auth/login",
      payload: { email: "test@example.com", password: "x".repeat(20_000) },
    });

    assert.equal(response.statusCode, 413);
    await app.close();
  });

  it("rate limits authentication even when forwarding headers are spoofed", async () => {
    const app = await buildApp({
      config: { ...config, AUTH_RATE_LIMIT_MAX: 3 },
      database: createFakePool(),
    });

    for (let attempt = 1; attempt <= 3; attempt += 1) {
      const response = await app.inject({
        method: "POST",
        url: "/api/v1/auth/login",
        headers: { "x-forwarded-for": `203.0.113.${attempt}` },
        payload: { email: "target@example.com", password: "incorrect-password" },
      });
      assert.equal(response.statusCode, 401);
    }
    const blocked = await app.inject({
      method: "POST",
      url: "/api/v1/auth/login",
      headers: { "x-forwarded-for": "198.51.100.200" },
      payload: { email: "target@example.com", password: "incorrect-password" },
    });

    assert.equal(blocked.statusCode, 429);
    assert.equal(blocked.json().error.code, "RATE_LIMITED");
    assert.ok(Number(blocked.headers["retry-after"]) > 0);
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

  it("protects tutorial exercise progress with authentication", async () => {
    const app = await buildApp({
      config,
      database: createFakePool(),
      authenticate: async () => { throw new UnauthorizedError(); },
    });
    const response = await app.inject({
      method: "POST",
      url: "/api/v1/me/tutorial-exercises/python-intro-predict-output-1/submissions",
      payload: {
        action: "check",
        answer: "hello",
        hintUsed: false,
        idempotencyKey: "52f881f0-930d-41be-8eeb-07305a695869",
      },
    });

    assert.equal(response.statusCode, 401);
    assert.equal(response.json().error.code, "UNAUTHORIZED");
    await app.close();
  });

  it("protects multiplayer matchmaking with authentication", async () => {
    const app = await buildApp({
      config,
      database: createFakePool(),
      authenticate: async () => { throw new UnauthorizedError(); },
    });
    const response = await app.inject({
      method: "POST",
      url: "/api/v1/multiplayer/matchmaking",
      payload: { topicSlug: "python", questionCount: 5, roundDurationSeconds: 20 },
    });

    assert.equal(response.statusCode, 401);
    assert.equal(response.json().error.code, "UNAUTHORIZED");
    await app.close();
  });

  it("protects leaderboards and achievements with authentication", async () => {
    const app = await buildApp({
      config,
      database: createFakePool(),
      authenticate: async () => { throw new UnauthorizedError(); },
    });

    for (const url of ["/api/v1/leaderboards", "/api/v1/me/achievements"]) {
      const response = await app.inject({ method: "GET", url });
      assert.equal(response.statusCode, 401);
      assert.equal(response.json().error.code, "UNAUTHORIZED");
    }
    await app.close();
  });

  it("protects notification preferences and device registration with authentication", async () => {
    const app = await buildApp({
      config,
      database: createFakePool(),
      authenticate: async () => { throw new UnauthorizedError(); },
    });

    const responses = await Promise.all([
      app.inject({ method: "GET", url: "/api/v1/me/notifications/preferences" }),
      app.inject({
        method: "POST",
        url: "/api/v1/me/notifications/devices",
        payload: { token: "ExponentPushToken[test-token]", platform: "android" },
      }),
    ]);
    for (const response of responses) {
      assert.equal(response.statusCode, 401);
      assert.equal(response.json().error.code, "UNAUTHORIZED");
    }
    await app.close();
  });
});
