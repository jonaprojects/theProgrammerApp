import { z } from "zod";

const booleanString = z
  .enum(["true", "false"])
  .default("false")
  .transform((value) => value === "true");

const corsOrigins = z.string().min(1).refine((value) => {
  if (value === "*") return true;
  return value.split(",").every((origin) => {
    try {
      const parsed = new URL(origin.trim());
      return (parsed.protocol === "http:" || parsed.protocol === "https:") && parsed.origin === origin.trim();
    } catch {
      return false;
    }
  });
}, "CORS_ORIGIN must be * or a comma-separated list of HTTP origins");

const envSchema = z
  .object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    HOST: z.string().min(1).default("0.0.0.0"),
    PORT: z.coerce.number().int().min(1).max(65_535).default(3000),
    LOG_LEVEL: z
      .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
      .default("info"),
    DATABASE_URL: z.string().url().refine((value) => {
      const protocol = new URL(value).protocol;
      return protocol === "postgres:" || protocol === "postgresql:";
    }, "DATABASE_URL must use the postgres or postgresql protocol"),
    DATABASE_SSL: booleanString,
    CORS_ORIGIN: corsOrigins.default("http://localhost:8081"),
    AUTH_MODE: z.enum(["session", "external"]).default("session"),
    TRUST_PROXY: booleanString,
    BODY_LIMIT_BYTES: z.coerce.number().int().min(16_384).max(1_048_576).default(65_536),
    API_RATE_LIMIT_MAX: z.coerce.number().int().min(10).max(10_000).default(300),
    API_RATE_LIMIT_WINDOW_SECONDS: z.coerce.number().int().min(1).max(3_600).default(60),
    AUTH_RATE_LIMIT_MAX: z.coerce.number().int().min(3).max(100).default(10),
    AUTH_RATE_LIMIT_WINDOW_SECONDS: z.coerce.number().int().min(60).max(86_400).default(900),
    CLIENT_ERROR_RATE_LIMIT_MAX: z.coerce.number().int().min(3).max(100).default(20),
    CLIENT_ERROR_RATE_LIMIT_WINDOW_SECONDS: z.coerce.number().int().min(10).max(3_600).default(60),
    APP_VERSION: z.string().trim().min(1).max(100).default("development"),
    DEPLOYMENT_ENVIRONMENT: z.enum(["development", "staging", "production"]).optional(),
    METRICS_TOKEN: z.string().min(32).max(512).optional(),
    ERROR_REPORTING_URL: z.string().url().optional(),
    ERROR_REPORTING_TOKEN: z.string().min(16).max(2_048).optional(),
    EXPO_ACCESS_TOKEN: z.string().min(16).max(2_048).optional(),
  })
  .superRefine((config, context) => {
    if (config.NODE_ENV === "production" && config.CORS_ORIGIN === "*") {
      context.addIssue({ code: "custom", path: ["CORS_ORIGIN"], message: "Wildcard CORS is not allowed in production" });
    }
    if (config.NODE_ENV === "production" && config.CORS_ORIGIN !== "*") {
      for (const origin of config.CORS_ORIGIN.split(",")) {
        if (new URL(origin.trim()).protocol !== "https:") {
          context.addIssue({ code: "custom", path: ["CORS_ORIGIN"], message: "Production CORS origins must use HTTPS" });
          break;
        }
      }
    }
    if (config.NODE_ENV === "production" && config.ERROR_REPORTING_URL && new URL(config.ERROR_REPORTING_URL).protocol !== "https:") {
      context.addIssue({ code: "custom", path: ["ERROR_REPORTING_URL"], message: "Production error reporting must use HTTPS" });
    }
  });

export type AppConfig = z.infer<typeof envSchema>;

export function loadLocalEnvFile(): void {
  try {
    process.loadEnvFile();
  } catch (error) {
    if (
      !(error instanceof Error) ||
      !("code" in error) ||
      (error as NodeJS.ErrnoException).code !== "ENOENT"
    ) {
      throw error;
    }
  }
}

export function loadConfig(environment: NodeJS.ProcessEnv = process.env): AppConfig {
  return envSchema.parse(environment);
}
