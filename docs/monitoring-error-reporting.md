# Monitoring and error reporting

The selected hosted providers are:

- **Grafana Cloud** for durable Prometheus metrics and the hosted dashboard;
- **Better Stack** for searchable sanitized error events and on-call incidents.

The self-hosted Prometheus, Alertmanager, and Grafana services remain useful as
the private operational control plane. Prometheus forwards a deliberately small,
bounded set of application metrics to Grafana Cloud, while Alertmanager sends
firing and resolved alerts to Better Stack.

The API emits structured JSON logs, Prometheus-compatible metrics, separate
liveness/readiness checks, and correlated error events. Telemetry never includes
request bodies, query values, passwords, bearer tokens, cookies, or profile data.

The production Compose deployment now includes pinned Prometheus, Alertmanager,
and Grafana containers. They bind only to loopback on the deployment host:

- Grafana: `127.0.0.1:3001`
- Prometheus: `127.0.0.1:9090`
- Alertmanager: `127.0.0.1:9093`

Expose Grafana only through the authenticated TLS reverse proxy. Prometheus and
Alertmanager should normally remain private. Configuration-as-code lives under
`deploy/monitoring/`; the API overview dashboard and Prometheus data sources are
provisioned automatically and cannot drift through UI edits.

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
- external error-receiver delivery failures;
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

These rules are implemented in `deploy/monitoring/alerts.yml`. Alertmanager
groups related alerts and sends firing and resolved events to the HTTPS URL in
`ALERT_WEBHOOK_URL`. The URL is written to a private in-container file at startup
and does not appear in the version-controlled Alertmanager configuration.

The provisioned Grafana dashboard shows availability, request rate by HTTP
status, 5xx ratio, p50/p95 latency, active requests, resident memory, unhandled
errors, and receiver-delivery failures. Its default range is six hours and it
refreshes every 30 seconds.

## Grafana Cloud

Create a Grafana Cloud stack and use its Hosted Prometheus details to configure:

```dotenv
GRAFANA_CLOUD_PROMETHEUS_URL=https://prometheus-...grafana.net/api/prom/push
GRAFANA_CLOUD_PROMETHEUS_USERNAME=123456
GRAFANA_CLOUD_PROMETHEUS_TOKEN=replace-with-a-metrics-publisher-access-policy-token
```

The token should have metrics-publish scope only. It is written to a private
in-container file and referenced through Prometheus `password_file`; it is not
rendered into the committed configuration. Remote-write concurrency and buffer
capacity are intentionally bounded.

The `Sync Grafana Cloud dashboard` GitHub workflow publishes the repository's
dashboard with Grafana's dashboard API. Configure the production environment:

- variable `GRAFANA_CLOUD_URL`, such as `https://your-stack.grafana.net`;
- variable `GRAFANA_CLOUD_PROMETHEUS_DATASOURCE_UID`, copied from the hosted
  Prometheus data source settings;
- secret `GRAFANA_CLOUD_SERVICE_ACCOUNT_TOKEN`, using a service account limited
  to dashboard read/write access.

Run the workflow manually after those values exist. It creates or updates the
stable dashboard UID `the-programmer-api` and never prints the token.

## Structured logs and correlation

Every request receives a random request ID. The API returns it in `X-Request-ID`
and error envelopes, and includes it in the completion log with the method, route
template, status, and duration. Unexpected failures also receive an `errorId`.
Support can use these IDs to correlate a user-visible failure with logs without
asking the learner for sensitive request data.

## External error reporting

Better Stack's HTTP log ingestion endpoint accepts the existing sanitized JSON
format and bearer authentication. Create a source named `the-programmer-errors`,
then configure its ingesting host and source token:

```dotenv
APP_VERSION=2026.08.30
ERROR_REPORTING_URL=https://replace-with-your-better-stack-ingesting-host
ERROR_REPORTING_TOKEN=replace-with-the-better-stack-source-token
```

The receiver must accept `POST` requests with JSON and return any `2xx` status.
When a bearer token is configured, the API sends it in the `Authorization`
header. Network errors, timeouts, non-2xx responses, and a full bounded delivery
queue increment `the_programmer_error_report_delivery_failures_total`, allowing
the failure of the reporting channel itself to alert through Alertmanager.

The event includes its ID, `dt` timestamp, top-level searchable `message`,
release, environment, error name/message/
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

Create a separate Better Stack Prometheus integration named
`the-programmer-alerts` and place its unique URL in `ALERT_WEBHOOK_URL`.
Alertmanager's standard payload is accepted directly, including resolved
notifications, so alerts automatically open and resolve incidents without an
adapter service.

## Production setup checklist

1. Generate a base64url `METRICS_TOKEN` with at least 32 random characters.
2. Create the Grafana Cloud metrics-publisher token and configure the remote-write
   URL and numeric instance ID.
3. Set a long, unique password for private Grafana and its TLS root URL.
4. Create the Better Stack error source and configure its ingest host and token.
5. Create the Better Stack Prometheus integration and set `ALERT_WEBHOOK_URL`.
6. Configure the dashboard-sync workflow values and run it once.
7. Deploy, then verify both Grafana dashboards without generating
   synthetic load.
8. Send one controlled test event directly to each Better Stack receiver and confirm
   delivery. Do this only after the account and endpoint have been selected.
9. Route private Grafana through TLS and restrict access to operators.

No load or stress testing is required for these checks.

## Prometheus references

- [Prometheus exposition format](https://prometheus.io/docs/instrumenting/exposition_formats/)
- [Prometheus metric types](https://prometheus.io/docs/concepts/metric_types/)
