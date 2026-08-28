import type { FastifyInstance } from "fastify";
import { z } from "zod";
import type { Authenticate } from "../../auth/authenticator.js";
import { NotFoundError, UnauthorizedError } from "../../shared/errors.js";
import type { Queryable } from "../../shared/types.js";
import { ProfileRepository } from "./repository.js";

const updateProfileSchema = z.object({
  displayName: z.string().trim().min(1).max(80).optional(),
  bio: z.string().trim().max(240).optional(),
}).refine((value) => value.displayName !== undefined || value.bio !== undefined, {
  message: "At least one profile field is required",
});

export function registerProfileRoutes(app: FastifyInstance, database: Queryable, authenticate: Authenticate): void {
  const profiles = new ProfileRepository(database);

  app.get("/me/profile", { preHandler: authenticate }, async (request) => {
    if (!request.user) throw new UnauthorizedError();
    const profile = await profiles.get(request.user.id);
    if (!profile) throw new NotFoundError("Profile");
    return { data: profile };
  });

  app.patch("/me/profile", { preHandler: authenticate }, async (request) => {
    if (!request.user) throw new UnauthorizedError();
    const profile = await profiles.update(request.user.id, updateProfileSchema.parse(request.body));
    if (!profile) throw new NotFoundError("Profile");
    return { data: profile };
  });
}
