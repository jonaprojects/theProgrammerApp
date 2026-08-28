import type { AuthenticatedUser } from "../shared/types.js";

declare module "fastify" {
  interface FastifyRequest {
    user: AuthenticatedUser | null;
    authSessionId: string | null;
  }
}
