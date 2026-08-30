import { randomUUID } from "node:crypto";

export interface ErrorContext {
  requestId?: string;
  method?: string;
  route?: string;
  userId?: string;
  source: "request" | "process" | "client";
  platform?: string;
  appVersion?: string;
  clientEventId?: string;
}

export interface ErrorReporter {
  capture(error: unknown, context: ErrorContext): string;
  flush(timeoutMs?: number): Promise<void>;
}

export class NoopErrorReporter implements ErrorReporter {
  capture(): string { return randomUUID(); }
  async flush(): Promise<void> {}
}

interface ReporterConfig {
  url: string;
  token?: string;
  environment: string;
  release: string;
}

type Fetch = typeof fetch;

export class HttpErrorReporter implements ErrorReporter {
  private readonly pending = new Set<Promise<void>>();

  constructor(
    private readonly config: ReporterConfig,
    private readonly fetchImpl: Fetch = fetch,
    private readonly maxPending = 50,
    private readonly onDeliveryFailure: (error: unknown) => void = () => undefined,
  ) {}

  capture(error: unknown, context: ErrorContext): string {
    const eventId = randomUUID();
    if (this.pending.size >= this.maxPending) return eventId;
    const normalized = error instanceof Error ? error : new Error(String(error));
    const delivery = this.deliver({
      eventId,
      timestamp: new Date().toISOString(),
      service: "the-programmer-api",
      environment: this.config.environment,
      release: this.config.release,
      error: {
        name: normalized.name,
        message: normalized.message,
        stack: normalized.stack,
      },
      context,
    }).finally(() => this.pending.delete(delivery));
    this.pending.add(delivery);
    return eventId;
  }

  async flush(timeoutMs = 3_000): Promise<void> {
    await Promise.race([
      Promise.allSettled([...this.pending]).then(() => undefined),
      new Promise<void>((resolve) => setTimeout(resolve, timeoutMs)),
    ]);
  }

  private async deliver(event: unknown): Promise<void> {
    try {
      await this.fetchImpl(this.config.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(this.config.token ? { Authorization: `Bearer ${this.config.token}` } : {}),
        },
        body: JSON.stringify(event),
        signal: AbortSignal.timeout(3_000),
      });
    } catch (error) {
      // Reporting must never crash or delay the application request path.
      this.onDeliveryFailure(error);
    }
  }
}

export function createErrorReporter(config: {
  ERROR_REPORTING_URL?: string | undefined;
  ERROR_REPORTING_TOKEN?: string | undefined;
  NODE_ENV: string;
  APP_VERSION: string;
}, onDeliveryFailure: (error: unknown) => void = () => undefined): ErrorReporter {
  if (!config.ERROR_REPORTING_URL) return new NoopErrorReporter();
  return new HttpErrorReporter({
    url: config.ERROR_REPORTING_URL,
    ...(config.ERROR_REPORTING_TOKEN ? { token: config.ERROR_REPORTING_TOKEN } : {}),
    environment: config.NODE_ENV,
    release: config.APP_VERSION,
  }, fetch, 50, onDeliveryFailure);
}
