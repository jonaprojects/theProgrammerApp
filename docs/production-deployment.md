# Production deployment pipeline

The production pipeline is defined in
[`../.github/workflows/production.yml`](../.github/workflows/production.yml).
Pull requests must pass both TypeScript builds, all app/API tests,
content validation, a clean PostgreSQL migration/import, API readiness, and both
Docker builds. A successful `main` build publishes commit-addressed API and web
images to GitHub Container Registry (GHCR). When deployment is enabled, the same
commit must deploy successfully to staging and pass a bounded authenticated
release journey before the protected production job can begin. Deployment is
deliberately disabled until both environments are configured.

## Release architecture

- `Dockerfile.web` exports the authenticated Expo Router app as a single-page
  web build with the production API URL embedded at build time and serves it
  through nginx on port 8080. nginx falls back to `index.html` for deep links.
- `server/Dockerfile` runs the compiled Node 22 API as a non-root user on port
  3000 and includes the catalog sources needed for idempotent content imports.
- `deploy/deploy.sh` pulls only the commit SHA being released, runs transactional
  migrations under the existing PostgreSQL advisory lock, imports content, then
  replaces the containers and checks readiness.
- If application health fails, the script restores the prior application image
  tag. Database migrations remain applied, so every schema change must be
  backward-compatible with the previous application release.
- A TLS reverse proxy or load balancer should route the public web origin to
  `127.0.0.1:8080` and the API origin to `127.0.0.1:3000`. These ports are not
  exposed publicly by the production Compose file.

## One-time GitHub setup

Add these repository variables (they are needed while building the images):

| Variable | Example |
| --- | --- |
| `PRODUCTION_DEPLOY_ENABLED` | `true` after the host is ready |
| `PRODUCTION_API_URL` | `https://api.example.com/api/v1` |
| `PRODUCTION_WEB_URL` | `https://learn.example.com` |
| `PRODUCTION_DEPLOY_PATH` | `/opt/the-programmer` |
| `PRODUCTION_SSH_PORT` | `22` |
| `STAGING_DEPLOY_ENABLED` | `true` after staging is ready |
| `STAGING_API_URL` | `https://api-staging.example.com/api/v1` |
| `STAGING_WEB_URL` | `https://staging.example.com` |
| `STAGING_DEPLOY_PATH` | `/opt/the-programmer-staging` |
| `STAGING_SSH_PORT` | `22` |

Create a GitHub environment named `production` and, ideally, protect it with a
required reviewer. Add these environment secrets:

| Secret | Purpose |
| --- | --- |
| `PRODUCTION_SSH_HOST` | Deployment host name or IP |
| `PRODUCTION_SSH_USER` | Restricted deployment account |
| `PRODUCTION_SSH_PRIVATE_KEY` | Private key for that account |
| `PRODUCTION_SSH_KNOWN_HOSTS` | Pre-verified host-key line; do not generate it during deployment |
| `GHCR_USERNAME` | GitHub account allowed to read the images |
| `GHCR_PULL_TOKEN` | Fine-grained/classic token with read-only package access |

Create a `staging` environment with the equivalent `STAGING_SSH_*` secrets and
the same GHCR credentials. Add `STAGING_SMOKE_EMAIL` and
`STAGING_SMOKE_PASSWORD` for a dedicated non-administrator learner account.
Create that account once through the staging registration screen; never reuse a
real learner or operator account.

After entering the variables and environment secrets, manually run the
`Release configuration readiness` workflow. It performs only structural checks
on the GitHub runner: it does not connect to either host or database, call an
endpoint, start a container, or deploy anything. Its staging, production,
backup, and recovery jobs must pass before enabling a release.

Restrict the SSH account to the deployment directory and Docker operations. Do
not reuse a personal administrator key.

## One-time host setup

1. Install Docker Engine, the Compose plugin, `curl`, and a TLS reverse proxy.
2. Create the deployment directory and make it writable by the deployment user.
3. Copy `deploy/.env.production.example` to `.env.production` in that directory
   and replace every placeholder, including monitoring credentials and HTTPS
   receiver URLs. The real file must never enter Git.
4. Configure a managed PostgreSQL instance with automated backups and a dedicated
   application role. Take or verify a recoverable snapshot before migrations that
   alter or remove existing data.
5. Keep `PRODUCTION_DEPLOY_ENABLED` unset while validating the first image
   publication. Configure and enable staging first. Set production to `true`
   only when both hosts and DNS/TLS routes are ready.

## Release and rollback

Merging to `main` runs the entire pipeline. Staging receives a separately built
web image whose API URL points to staging. The release journey performs at most
16 sequential API requests and covers login, profile restoration, course
enrollment, lesson progress, a tutorial exercise, a question attempt, progress
readback, logout, and session revocation. It is intentionally not a load test.

Production depends on the successful staging deployment and release journey.
The production concurrency lock prevents overlapping deployments, while the
environment can require approval. Public readiness checks must succeed before
GitHub records a successful release.

To redeploy a known version manually on the host:

```bash
cd /opt/the-programmer
./deploy.sh <commit-sha> ghcr.io/<owner>/<repository>-api ghcr.io/<owner>/<repository>-web
```

To roll back application code, use the same command with the previous commit
SHA. Never roll back PostgreSQL by deleting migration records; restore a verified
database backup when a data migration itself must be reversed.
