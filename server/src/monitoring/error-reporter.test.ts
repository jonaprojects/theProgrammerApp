import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { HttpErrorReporter } from "./error-reporter.js";

describe("HttpErrorReporter", () => {
  it("sends a correlated event without request bodies or headers", async () => {
    let requestBody = "";
    let authorization = "";
    const fakeFetch = (async (_input: string | URL | Request, init?: RequestInit) => {
      requestBody = String(init?.body ?? "");
      authorization = String((init?.headers as Record<string, string> | undefined)?.Authorization ?? "");
      return new Response(null, { status: 202 });
    }) as typeof fetch;
    const reporter = new HttpErrorReporter({
      url: "https://errors.example.com/events",
      token: "reporting-secret-token",
      environment: "test",
      release: "1.2.3",
    }, fakeFetch);

    const eventId = reporter.capture(new Error("database unavailable"), {
      requestId: "request-1",
      method: "POST",
      route: "/api/v1/auth/login",
      source: "request",
    });
    await reporter.flush();

    const payload = JSON.parse(requestBody) as Record<string, unknown>;
    assert.equal(payload.eventId, eventId);
    assert.equal(payload.message, "database unavailable");
    assert.equal(payload.dt, payload.timestamp);
    assert.equal(authorization, "Bearer reporting-secret-token");
    assert.doesNotMatch(requestBody.toLowerCase(), /password|authorization|cookie/);
  });

  it("reports non-success responses from the external receiver", async () => {
    const failures: string[] = [];
    const fakeFetch = (async () => new Response(null, { status: 503 })) as typeof fetch;
    const reporter = new HttpErrorReporter({
      url: "https://errors.example.com/events",
      environment: "test",
      release: "1.2.3",
    }, fakeFetch, 50, (error) => failures.push(error instanceof Error ? error.message : String(error)));

    reporter.capture(new Error("database unavailable"), { source: "request" });
    await reporter.flush();

    assert.deepEqual(failures, ["External error receiver returned HTTP 503"]);
  });

  it("reports a full delivery queue without creating unbounded work", () => {
    const failures: string[] = [];
    const reporter = new HttpErrorReporter({
      url: "https://errors.example.com/events",
      environment: "test",
      release: "1.2.3",
    }, (() => new Promise<Response>(() => undefined)) as typeof fetch, 0,
    (error) => failures.push(error instanceof Error ? error.message : String(error)));

    reporter.capture(new Error("database unavailable"), { source: "request" });

    assert.deepEqual(failures, ["External error report queue is full"]);
  });
});
