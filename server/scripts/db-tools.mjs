import { spawn } from "node:child_process";
import { createReadStream, createWriteStream, existsSync } from "node:fs";
import { mkdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const serverRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");

export function parseArguments(argv) {
  const values = new Map();
  const flags = new Set();
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (!argument.startsWith("--")) throw new Error(`Unexpected argument: ${argument}`);
    const [rawName, inlineValue] = argument.slice(2).split("=", 2);
    if (inlineValue !== undefined) {
      values.set(rawName, inlineValue);
    } else if (argv[index + 1] && !argv[index + 1].startsWith("--")) {
      values.set(rawName, argv[index + 1]);
      index += 1;
    } else {
      flags.add(rawName);
    }
  }
  return { values, flags };
}

export function positiveInteger(value, fallback, name) {
  if (value === undefined) return fallback;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0) throw new Error(`${name} must be a non-negative integer`);
  return parsed;
}

export function loadDatabaseEnvironment() {
  const envPath = resolve(serverRoot, ".env");
  if (existsSync(envPath)) process.loadEnvFile(envPath);
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required (set it in server/.env or the process environment)");
  const url = new URL(process.env.DATABASE_URL);
  if (url.protocol !== "postgresql:" && url.protocol !== "postgres:") {
    throw new Error("DATABASE_URL must use the postgresql:// protocol");
  }
  const database = decodeURIComponent(url.pathname.slice(1));
  if (!database) throw new Error("DATABASE_URL must include a database name");
  return {
    host: url.hostname,
    port: url.port || "5432",
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database,
    sslMode: process.env.DATABASE_SSL === "true" ? "require" : url.searchParams.get("sslmode") || undefined,
  };
}

export function timestamp(date = new Date()) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

export async function sha256(path) {
  const hash = createHash("sha256");
  for await (const chunk of createReadStream(path)) hash.update(chunk);
  return hash.digest("hex");
}

function localConnectionArguments(config) {
  return [
    "--host", config.host,
    "--port", config.port,
    "--username", config.user,
    "--dbname", config.database,
  ];
}

function toolInvocation(tool, toolArguments, options) {
  if (options.docker) {
    return {
      command: "docker",
      arguments: [
        "compose", "exec", "-T", options.dockerService, tool,
        ...toolArguments,
        ...(options.connect ? ["--username", options.config.user, "--dbname", options.config.database] : []),
      ],
      environment: process.env,
    };
  }
  const environment = { ...process.env, PGPASSWORD: options.config.password };
  if (options.config.sslMode) environment.PGSSLMODE = options.config.sslMode;
  return {
    command: tool,
    arguments: [...toolArguments, ...(options.connect ? localConnectionArguments(options.config) : [])],
    environment,
  };
}

export async function runPostgresTool(tool, toolArguments, options = {}) {
  const config = options.config ?? loadDatabaseEnvironment();
  const invocation = toolInvocation(tool, toolArguments, {
    config,
    docker: options.docker ?? false,
    dockerService: options.dockerService ?? "postgres",
    connect: options.connect ?? true,
  });
  await mkdir(dirname(options.outputPath ?? resolve(serverRoot, ".keep")), { recursive: true });

  return new Promise((resolvePromise, reject) => {
    const child = spawn(invocation.command, invocation.arguments, {
      cwd: serverRoot,
      env: invocation.environment,
      stdio: [options.inputPath ? "pipe" : "ignore", options.outputPath ? "pipe" : "pipe", "pipe"],
      windowsHide: true,
    });
    let stdout = "";
    let stderr = "";
    let output;
    let outputFinished = Promise.resolve();
    if (options.inputPath && child.stdin) createReadStream(options.inputPath).pipe(child.stdin);
    if (options.outputPath && child.stdout) {
      output = createWriteStream(options.outputPath, { flags: "wx" });
      outputFinished = new Promise((resolveOutput, rejectOutput) => {
        output.on("finish", resolveOutput);
        output.on("error", rejectOutput);
      });
      child.stdout.pipe(output);
    } else {
      child.stdout?.setEncoding("utf8");
      child.stdout?.on("data", (chunk) => { stdout += chunk; });
    }
    child.stderr.setEncoding("utf8");
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("error", reject);
    child.on("close", async (code) => {
      if (code !== 0) {
        reject(new Error(`${tool} failed with exit code ${code}${stderr.trim() ? `: ${stderr.trim()}` : ""}`));
        return;
      }
      try {
        await outputFinished;
        resolvePromise({ stdout, stderr });
      } catch (error) {
        reject(error);
      }
    });
  });
}

export async function writeChecksumSidecar(path) {
  const details = await stat(path);
  const checksum = await sha256(path);
  const sidecar = `${path}.sha256`;
  await writeFile(sidecar, `${checksum}  ${path.split(/[\\/]/).at(-1)}\n`, { flag: "wx" });
  return { checksum, bytes: details.size, sidecar };
}

export async function verifyChecksumSidecar(path) {
  const sidecar = `${path}.sha256`;
  if (!existsSync(sidecar)) return { present: false, valid: null, checksum: await sha256(path) };
  const expected = (await readFile(sidecar, "utf8")).trim().split(/\s+/)[0];
  const actual = await sha256(path);
  return { present: true, valid: expected === actual, checksum: actual };
}

export async function finalizeAtomicBackup(partialPath, finalPath) {
  await rename(partialPath, finalPath);
  return writeChecksumSidecar(finalPath);
}

export async function removePartial(path) {
  await rm(path, { force: true }).catch(() => undefined);
}
