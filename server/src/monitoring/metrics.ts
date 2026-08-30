import type { FastifyInstance, FastifyRequest } from "fastify";

const durationBuckets = [0.05, 0.1, 0.25, 0.5, 1, 2.5, 5] as const;

interface RequestMetric {
  count: number;
  durationSum: number;
  buckets: number[];
}

function escapeLabel(value: string): string {
  return value.replaceAll("\\", "\\\\").replaceAll("\n", "\\n").replaceAll('"', '\\"');
}

function labels(values: Record<string, string>): string {
  return `{${Object.entries(values).map(([key, value]) => `${key}="${escapeLabel(value)}"`).join(",")}}`;
}

export class MetricsRegistry {
  private readonly startedAt = Date.now();
  private readonly requests = new Map<string, RequestMetric>();
  private activeRequests = 0;
  private unhandledErrors = 0;
  private errorReportDeliveryFailures = 0;

  requestStarted(): void {
    this.activeRequests += 1;
  }

  requestFinished(method: string, route: string, statusCode: number, durationSeconds: number): void {
    this.activeRequests = Math.max(0, this.activeRequests - 1);
    const status = String(statusCode);
    const key = JSON.stringify([method, route, status]);
    const metric = this.requests.get(key) ?? {
      count: 0,
      durationSum: 0,
      buckets: durationBuckets.map(() => 0),
    };
    metric.count += 1;
    metric.durationSum += durationSeconds;
    durationBuckets.forEach((bucket, index) => {
      if (durationSeconds <= bucket) metric.buckets[index] = (metric.buckets[index] ?? 0) + 1;
    });
    this.requests.set(key, metric);
  }

  unhandledError(): void {
    this.unhandledErrors += 1;
  }

  errorReportDeliveryFailed(): void {
    this.errorReportDeliveryFailures += 1;
  }

  render(): string {
    const lines = [
      "# HELP the_programmer_uptime_seconds Process uptime in seconds.",
      "# TYPE the_programmer_uptime_seconds gauge",
      `the_programmer_uptime_seconds ${(Date.now() - this.startedAt) / 1000}`,
      "# HELP the_programmer_active_requests Current number of requests being processed.",
      "# TYPE the_programmer_active_requests gauge",
      `the_programmer_active_requests ${this.activeRequests}`,
      "# HELP the_programmer_unhandled_errors_total Unhandled request errors.",
      "# TYPE the_programmer_unhandled_errors_total counter",
      `the_programmer_unhandled_errors_total ${this.unhandledErrors}`,
      "# HELP the_programmer_error_report_delivery_failures_total External error report delivery failures.",
      "# TYPE the_programmer_error_report_delivery_failures_total counter",
      `the_programmer_error_report_delivery_failures_total ${this.errorReportDeliveryFailures}`,
      "# HELP process_resident_memory_bytes Resident memory size in bytes.",
      "# TYPE process_resident_memory_bytes gauge",
      `process_resident_memory_bytes ${process.memoryUsage().rss}`,
      "# HELP the_programmer_http_requests_total Completed HTTP requests.",
      "# TYPE the_programmer_http_requests_total counter",
      "# HELP the_programmer_http_request_duration_seconds HTTP request duration.",
      "# TYPE the_programmer_http_request_duration_seconds histogram",
    ];

    for (const [key, metric] of [...this.requests.entries()].sort(([first], [second]) => first.localeCompare(second))) {
      const [method = "UNKNOWN", route = "unknown", status = "0"] = JSON.parse(key) as string[];
      const baseLabels = { method, route, status };
      lines.push(`the_programmer_http_requests_total${labels(baseLabels)} ${metric.count}`);
      durationBuckets.forEach((bucket, index) => {
        lines.push(`the_programmer_http_request_duration_seconds_bucket${labels({ ...baseLabels, le: String(bucket) })} ${metric.buckets[index] ?? 0}`);
      });
      lines.push(`the_programmer_http_request_duration_seconds_bucket${labels({ ...baseLabels, le: "+Inf" })} ${metric.count}`);
      lines.push(`the_programmer_http_request_duration_seconds_sum${labels(baseLabels)} ${metric.durationSum}`);
      lines.push(`the_programmer_http_request_duration_seconds_count${labels(baseLabels)} ${metric.count}`);
    }
    return `${lines.join("\n")}\n`;
  }
}

function routeLabel(request: FastifyRequest): string {
  const route = request.routeOptions.url;
  return typeof route === "string" && route.length > 0 ? route : "unmatched";
}

export function registerMetricsHooks(app: FastifyInstance, metrics: MetricsRegistry): void {
  app.decorateRequest("telemetryStartedAt", 0n);
  app.addHook("onRequest", async (request) => {
    request.telemetryStartedAt = process.hrtime.bigint();
    metrics.requestStarted();
  });
  app.addHook("onResponse", async (request, reply) => {
    const elapsed = Number(process.hrtime.bigint() - request.telemetryStartedAt) / 1_000_000_000;
    const route = routeLabel(request);
    metrics.requestFinished(request.method, route, reply.statusCode, elapsed);
    request.log.info({
      requestId: request.id,
      method: request.method,
      route,
      statusCode: reply.statusCode,
      durationMs: Math.round(elapsed * 1000 * 100) / 100,
    }, "Request completed");
  });
}
