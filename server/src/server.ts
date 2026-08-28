import { buildApp } from "./app.js";
import { loadConfig, loadLocalEnvFile } from "./config/env.js";
import { createPool } from "./db/pool.js";

loadLocalEnvFile();
const config = loadConfig();
const database = createPool(config);
const app = await buildApp({ config, database });

async function shutdown(signal: string): Promise<void> {
  app.log.info({ signal }, "Shutting down");
  await app.close();
  await database.end();
  process.exitCode = 0;
}

process.once("SIGINT", () => void shutdown("SIGINT"));
process.once("SIGTERM", () => void shutdown("SIGTERM"));

try {
  await app.listen({ host: config.HOST, port: config.PORT });
} catch (error) {
  app.log.fatal(error);
  await database.end();
  process.exitCode = 1;
}
