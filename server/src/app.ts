import cors from "@fastify/cors";
import Fastify, { LogController, type FastifyInstance } from "fastify";
import { randomUUID } from "node:crypto";
import type { Pool } from "pg";
import { ZodError } from "zod";
import type { Authenticate } from "./auth/authenticator.js";
import { createSessionAuthenticator } from "./auth/authenticator.js";
import type { AppConfig } from "./config/env.js";
import { registerAttemptRoutes } from "./modules/attempts/routes.js";
import { registerCourseRoutes } from "./modules/courses/routes.js";
import { registerAuthRoutes } from "./modules/auth/routes.js";
import { registerHealthRoutes } from "./modules/health/routes.js";
import { registerProgressRoutes } from "./modules/progress/routes.js";
import { registerQuestionRoutes } from "./modules/questions/routes.js";
import { registerProfileRoutes } from "./modules/profiles/routes.js";
import { registerTutorialExerciseRoutes } from "./modules/tutorial-exercises/routes.js";
import { registerMultiplayerRoutes } from "./modules/multiplayer/routes.js";
import { registerLeaderboardRoutes } from "./modules/leaderboards/routes.js";
import { ApiError } from "./shared/errors.js";
import { createApiRateLimitHook, createAuthRateLimitPreHandler } from "./security/rate-limiter.js";
import { MetricsRegistry, registerMetricsHooks } from "./monitoring/metrics.js";
import { registerMonitoringRoutes } from "./monitoring/routes.js";
import { registerClientErrorRoutes } from "./monitoring/client-errors.js";
import { createErrorReporter, type ErrorReporter } from "./monitoring/error-reporter.js";
import { PushNotificationRepository } from "./modules/notifications/repository.js";
import { PushNotificationService } from "./modules/notifications/service.js";
import { registerNotificationRoutes } from "./modules/notifications/routes.js";

interface BuildAppOptions {
  config: AppConfig;
  database: Pool;
  authenticate?: Authenticate;
  errorReporter?: ErrorReporter;
}

export async function buildApp(options: BuildAppOptions): Promise<FastifyInstance> {
  const app = Fastify({
    logger: {
      level: options.config.LOG_LEVEL,
      redact: {
        paths: [
          "req.headers.authorization",
          "req.headers.cookie",
          "res.headers.set-cookie",
          "password",
          "token",
        ],
        censor: "[REDACTED]",
      },
    },
    logController: new LogController({ disableRequestLogging: true }),
    genReqId: () => randomUUID(),
    trustProxy: options.config.TRUST_PROXY,
    bodyLimit: options.config.BODY_LIMIT_BYTES,
    requestTimeout: 15_000,
    connectionTimeout: 10_000,
  });
  const metrics = new MetricsRegistry();
  const notificationRepository = new PushNotificationRepository(options.database);
  const notifications = new PushNotificationService(
    notificationRepository,
    app.log,
    options.config.EXPO_ACCESS_TOKEN,
  );
  notifications.start();
  const errorReporter = options.errorReporter ?? createErrorReporter(options.config, (error) => {
    app.log.warn({ err: error }, "External error report delivery failed");
  });
  app.decorate("errorReporter", errorReporter);
  app.decorateRequest("user", null);
  app.decorateRequest("authSessionId", null);
  registerMetricsHooks(app, metrics);

  app.addHook("onRequest", createApiRateLimitHook(
    options.config.API_RATE_LIMIT_MAX,
    options.config.API_RATE_LIMIT_WINDOW_SECONDS,
  ));
  app.addHook("onSend", async (request, reply, payload) => {
    reply.header("X-Request-ID", request.id);
    reply.headers({
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "Referrer-Policy": "no-referrer",
      "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
      "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'; base-uri 'none'",
    });
    if (options.config.NODE_ENV === "production") {
      reply.header("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    }
    if (request.headers.authorization || request.url.startsWith("/api/v1/auth/")) {
      reply.header("Cache-Control", "no-store");
      reply.header("Pragma", "no-cache");
    }
    return payload;
  });

  await app.register(cors, {
    origin:
      options.config.CORS_ORIGIN === "*"
        ? true
        : options.config.CORS_ORIGIN.split(",").map((origin) => origin.trim()),
    methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "OPTIONS"],
  });

  const authenticate =
    options.authenticate ??
    (options.config.AUTH_MODE === "session"
      ? createSessionAuthenticator(options.database)
      : null);
  if (!authenticate) {
    throw new Error("AUTH_MODE=external requires an Authenticate implementation");
  }

  app.setErrorHandler((error, request, reply) => {
    const statusCode = typeof error === "object" && error !== null && "statusCode" in error
      ? (error as { statusCode?: unknown }).statusCode
      : undefined;
    if (error instanceof ZodError) {
      return reply.code(400).send({
        error: {
          code: "VALIDATION_ERROR",
          message: "The request is invalid",
          details: error.issues,
          requestId: request.id,
        },
      });
    }
    if (error instanceof ApiError) {
      return reply.code(error.statusCode).send({
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
          requestId: request.id,
        },
      });
    }
    if (statusCode === 413) {
      return reply.code(413).send({
        error: {
          code: "PAYLOAD_TOO_LARGE",
          message: "The request body is too large",
          requestId: request.id,
        },
      });
    }
    if (statusCode === 400) {
      return reply.code(400).send({
        error: {
          code: "INVALID_REQUEST",
          message: "The request could not be parsed",
          requestId: request.id,
        },
      });
    }

    metrics.unhandledError();
    const route = request.routeOptions.url || "unmatched";
    const errorId = errorReporter.capture(error, {
      requestId: request.id,
      method: request.method,
      route,
      ...(request.user ? { userId: request.user.id } : {}),
      source: "request",
    });
    request.log.error({ err: error, errorId, method: request.method, route }, "Unhandled request error");
    return reply.code(500).send({
      error: {
        code: "INTERNAL_ERROR",
        message: "An unexpected error occurred",
        requestId: request.id,
        errorId,
      },
    });
  });

  app.addHook("onClose", async () => {
    notifications.stop();
    await errorReporter.flush();
  });

  registerHealthRoutes(app, options.database);
  registerMonitoringRoutes(app, metrics, options.config.METRICS_TOKEN);
  await app.register(async (api) => {
    registerClientErrorRoutes(
      api,
      errorReporter,
      options.config.CLIENT_ERROR_RATE_LIMIT_MAX,
      options.config.CLIENT_ERROR_RATE_LIMIT_WINDOW_SECONDS,
    );
    registerCourseRoutes(api, options.database);
    registerQuestionRoutes(api, options.database);
    if (options.config.AUTH_MODE === "session") {
      registerAuthRoutes(
        api,
        options.database,
        authenticate,
        createAuthRateLimitPreHandler(
          options.config.AUTH_RATE_LIMIT_MAX,
          options.config.AUTH_RATE_LIMIT_WINDOW_SECONDS,
        ),
      );
    }
    registerAttemptRoutes(api, options.database, authenticate);
    registerProgressRoutes(api, options.database, authenticate);
    registerProfileRoutes(api, options.database, authenticate);
    registerNotificationRoutes(api, notificationRepository, authenticate);
    registerTutorialExerciseRoutes(api, options.database, authenticate);
    registerMultiplayerRoutes(api, options.database, authenticate, options.config.CORS_ORIGIN, notifications);
    registerLeaderboardRoutes(api, options.database, authenticate);
  }, { prefix: "/api/v1" });

  return app;
}
