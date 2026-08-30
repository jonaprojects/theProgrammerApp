import assert from "node:assert/strict";
import { mkdir, stat, utimes, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import { describe, it } from "node:test";
import { mkdtemp } from "node:fs/promises";
import { parseArguments, positiveInteger, timestamp, verifyChecksumSidecar, writeChecksumSidecar } from "./db-tools.mjs";
import { pruneBackups, restoreBackup, verifyBackup } from "./db-operations.mjs";

describe("database backup tools", () => {
  it("parses flags, values, and stable UTC timestamps", () => {
    const parsed = parseArguments(["--docker", "--retention-days=30", "--output-dir", "safe"]);
    assert.equal(parsed.flags.has("docker"), true);
    assert.equal(parsed.values.get("retention-days"), "30");
    assert.equal(parsed.values.get("output-dir"), "safe");
    assert.equal(positiveInteger("30", 14, "retention-days"), 30);
    assert.equal(timestamp(new Date("2026-08-30T10:11:12.345Z")), "20260830T101112Z");
  });

  it("writes and validates a checksum sidecar", async () => {
    const directory = await mkdtemp(resolve(tmpdir(), "programmer-backup-test-"));
    const backup = resolve(directory, "sample.dump");
    await writeFile(backup, "backup bytes");
    const written = await writeChecksumSidecar(backup);
    assert.equal(written.checksum.length, 64);
    assert.deepEqual(await verifyChecksumSidecar(backup), {
      present: true,
      valid: true,
      checksum: written.checksum,
    });
    await writeFile(backup, "changed bytes");
    assert.equal((await verifyChecksumSidecar(backup)).valid, false);
  });

  it("keeps the newest minimum and removes only expired matching backups", async () => {
    const directory = await mkdtemp(resolve(tmpdir(), "programmer-retention-test-"));
    await mkdir(directory, { recursive: true });
    const now = new Date("2026-08-30T12:00:00Z");
    const names = [
      "the-programmer-20260830T100000Z.dump",
      "the-programmer-20260829T100000Z.dump",
      "the-programmer-20260701T100000Z.dump",
      "notes.dump",
    ];
    for (const [index, name] of names.entries()) {
      const path = resolve(directory, name);
      await writeFile(path, name);
      const modified = new Date(now.getTime() - index * 20 * 86_400_000);
      await utimes(path, modified, modified);
      if (name.startsWith("the-programmer-")) await writeFile(`${path}.sha256`, "hash");
    }
    const removed = await pruneBackups(directory, 14, 2, now.getTime());
    assert.equal(removed.length, 1);
    await assert.rejects(stat(removed[0]));
    await stat(resolve(directory, names[0]));
    await stat(resolve(directory, names[1]));
    await stat(resolve(directory, "notes.dump"));
  });

  it("refuses an unconfirmed restore before invoking PostgreSQL", async () => {
    await assert.rejects(
      restoreBackup("missing.dump", {
        config: { host: "localhost", port: "5432", user: "postgres", password: "", database: "the_programmer" },
        confirmDatabase: "wrong_database",
      }),
      /Restore refused/,
    );
    await assert.rejects(verifyBackup("missing.dump"), /Backup does not exist/);
  });
});
