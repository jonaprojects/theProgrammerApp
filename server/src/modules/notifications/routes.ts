import type { FastifyInstance } from "fastify";
import { z } from "zod";
import type { Authenticate } from "../../auth/authenticator.js";
import { UnauthorizedError } from "../../shared/errors.js";
import type { PushNotificationRepository } from "./repository.js";

const preferencesSchema = z.object({
  enabled: z.boolean().optional(),
  multiplayer: z.boolean().optional(),
  achievements: z.boolean().optional(),
}).refine((value) => Object.keys(value).length > 0, "At least one preference is required");
const deviceSchema = z.object({
  token: z.string().regex(/^(Expo|Exponent)PushToken\[[A-Za-z0-9_-]+\]$/),
  platform: z.enum(["android", "ios"]),
  deviceName: z.string().trim().min(1).max(120).optional(),
});
const deactivateSchema = z.object({ token: deviceSchema.shape.token });

export function registerNotificationRoutes(
  app: FastifyInstance,
  repository: PushNotificationRepository,
  authenticate: Authenticate,
): void {
  const identity = (request: { user: { id: string } | null; authSessionId: string | null }) => {
    if (!request.user || !request.authSessionId) throw new UnauthorizedError();
    return { userId: request.user.id, sessionId: request.authSessionId };
  };

  app.get("/me/notifications/preferences", { preHandler: authenticate }, async (request) => {
    const { userId } = identity(request);
    return { data: await repository.getPreferences(userId) };
  });

  app.patch("/me/notifications/preferences", { preHandler: authenticate }, async (request) => {
    const { userId } = identity(request);
    const input = preferencesSchema.parse(request.body);
    const changes = {
      ...(input.enabled !== undefined ? { enabled: input.enabled } : {}),
      ...(input.multiplayer !== undefined ? { multiplayer: input.multiplayer } : {}),
      ...(input.achievements !== undefined ? { achievements: input.achievements } : {}),
    };
    return { data: await repository.updatePreferences(userId, changes) };
  });

  app.post("/me/notifications/devices", { preHandler: authenticate }, async (request, reply) => {
    const identityValue = identity(request);
    const device = deviceSchema.parse(request.body);
    await repository.registerDevice({
      ...identityValue,
      token: device.token,
      platform: device.platform,
      ...(device.deviceName ? { deviceName: device.deviceName } : {}),
    });
    return reply.code(204).send();
  });

  app.post("/me/notifications/devices/deactivate", { preHandler: authenticate }, async (request, reply) => {
    const { userId } = identity(request);
    const { token } = deactivateSchema.parse(request.body);
    await repository.deactivateDevice(userId, token);
    return reply.code(204).send();
  });
}
