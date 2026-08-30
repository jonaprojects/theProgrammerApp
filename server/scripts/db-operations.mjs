import { existsSync } from "node:fs";
import { readdir, rm, stat } from "node:fs/promises";
import { basename, resolve } from "node:path";
import {
  finalizeAtomicBackup,
  loadDatabaseEnvironment,
  removePartial,
  runPostgresTool,
  serverRoot,
  timestamp,
  verifyChecksumSidecar,
} from "./db-tools.mjs";

export async function verifyBackup(path, options = {}) {
  const absolutePath = resolve(path);
  if (!existsSync(absolutePath)) throw new Error(`Backup does not exist: ${absolutePath}`);
  const checksum = await verifyChecksumSidecar(absolutePath);
  if (checksum.valid === false) throw new Error(`Checksum mismatch for ${basename(absolutePath)}`);
  const result = await runPostgresTool("pg_restore", ["--list", ...(options.docker ? [] : [absolutePath])], {
    ...options,
    connect: false,
    inputPath: options.docker ? absolutePath : undefined,
  });
  const entries = result.stdout.split(/\r?\n/).filter((line) => line && !line.startsWith(";")).length;
  if (!options.docker && entries === 0) throw new Error("pg_restore found no archive entries");
  return { path: absolutePath, checksum, entries };
}

export async function pruneBackups(directory, retentionDays, retentionCount, now = Date.now()) {
  const files = (await readdir(directory, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && /^the-programmer-\d{8}T\d{6}Z\.dump$/.test(entry.name))
    .map((entry) => resolve(directory, entry.name));
  const details = await Promise.all(files.map(async (path) => ({ path, modified: (await stat(path)).mtimeMs })));
  details.sort((left, right) => right.modified - left.modified);
  const cutoff = now - retentionDays * 86_400_000;
  const removed = [];
  for (const [index, backup] of details.entries()) {
    if (index < retentionCount || backup.modified >= cutoff) continue;
    await rm(backup.path, { force: true });
    await rm(`${backup.path}.sha256`, { force: true });
    removed.push(backup.path);
  }
  return removed;
}

export async function createBackup(options = {}) {
  const config = options.config ?? loadDatabaseEnvironment();
  const directory = resolve(options.outputDirectory ?? resolve(serverRoot, "backups"));
  const finalPath = resolve(directory, `the-programmer-${timestamp(options.now)}.dump`);
  const partialPath = `${finalPath}.partial`;
  await removePartial(partialPath);
  try {
    await runPostgresTool("pg_dump", [
      "--format=custom",
      "--compress=6",
      "--no-owner",
      "--no-privileges",
    ], { ...options, config, outputPath: partialPath });
    const integrity = await finalizeAtomicBackup(partialPath, finalPath);
    await verifyBackup(finalPath, { ...options, config });
    const removed = await pruneBackups(
      directory,
      options.retentionDays ?? 14,
      options.retentionCount ?? 7,
    );
    return { path: finalPath, ...integrity, removed };
  } catch (error) {
    await removePartial(partialPath);
    throw error;
  }
}

export async function restoreBackup(path, options = {}) {
  const config = options.config ?? loadDatabaseEnvironment();
  if (options.confirmDatabase !== config.database) {
    throw new Error(`Restore refused. Pass --confirm-database=${config.database} to acknowledge that this database will be replaced.`);
  }
  const verified = await verifyBackup(path, { ...options, config });
  const safety = options.skipSafetyBackup
    ? null
    : await createBackup({
        ...options,
        config,
        outputDirectory: options.safetyBackupDirectory ?? resolve(serverRoot, "backups", "pre-restore"),
        retentionDays: 90,
        retentionCount: 10,
      });
  await runPostgresTool("pg_restore", [
    "--clean",
    "--if-exists",
    "--no-owner",
    "--no-privileges",
    "--exit-on-error",
    ...(options.docker ? [] : [verified.path]),
  ], { ...options, config, inputPath: options.docker ? verified.path : undefined });
  return { restored: verified.path, safetyBackup: safety?.path ?? null };
}
