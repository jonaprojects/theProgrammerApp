import { verifyBackup } from "./db-operations.mjs";
import { parseArguments } from "./db-tools.mjs";

const { values, flags } = parseArguments(process.argv.slice(2));
const path = values.get("file");
if (!path) throw new Error("Usage: npm run db:verify -- --file <backup.dump> [--docker]");
const result = await verifyBackup(path, {
  docker: flags.has("docker"),
  dockerService: values.get("docker-service") ?? "postgres",
});
process.stdout.write(`Backup verified: ${result.path}\nSHA-256: ${result.checksum.checksum}\nArchive entries: ${result.entries}\n`);
