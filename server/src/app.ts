import cors from "@fastify/cors";
import Fastify, { type FastifyInstance } from "fastify";
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

interface BuildAppOptions {
  config: AppConfig;
  database: Pool;
  authenticate?: Authenticate;
}

export async function buildApp(options: BuildAppOptions): Promise<FastifyInstance> {
  const app = Fastify({
    logger: { level: options.config.LOG_LEVEL },
    trustProxy: true,
  });
  app.decorateRequest("user", null);
  app.decorateRequest("authSessionId", null);

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

    request.log.error({ err: error }, "Unhandled request error");
    return reply.code(500).send({
      error: {
        code: "INTERNAL_ERROR",
        message: "An unexpected error occurred",
        requestId: request.id,
      },
    });
  });

  registerHealthRoutes(app, options.database);
  await app.register(async (api) => {
    registerCourseRoutes(api, options.database);
    registerQuestionRoutes(api, options.database);
    if (options.config.AUTH_MODE === "session") {
      registerAuthRoutes(api, options.database, authenticate);
    }
    registerAttemptRoutes(api, options.database, authenticate);
    registerProgressRoutes(api, options.database, authenticate);
    registerProfileRoutes(api, options.database, authenticate);
    registerTutorialExerciseRoutes(api, options.database, authenticate);
    registerMultiplayerRoutes(api, options.database, authenticate);
    registerLeaderboardRoutes(api, options.database, authenticate);
  }, { prefix: "/api/v1" });

  return app;
}
