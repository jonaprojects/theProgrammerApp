# The Programmer API

The backend is a standalone TypeScript service. PostgreSQL is the system of record; the Expo application communicates through the versioned HTTP API and an authenticated multiplayer WebSocket under `/api/v1`.

## Structure

```text
server/
├── migrations/                 Ordered, immutable PostgreSQL migrations
├── src/
│   ├── auth/                   Password hashing and bearer-session authentication
│   ├── config/                 Validated environment configuration
│   ├── db/                     Pool, transactions, and migration runner
│   ├── modules/
│   │   ├── auth/               Registration, sign-in, and sign-out
│   │   ├── attempts/           Transactional answer submission and scoring
│   │   ├── courses/            Published course and lesson catalog
│   │   ├── health/             Service/database health
│   │   ├── multiplayer/        Two-player rooms, timed rounds, scoring, and rewards
│   │   ├── notifications/      Push preferences, devices, delivery, and receipts
│   │   ├── profiles/           Authenticated user profiles
│   │   ├── progress/           Enrollments and user progress
│   │   ├── questions/          Topics and safe question delivery
│   │   └── tutorial-exercises/ Server-validated lesson exercises and rewards
│   ├── shared/                 Cross-module errors and types
│   ├── app.ts                  HTTP composition root
│   └── server.ts               Process lifecycle
├── .env.example
├── docker-compose.yml
└── package.json
```

Repositories own SQL, services own business rules and transactions, and routes own HTTP parsing. Route code does not calculate scores or mutate progress directly.

## Local setup

1. Copy `.env.example` to `.env` and adjust it if necessary.
2. Install dependencies with `npm install`.
3. Start PostgreSQL with `docker compose up -d`.
4. Apply the schema with `npm run db:migrate`.
5. Validate legacy content with `npm run content:validate`.
6. Import it with `npm run content:import`.
7. Start the API with `npm run dev`.

## Database backups and recovery

Backups use PostgreSQL's custom archive format, are written atomically, and receive
a SHA-256 sidecar. Every newly created archive is immediately inspected with
`pg_restore --list`. The default retention policy keeps at least seven backups and
removes backups older than 14 days only after that minimum has been satisfied.

When PostgreSQL client tools are installed locally:

```powershell
npm run db:backup
npm run db:verify -- --file backups/the-programmer-YYYYMMDDTHHMMSSZ.dump
```

For the PostgreSQL service in this repository's Docker Compose file:

```powershell
npm run db:backup -- --docker
npm run db:verify -- --file backups/the-programmer-YYYYMMDDTHHMMSSZ.dump --docker
```

A restore is deliberately guarded by the target database name and creates another
backup in `backups/pre-restore/` before replacing database objects:

```powershell
npm run db:restore -- --file backups/the-programmer-YYYYMMDDTHHMMSSZ.dump --confirm-database the_programmer
```

Add `--docker` for the included container. Restore only during a maintenance window
with API traffic stopped. The detailed runbook, retention guidance, restore drill,
and production recommendations are in `../docs/database-backup-recovery.md`.

The API listens on port 3000 by default. `GET /health` checks both the process and its database connection.

## Legacy content import

The importer reads the existing question `.ts` files and Python tutorial `.tsx` files without executing application code. It uses the TypeScript syntax tree to accept only static content shapes, then validates and normalizes them before opening a database transaction.

`npm run content:validate` performs a database-free dry run. `npm run content:import` upserts topics, questions, options, the Python course, populated lessons, and their interactive exercise answer keys. Stable source keys make repeat runs idempotent. Existing answer options are retained for historical attempts but made inactive when they disappear from source content.

The normalization manifest is in `src/content-import/manifest.ts`. Empty tutorial placeholder files are reported as skipped. Repairable defects, such as duplicated legacy IDs, are preserved under deterministic keys and reported as normalizations. Malformed questions or unsupported tutorial components are reported as rejections. An import that has rejections still imports valid records but exits with code 2 so CI or a release process can flag the content problem.

Curated catalog additions live in `../data/questions/catalogExpansion.ts` and `../data/questions/catalogExpansionAdvanced.ts`. These supplemental sources extend the original categories and define the cybersecurity, databases, Git, and algorithms categories without rewriting the historical question files. Automated importer tests enforce a minimum of 50 valid questions in every category.

