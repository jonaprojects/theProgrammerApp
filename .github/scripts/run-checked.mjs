import { spawn } from "node:child_process";

const [title, command, ...args] = process.argv.slice(2);
if (!title || !command) {
  throw new Error("Usage: node run-checked.mjs TITLE COMMAND [ARGS...]");
}

const child = spawn(command, args, {
  env: process.env,
  shell: false,
  stdio: ["inherit", "pipe", "pipe"],
});
let tail = "";
const capture = (chunk, target) => {
  target.write(chunk);
  tail = (tail + chunk.toString("utf8")).slice(-16_000);
};
child.stdout.on("data", (chunk) => capture(chunk, process.stdout));
child.stderr.on("data", (chunk) => capture(chunk, process.stderr));

const exitCode = await new Promise((resolve, reject) => {
  child.once("error", reject);
  child.once("close", (code) => resolve(code ?? 1));
});
if (exitCode !== 0) {
  const escape = (value) => String(value)
    .replaceAll("%", "%25")
    .replaceAll("\r", "%0D")
    .replaceAll("\n", "%0A");
  const message = tail
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(-24)
    .join(" | ")
    .slice(0, 4_000);
  console.log(`::error title=${escape(title)}::${escape(message || `Exited with status ${exitCode}`)}`);
  process.exit(exitCode);
}
