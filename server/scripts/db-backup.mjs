import { createBackup } from "./db-operations.mjs";
import { parseArguments, positiveInteger } from "./db-tools.mjs";

const { values, flags } = parseArguments(process.argv.slice(2));
const result = await createBackup({
  outputDirectory: values.get("output-dir"),
  retentionDays: positiveInteger(values.get("retention-days"), 14, "retention-days"),
  retentionCount: positiveInteger(values.get("retention-count"), 7, "retention-count"),
  docker: flags.has("docker"),
  dockerService: values.get("docker-service") ?? "postgres",
});
process.stdout.write(`Backup created: ${result.path}\nSHA-256: ${result.checksum}\nSize: ${result.bytes} bytes\n`);
if (result.removed.length) process.stdout.write(`Pruned ${result.removed.length} expired backup(s).\n`);
