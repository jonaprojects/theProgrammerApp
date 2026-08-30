# Database backup and recovery runbook

PostgreSQL is the system of record. Source-controlled migrations and course content
can rebuild the catalog, but accounts, progress, attempts, multiplayer history, and
points exist only in the database and must be backed up.

## Recovery targets

- Production target: an RPO of 24 hours or less and an RTO of four hours or less.
- Use a managed PostgreSQL provider with continuous backups and point-in-time
  recovery for production. The scripts in this repository provide a portable daily
  logical backup and restore drill; they are not a substitute for provider-level WAL
  archiving.
- Keep at least 14 daily backups and four monthly backups off the database host.
  Encrypt the storage, restrict access to operators, and enable immutable or
  versioned retention where the provider supports it.

## Creating a backup

The command reads `DATABASE_URL` and `DATABASE_SSL` from `server/.env` or the process
environment. Credentials are passed through PostgreSQL environment variables and
are not written into the archive name or command output.

From `server/`, with PostgreSQL client tools installed:

```powershell
npm run db:backup
```

With the included Docker Compose PostgreSQL service:

```powershell
npm run db:backup -- --docker
```

Useful options:

```text
--output-dir <path>       Destination; default: server/backups
--retention-days <days>   Age threshold; default: 14
--retention-count <count> Minimum number always retained; default: 7
--docker-service <name>   Compose service; default: postgres
```

The script writes to `.partial`, renames only after `pg_dump` succeeds, creates a
`.sha256` sidecar, and verifies that `pg_restore` can read the archive. Copy both the
`.dump` file and its sidecar to off-site storage. A backup remaining only on the same
host is not sufficient disaster protection.

## Verifying a stored backup

```powershell
npm run db:verify -- --file backups/the-programmer-20260830T120000Z.dump
```

Use `--docker` when PostgreSQL tools are available only in the Compose container.
Verification checks the SHA-256 sidecar when present and reads the archive table of
contents. A missing sidecar is reported but does not invalidate an otherwise readable
archive; production copies should always include it.

## Restore drill

Run a restore drill at least quarterly and after major PostgreSQL upgrades.

1. Create an empty, isolated database with the same PostgreSQL major version.
2. Set `DATABASE_URL` to that drill database. Never point a drill at production.
3. Verify the selected archive.
4. Restore using the drill database name as confirmation.
5. Start the API against the drill database and check `/health`.
6. Sign in with a designated test account and inspect course progress, attempts, and
   multiplayer history.
7. Record archive date, restore duration, validation result, and operator.
8. Destroy the isolated drill database after the evidence has been retained.

## Disaster recovery

1. Stop API processes or enable maintenance mode so writes cannot race the restore.
2. Identify the incident time and choose the latest clean recovery point.
3. Prefer the managed provider's point-in-time recovery into a new database instance.
4. If using a logical archive, verify it before continuing.
5. Confirm that enough disk space exists for both the safety backup and restore.
6. Restore with the exact target database name:

   ```powershell
   npm run db:restore -- --file <archive.dump> --confirm-database <database_name>
   ```

   Add `--docker` for the repository's Compose service.

7. The command first creates a safety archive under `backups/pre-restore/`, then runs
   `pg_restore --clean --if-exists --exit-on-error`. Do not use
   `--skip-safety-backup` unless the existing database cannot be dumped and the
   incident commander has explicitly accepted that loss of rollback capability.
8. Apply any migrations newer than the restored archive with `npm run db:migrate`.
9. Start one API instance and validate health, authentication, user progress, point
   totals, recent attempts, and multiplayer records.
10. Resume traffic, monitor errors and database load, and preserve incident evidence.

## Scheduling

Run the backup command from a scheduler on a host that can reach PostgreSQL, then
upload the `.dump` and `.sha256` files to encrypted off-site storage. Alert when the
command exits non-zero, when no recent archive is present, or when verification
fails. Provider backup alerts and logical-backup alerts should be independent.

Never commit archives or credentials to Git. `server/backups/` is ignored by the
repository, but a production job should normally write directly to a protected mount
or upload the result immediately.

The repository includes `.github/workflows/database-backup.yml`. It runs on a
GitHub-hosted runner each day, uses the PostgreSQL 17 client in an isolated
container, creates a custom archive, verifies that `pg_restore` can read it,
writes a SHA-256 sidecar, and retains the off-host artifact for 14 days. Configure
a `production-backup` GitHub environment containing only the
`BACKUP_DATABASE_URL` secret. Prefer a read-only backup-capable database role
where the provider supports it.

The manual `.github/workflows/recovery-drill.yml` workflow restores a selected
backup artifact only into the database URL stored in the protected
`recovery-drill` environment. It requires the exact confirmation text
`RESTORE STAGING`, verifies the checksum and archive first, and checks core
record counts after restoration. Protect that environment with a required
reviewer and ensure `RECOVERY_DATABASE_URL` can never resolve to production.
The workflow is intentionally never triggered automatically.
