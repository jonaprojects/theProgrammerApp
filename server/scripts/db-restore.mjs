import { restoreBackup } from "./db-operations.mjs";
import { parseArguments } from "./db-tools.mjs";

const { values, flags } = parseArguments(process.argv.slice(2));
const path = values.get("file");
if (!path) throw new Error("Usage: npm run db:restore -- --file <backup.dump> --confirm-database <name> [--docker]");
const result = await restoreBackup(path, {
  confirmDatabase: values.get("confirm-database"),
  safetyBackupDirectory: values.get("safety-backup-dir"),
  skipSafetyBackup: flags.has("skip-safety-backup"),
  docker: flags.has("docker"),
  dockerService: values.get("docker-service") ?? "postgres",
});
process.stdout.write(`Restore completed from: ${result.restored}\n`);
if (result.safetyBackup) process.stdout.write(`Pre-restore safety backup: ${result.safetyBackup}\n`);
