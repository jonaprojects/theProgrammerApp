import { readFile } from "node:fs/promises";

const [logPath, title = "Command failed"] = process.argv.slice(2);
if (!logPath) throw new Error("Usage: node annotate-command-failure.mjs LOG_PATH [TITLE]");

const escape = (value) => String(value)
  .replaceAll("%", "%25")
  .replaceAll("\r", "%0D")
  .replaceAll("\n", "%0A");

const lines = (await readFile(logPath, "utf8"))
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter(Boolean)
  .slice(-20);
const message = lines.join(" | ").slice(0, 4_000) || "The command returned a non-zero exit status without output.";
console.log(`::error title=${escape(title)}::${escape(message)}`);