## API surface

| Method | Path | Authentication | Purpose |
|---|---|---:|---|
| `GET` | `/health/live` | No | Process liveness without downstream checks |
| `GET` | `/health/ready` | No | Readiness including PostgreSQL connectivity |
| `GET` | `/health` | No | Backward-compatible readiness check |
| `GET` | `/internal/metrics` | Monitoring token | Prometheus metrics; enabled only when configured |
| `POST` | `/api/v1/client-errors` | Rate limited | Submit a sanitized app rendering failure |
| `GET` | `/api/v1/courses` | No | Published course catalog |
| `GET` | `/api/v1/courses/:slug` | No | Course with published lessons |
| `GET` | `/api/v1/topics` | No | Exercise topics |
| `GET` | `/api/v1/topics/:slug/questions` | No | Questions without correct-answer fields |
| `POST` | `/api/v1/auth/register` | No | Create an email/password account and session |
| `POST` | `/api/v1/auth/login` | No | Start a new session |
| `POST` | `/api/v1/auth/logout` | Yes | Revoke the current session |
| `POST` | `/api/v1/attempts` | Yes | Submit and score an answer idempotently |
| `GET` | `/api/v1/me/progress` | Yes | User, enrollment, and topic progress |
| `GET` | `/api/v1/me/profile` | Yes | Read the current profile |
| `PATCH` | `/api/v1/me/profile` | Yes | Update display name or biography |
| `GET` | `/api/v1/me/notifications/preferences` | Yes | Read Push notification preferences |
| `PATCH` | `/api/v1/me/notifications/preferences` | Yes | Update Push notification preferences |
| `POST` | `/api/v1/me/notifications/devices` | Yes | Register or refresh an Expo Push token |
| `POST` | `/api/v1/me/notifications/devices/deactivate` | Yes | Disable a device token |
| `POST` | `/api/v1/me/enrollments` | Yes | Enroll in a published course |
| `PUT` | `/api/v1/me/courses/:courseSlug/lessons/:lessonSlug/progress` | Yes | Persist lesson access or completion |
| `POST` | `/api/v1/me/tutorial-exercises/:exerciseId/submissions` | Yes | Check or reveal a tutorial answer and persist its result |
| `GET` | `/api/v1/multiplayer/me/current` | Yes | Resume the current waiting or active match |
| `POST` | `/api/v1/multiplayer/matches` | Yes | Create a private room |
| `POST` | `/api/v1/multiplayer/matchmaking` | Yes | Join or create a compatible public queue |
| `POST` | `/api/v1/multiplayer/join` | Yes | Join a private room by code |
| `GET` | `/api/v1/multiplayer/matches/:matchId` | Yes | Read and synchronize match state |
| `POST` | `/api/v1/multiplayer/matches/:matchId/start` | Yes | Start a full private room as its host |
| `POST` | `/api/v1/multiplayer/matches/:matchId/answers` | Yes | Lock an answer idempotently for the current round |
| `POST` | `/api/v1/multiplayer/matches/:matchId/leave` | Yes | Leave a waiting room or forfeit an active match |
| `WS` | `/api/v1/multiplayer/matches/:matchId/socket` | First-frame session auth | Receive authoritative match and round state in real time |
| `GET` | `/api/v1/leaderboards?period=weekly\|all_time` | Yes | Read ranked point totals and the current user's rank |
| `GET` | `/api/v1/me/achievements` | Yes | Synchronize and read achievement progress |

Register or sign in, then send the returned opaque token as
`Authorization: Bearer <token>`. Passwords are hashed with scrypt and unique salts.
Only SHA-256 hashes of the random session tokens are stored in PostgreSQL; sessions
expire after 30 days and logout revokes the current session immediately. Set
`AUTH_MODE=external` and inject another `Authenticate` implementation if a managed
identity provider is introduced later.

Tutorial-exercise submissions accept an idempotency key, an action (`check` or
`reveal`), and the learner's answer for checks. The API validates answers against
the imported key rather than trusting correctness reported by the client. The
first correct answer earns five points and completes the corresponding lesson;
later correct answers cannot farm points. Revealing a solution is persisted and
disqualifies that exercise from awarding points.

Example attempt body:

