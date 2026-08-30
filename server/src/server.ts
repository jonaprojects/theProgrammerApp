import { buildApp } from "./app.js";
import { loadConfig, loadLocalEnvFile } from "./config/env.js";
import { createPool } from "./db/pool.js";

loadLocalEnvFile();
const config = loadConfig();
const database = createPool(config);
const app = await buildApp({ config, database });
const errorReporter = app.errorReporter;
let shuttingDown = false;

async function shutdown(signal: string, exitCode = 0, error?: unknown): Promise<void> {
  if (shuttingDown) return;
  shuttingDown = true;
  if (error !== undefined) {
    const errorId = errorReporter.capture(error, { source: "process" });
    app.log.fatal({ err: error, errorId, signal }, "Fatal process error");
  }
  app.log.info({ signal }, "Shutting down");
  await app.close();
  await database.end();
  await errorReporter.flush();
  process.exitCode = exitCode;
}

process.once("SIGINT", () => void shutdown("SIGINT"));
process.once("SIGTERM", () => void shutdown("SIGTERM"));
process.once("unhandledRejection", (reason) => void shutdown("unhandledRejection", 1, reason));
process.once("uncaughtException", (error) => void shutdown("uncaughtException", 1, error));

try {
  await app.listen({ host: config.HOST, port: config.PORT });
} catch (error) {
  await shutdown("listenFailure", 1, error);
}
