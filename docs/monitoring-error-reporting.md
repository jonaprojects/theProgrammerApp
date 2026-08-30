# Monitoring and error reporting

The API emits structured JSON logs, Prometheus-compatible metrics, separate
liveness/readiness checks, and correlated error events. Telemetry never includes
request bodies, query values, passwords, bearer tokens, cookies, or profile data.

## Health endpoints

- `GET /health/live` confirms that the Node process can answer requests. It does
  not query PostgreSQL and is appropriate for a container liveness probe.
- `GET /health/ready` checks PostgreSQL and returns `503` while unavailable. Use
  it for load-balancer and container readiness probes.
- `GET /health` remains an alias for readiness for compatibility.

## Prometheus metrics

Generate a random monitoring token of at least 32 characters and configure it:

```dotenv
METRICS_TOKEN=replace-with-a-random-secret-of-at-least-32-characters
```

The endpoint is not registered when this value is absent. Scrape it with the
dedicated bearer token rather than an application user's session token:

```bash
curl -H "Authorization: Bearer $METRICS_TOKEN" \
  http://localhost:3000/internal/metrics
```

The response uses Prometheus text format and includes:

- completed requests by method, route template, and status;
- a cumulative request-duration histogram;
- active requests and unhandled errors;
- process uptime and resident memory.

Routes use templates such as `/api/v1/courses/:slug`, never raw URLs or user IDs,
to keep label cardinality bounded. Keep `/internal/metrics` on a private network
even though it requires authentication.

Suggested initial alerts:

- readiness fails for two consecutive minutes;
- five-minute `5xx` ratio exceeds 2%;
- p95 latency exceeds one second for ten minutes;
- unhandled-error counter increases;
- process restarts repeatedly or resident memory grows continuously.

## Structured logs and correlation

Every request receives a random request ID. The API returns it in `X-Request-ID`
and error envelopes, and includes it in the completion log with the method, route
template, status, and duration. Unexpected failures also receive an `errorId`.
Support can use these IDs to correlate a user-visible failure with logs without
asking the learner for sensitive request data.

## External error reporting

Set an HTTPS receiver to enable sanitized JSON error delivery:

```dotenv
APP_VERSION=2026.08.30
ERROR_REPORTING_URL=https://errors.example.com/api/events
ERROR_REPORTING_TOKEN=replace-with-a-secret-receiver-token
```

The event includes its ID, timestamp, release, environment, error name/message/
stack, request ID, route template, method, and optional internal user UUID. It
does not include raw URLs, headers, bodies, email addresses, passwords, or session
tokens. Delivery has a three-second timeout, bounded concurrency, and cannot fail
the original request. Pending reports are flushed during graceful shutdown.

The Expo app is wrapped in a React error boundary. A rendering failure shows a
recoverable Hebrew error screen with a reference ID and submits a strictly
validated, separately rate-limited report through `POST /api/v1/client-errors`.
This endpoint works before login so authentication-screen failures remain
observable. The client report contains only the error and React component stack,
platform, app version, and an event ID; it never includes form values or storage.

This endpoint can be a small adapter for Sentry, Better Stack, Datadog, or another
incident pipeline. If adopting a vendor SDK later, preserve the same data-minimal
event policy and correlate its event identifier with the API response.

## Prometheus references

- [Prometheus exposition format](https://prometheus.io/docs/instrumenting/exposition_formats/)
- [Prometheus metric types](https://prometheus.io/docs/concepts/metric_types/)