```json
{
  "questionId": "3be7dcc6-d96d-4fbf-89e6-1515755ae3a6",
  "selectedOptionId": "40430378-4a19-44b6-a055-e30980de5f41",
  "idempotencyKey": "31eef300-e631-48e8-bc42-82c1f814aa50",
  "timeSpentSeconds": 14
}
```

The server derives correctness from PostgreSQL. Correct-answer flags are never included in question-delivery responses. Only published questions with at least two active options and exactly one active correct option are delivered. A user receives points only for their first correct attempt at a question. The attempt stores a snapshot of the explanation and correct option, so an exact idempotent replay returns the original feedback even if catalog content changes later. Reusing the key for another question or selection returns `409 IDEMPOTENCY_KEY_REUSED` without changing progress.

Multiplayer matches contain exactly two active players. Private rooms start when
the host chooses to begin; public rooms start automatically when matchmaking
finds a compatible opponent. The server chooses the published questions, owns
the round clock, validates option membership and correctness, and reveals the
answer only after both players answer or time expires. Correct answers earn
1,000 base points plus a bounded speed bonus. The final winner receives 20 XP,
the other player receives 5 XP, and an exact draw awards 15 XP to each player.
Rewards are applied once even when clients reconnect or poll a finished match.

One user cannot enter two live matches: matchmaking operations are serialized
per user, and an overlapping request returns `409 ACTIVE_MATCH_EXISTS`.
Clients synchronize through an authenticated WebSocket. The session token is sent
in the first frame (`{"type":"authenticate","token":"…"}`), never in the URL;
the server then pushes player-specific `match.state` frames. Round deadlines are
scheduled on the server, sockets are heartbeat-checked, and clients reconnect with
bounded exponential backoff. HTTP state reads remain as a five-second fallback
during a socket outage, and reopening the app restores the authoritative room,
round, scores, and results without exposing answer keys early. Run `npm run test:multiplayer-smoke` while the API is running
to verify private rooms, quick matching, reconnection, concurrent creation,
timeouts, all rounds, scoring, forfeits, results, and idempotent rewards.

New submissions return `201` with `replayed: false`; exact retries return `200`
with `replayed: true`. The database additionally enforces that both the selected
and correct option belong to the attempt's question and permits at most one
active correct option per question.

`GET /api/v1/me/progress` is the authoritative learning dashboard contract. It
returns aggregate lesson, question, accuracy, activity-day, and current-streak
statistics; every enrolled course with exact lesson states and a deterministic
resume lesson; and every exercise topic with completion, accuracy, mastery, and
practice status. Completing every published lesson atomically marks the course
enrollment complete. A completed lesson never regresses when it is opened again.
The same response includes all tutorial exercise states for the current user so
the app can restore attempts and completion on another device.

Leaderboards are calculated from authoritative point awards. The weekly view
includes question attempts, tutorial exercises, and completed multiplayer
rewards since the start of the current week; the all-time view uses each user's
stored point total. Achievement reads synchronize permanent unlock records from
the same learning data. Repeated reads are idempotent and do not award points.

Push device registrations are tied to the authenticated session and are disabled
on logout. Multiplayer events are delivered asynchronously through Expo Push, so
an unavailable notification provider never blocks the match. The server stores
Expo ticket IDs, checks receipts after the recommended delay, and disables tokens
reported as `DeviceNotRegistered`. Set `EXPO_ACCESS_TOKEN` only when access-token
security is enabled for the Expo project; never expose it through an
`EXPO_PUBLIC_` variable.

## Production notes

- Review the enforced controls and deployment checklist in
  [`docs/security-hardening.md`](../docs/security-hardening.md).
- Configure dashboards and alerts using
  [`docs/monitoring-error-reporting.md`](../docs/monitoring-error-reporting.md).
- Run migrations as a release step before starting the new server version.
- Use a managed PostgreSQL instance and set `DATABASE_SSL=true` when its certificate chain is trusted by the runtime.
- Keep `AUTH_MODE=session` for built-in email/password accounts, or set
  `AUTH_MODE=external` and inject a token-verifying authentication adapter.
- Set `CORS_ORIGIN` to the exact web application origin or a comma-separated allowlist. Native applications are not governed by browser CORS.
- Course and question authoring/import is intentionally separate from the public runtime API. The existing static app content should be imported after its inconsistent identifiers have been normalized.
