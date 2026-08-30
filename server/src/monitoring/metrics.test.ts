import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { MetricsRegistry } from "./metrics.js";

describe("MetricsRegistry", () => {
  it("renders bounded Prometheus counters and cumulative latency buckets", () => {
    const metrics = new MetricsRegistry();
    metrics.requestStarted();
    metrics.requestFinished("GET", "/api/v1/courses/:slug", 200, 0.08);
    metrics.unhandledError();
    metrics.errorReportDeliveryFailed();

    const output = metrics.render();
    assert.match(output, /the_programmer_http_requests_total\{method="GET",route="\/api\/v1\/courses\/:slug",status="200"\} 1/);
    assert.match(output, /le="0.05"\} 0/);
    assert.match(output, /le="0.1"\} 1/);
    assert.match(output, /le="\+Inf"\} 1/);
    assert.match(output, /the_programmer_unhandled_errors_total 1/);
    assert.match(output, /the_programmer_error_report_delivery_failures_total 1/);
    assert.ok(output.endsWith("\n"));
  });
});
