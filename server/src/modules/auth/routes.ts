import type { FastifyInstance } from "fastify";
import type { Pool } from "pg";
import { z } from "zod";
import type { Authenticate } from "../../auth/authenticator.js";
import { UnauthorizedError } from "../../shared/errors.js";
import { AuthService } from "./service.js";
import type { FastifyReply, FastifyRequest } from "fastify";

const email = z.string().trim().toLowerCase().email().max(254);
const password = z.string().min(8).max(128);
const registerSchema = z.object({
  email,
  password,
  displayName: z.string().trim().min(1).max(80),
});
const loginSchema = z.object({ email, password });

type AuthRateLimit = (scope: "login" | "register") => (
  request: FastifyRequest,
  reply: FastifyReply,
) => Promise<void>;

export function registerAuthRoutes(
  app: FastifyInstance,
  database: Pool,
  authenticate: Authenticate,
  rateLimit: AuthRateLimit,
): void {
  const auth = new AuthService(database);

  app.post("/auth/register", { preHandler: rateLimit("register") }, async (request, reply) => {
    const result = await auth.register(registerSchema.parse(request.body));
    return reply.code(201).send({ data: result });
  });

  app.post("/auth/login", { preHandler: rateLimit("login") }, async (request) => ({
    data: await auth.login(loginSchema.parse(request.body)),
  }));

  app.post("/auth/logout", { preHandler: authenticate }, async (request, reply) => {
    if (!request.user || !request.authSessionId) throw new UnauthorizedError();
    await auth.logout(request.user.id, request.authSessionId);
    return reply.code(204).send();
  });
}
