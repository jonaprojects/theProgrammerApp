import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { loadConfig } from "./env.js";

describe("loadConfig", () => {
  it("parses a valid development environment", () => {
    const config = loadConfig({
      DATABASE_URL: "postgresql://postgres:postgres@localhost:5432/the_programmer",
    });

    assert.equal(config.PORT, 3000);
    assert.equal(config.DATABASE_SSL, false);
    assert.equal(config.AUTH_MODE, "session");
  });

  it("accepts session authentication in production", () => {
    const config = loadConfig({
      NODE_ENV: "production",
      AUTH_MODE: "session",
      DATABASE_URL: "postgresql://postgres:postgres@localhost:5432/the_programmer",
      CORS_ORIGIN: "https://app.example.com",
    });
    assert.equal(config.AUTH_MODE, "session");
  });

  it("rejects insecure production CORS configuration", () => {
    assert.throws(() => loadConfig({
      NODE_ENV: "production",
      DATABASE_URL: "postgresql://postgres:postgres@localhost:5432/the_programmer",
      CORS_ORIGIN: "*",
    }), /Wildcard CORS is not allowed/);
    assert.throws(() => loadConfig({
      NODE_ENV: "production",
      DATABASE_URL: "postgresql://postgres:postgres@localhost:5432/the_programmer",
      CORS_ORIGIN: "http:\/\/app.example.com",
    }), /Production CORS origins must use HTTPS/);
  });

  it("rejects a non-PostgreSQL database URL", () => {
    assert.throws(() => loadConfig({ DATABASE_URL: "https://example.com/database" }), /postgres/);
  });
});
