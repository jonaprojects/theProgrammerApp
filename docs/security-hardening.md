# Security hardening

The API treats PostgreSQL as the source of truth and assumes that all mobile and
web clients are untrusted. The controls below are enforced by the server rather
than relying on UI behavior.

## Enforced controls

- Bearer tokens are generated from 256 bits of randomness. Only SHA-256 token
  hashes are stored in PostgreSQL.
- Passwords are stored with salted scrypt hashes, and invalid users still run a
  dummy password verification to reduce account-enumeration timing differences.
- Sessions have a 30-day absolute lifetime, a 14-day idle lifetime, and a limit
  of five active sessions per user. Old and expired sessions are revoked when a
  new session is issued.
- Authentication endpoints are limited by both source IP and a SHA-256 digest
  of the normalized email. General API traffic has a separate per-IP limit.
- Rate-limit storage is bounded to prevent unbounded process memory growth.
- Proxy forwarding headers are ignored unless `TRUST_PROXY=true` is explicitly
  configured for a deployment behind a trusted reverse proxy.
- Request bodies default to 64 KiB and database/API operations have timeouts.
- Authenticated and authentication responses use `Cache-Control: no-store`.
- Responses include content-type sniffing, framing, referrer, permissions, and
  restrictive API content-security headers. Production responses include HSTS.
- Production startup rejects wildcard CORS and non-HTTPS browser origins.
- API validation failures and malformed/oversized requests use stable error
  envelopes without returning internal exception details.

## Production configuration

Keep `TRUST_PROXY=false` when the Node process is directly exposed. Enable it
only when traffic can reach Node exclusively through a trusted load balancer or
reverse proxy that overwrites forwarding headers.

Use explicit HTTPS origins:

```dotenv
NODE_ENV=production
CORS_ORIGIN=https://app.example.com
TRUST_PROXY=true
DATABASE_SSL=true
BODY_LIMIT_BYTES=65536
API_RATE_LIMIT_MAX=300
API_RATE_LIMIT_WINDOW_SECONDS=60
AUTH_RATE_LIMIT_MAX=10
AUTH_RATE_LIMIT_WINDOW_SECONDS=900
```

The built-in limiter is process-local. Before horizontally scaling the API,
replace it with a shared Redis-backed limiter at the load balancer or API layer.
Keep an edge-level request limit as an additional defense against traffic that
would otherwise consume Node connections.

## Remaining deployment responsibilities

- Store `DATABASE_URL` in a secret manager and use a restricted database role.
- Terminate TLS at a trusted reverse proxy and restrict direct access to Node and
  PostgreSQL with firewall or private-network rules.
- Rotate database credentials, patch dependencies, and test backup restoration.
- Add centralized audit/security logs and alerts without recording passwords,
  bearer tokens, or full authorization headers.
- Web sessions currently use browser storage because the app shares a bearer-token
  API with native clients. A future web-only backend-for-frontend should move the
  browser session to `Secure`, `HttpOnly`, `SameSite` cookies.

## Automated dependency review

`.github/workflows/security.yml` audits production dependencies for high and
critical advisories on pull requests, every push to `main`, and weekly. A finding
fails the release gate rather than silently shipping. Dependabot is configured
for both the Expo app and API and groups weekly updates so upgrades can be tested
and reviewed without uncontrolled version drift.

## References

- [OWASP REST Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html)
- [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
