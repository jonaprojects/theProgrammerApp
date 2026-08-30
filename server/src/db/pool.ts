import { Pool } from "pg";
import type { AppConfig } from "../config/env.js";

export function createPool(config: AppConfig): Pool {
  return new Pool({
    connectionString: config.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
    query_timeout: 15_000,
    statement_timeout: 15_000,
    application_name: "the-programmer-api",
    keepAlive: true,
    ssl: config.DATABASE_SSL ? { rejectUnauthorized: true } : false,
  });
}
