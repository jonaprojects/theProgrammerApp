import type { AuthenticatedUser } from "../shared/types.js";
import type { ErrorReporter } from "../monitoring/error-reporter.js";

declare module "fastify" {
  interface FastifyInstance {
    errorReporter: ErrorReporter;
  }

  interface FastifyRequest {
    user: AuthenticatedUser | null;
    authSessionId: string | null;
    telemetryStartedAt: bigint;
  }
}
