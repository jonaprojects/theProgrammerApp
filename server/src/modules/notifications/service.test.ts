import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { FastifyBaseLogger } from "fastify";
import type { PushNotificationRepository } from "./repository.js";
import { PushNotificationService } from "./service.js";

const logger = { warn: () => undefined } as unknown as FastifyBaseLogger;

describe("PushNotificationService", () => {
  it("sends a ticket and stores it for receipt checking", async () => {
    const recorded: unknown[] = [];
    const repository = {
      listDevices: async () => [{ id: "device-1", token: "ExponentPushToken[token]", userId: "user-1" }],
      recordTicket: async (ticket: unknown) => { recorded.push(ticket); },
    } as unknown as PushNotificationRepository;
    const fetcher = async (_url: string | URL | Request, init?: RequestInit) => {
      const messages = JSON.parse(String(init?.body));
      assert.equal(messages[0].data.route, "/multiplayer/12345678-1234-1234-1234-123456789012");
      return Response.json({ data: [{ status: "ok", id: "ticket-1" }] });
    };
    const service = new PushNotificationService(repository, logger, undefined, fetcher);

    const count = await service.sendToUser("user-1", {
      category: "multiplayer",
      title: "Ready",
      body: "Join now",
      route: "/multiplayer/12345678-1234-1234-1234-123456789012",
      event: "multiplayer-ready",
    });

    assert.equal(count, 1);
    assert.deepEqual(recorded, [{
      userId: "user-1",
      deviceId: "device-1",
      category: "multiplayer",
      ticketId: "ticket-1",
    }]);
  });

  it("applies Expo receipt errors so invalid devices can be retired", async () => {
    const completed: unknown[] = [];
    const pending = { deliveryId: "delivery-1", ticketId: "ticket-1", deviceId: "device-1" };
    const repository = {
      dueReceipts: async () => [pending],
      completeReceipt: async (...args: unknown[]) => { completed.push(args); },
    } as unknown as PushNotificationRepository;
    const fetcher = async () => Response.json({
      data: { "ticket-1": { status: "error", details: { error: "DeviceNotRegistered" } } },
    });
    const service = new PushNotificationService(repository, logger, undefined, fetcher);

    await service.checkReceipts();

    assert.deepEqual(completed, [[pending, "DeviceNotRegistered"]]);
  });
});
