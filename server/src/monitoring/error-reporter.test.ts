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
    assert.equal(authorization, "Bearer reporting-secret-token");
    assert.doesNotMatch(requestBody.toLowerCase(), /password|authorization|cookie/);
  });
});
