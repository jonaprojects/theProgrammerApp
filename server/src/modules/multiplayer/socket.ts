import type { IncomingMessage } from "node:http";
import type { Duplex } from "node:stream";
import type { FastifyInstance } from "fastify";
import type { Pool } from "pg";
import WebSocket, { type RawData, WebSocketServer } from "ws";

import { resolveSessionToken } from "../../auth/authenticator.js";
import type { MatchState, MultiplayerService } from "./service.js";

const AUTH_TIMEOUT_MS = 7_500;
const HEARTBEAT_MS = 25_000;
const MAX_CONNECTIONS = 500;
const MAX_USER_CONNECTIONS_PER_MATCH = 4;
const MAX_MESSAGE_BYTES = 4_096;
const REVIEW_DURATION_MS = 3_000;
const SOCKET_PATH = /^\/api\/v1\/multiplayer\/matches\/([0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})\/socket$/i;

type ClientMessage = { type: "authenticate"; token: string };
type RealtimeSocket = WebSocket & {
  alive: boolean;
  authenticating: boolean;
  matchId?: string;
  userId?: string;
};

export function matchIdFromSocketUrl(rawUrl: string | undefined): string | null {
  if (!rawUrl) return null;
  try {
    return new URL(rawUrl, "http://localhost").pathname.match(SOCKET_PATH)?.[1] ?? null;
  } catch {
    return null;
  }
}

export function parseAuthenticationMessage(data: RawData): ClientMessage | null {
  const length = Array.isArray(data)
    ? data.reduce((total, part) => total + part.byteLength, 0)
    : data.byteLength;
  if (length > MAX_MESSAGE_BYTES) return null;
  try {
    const text = Array.isArray(data) ? Buffer.concat(data).toString() : data.toString();
    const value = JSON.parse(text) as Partial<ClientMessage>;
    if (value.type !== "authenticate" || typeof value.token !== "string") return null;
    if (!/^[A-Za-z0-9_-]{20,256}$/.test(value.token)) return null;
    return { type: "authenticate", token: value.token };
  } catch {
    return null;
  }
}

export function nextMatchTransitionAt(match: MatchState): number | null {
  if (match.status === "waiting") return new Date(match.expiresAt).getTime();
  if (match.status !== "active" || !match.round) return null;
  if (match.round.phase === "answering") return new Date(match.round.endsAt).getTime();
  if (!match.round.revealedAt) return null;
  return new Date(match.round.revealedAt).getTime() + REVIEW_DURATION_MS;
}

function originAllowed(origin: string | undefined, configuredOrigins: string): boolean {
  if (!origin || configuredOrigins === "*") return true;
  return configuredOrigins.split(",").map((value) => value.trim()).includes(origin);
}

function rejectUpgrade(socket: Duplex, status: 403 | 404 | 429): void {
  const reason = status === 403 ? "Forbidden" : status === 429 ? "Too Many Requests" : "Not Found";
  socket.write(`HTTP/1.1 ${status} ${reason}\r\nConnection: close\r\nContent-Length: 0\r\n\r\n`);
  socket.destroy();
}

function send(socket: WebSocket, message: unknown): void {
  if (socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify(message));
}

export class MultiplayerRealtimeHub {
  private readonly server = new WebSocketServer({ noServer: true, maxPayload: MAX_MESSAGE_BYTES });
  private readonly clientsByMatch = new Map<string, Set<RealtimeSocket>>();
  private readonly transitionTimers = new Map<string, NodeJS.Timeout>();
  private readonly publishing = new Set<string>();
  private readonly pendingPublish = new Set<string>();
  private readonly heartbeat: NodeJS.Timeout;
  private readonly upgradeHandler: (request: IncomingMessage, socket: Duplex, head: Buffer) => void;

  constructor(
    private readonly app: FastifyInstance,
    private readonly database: Pool,
    private readonly multiplayer: MultiplayerService,
    private readonly configuredOrigins: string,
  ) {
    this.upgradeHandler = (request, socket, head) => {
      const matchId = matchIdFromSocketUrl(request.url);
      if (!matchId) {
        if (request.url?.startsWith("/api/v1/multiplayer/")) rejectUpgrade(socket, 404);
        return;
      }
      if (!originAllowed(request.headers.origin, this.configuredOrigins)) {
        rejectUpgrade(socket, 403);
        return;
      }
      if (this.server.clients.size >= MAX_CONNECTIONS) {
        rejectUpgrade(socket, 429);
        return;
      }
      this.server.handleUpgrade(request, socket, head, (rawSocket) => {
        this.accept(rawSocket as RealtimeSocket, matchId);
      });
    };
    app.server.on("upgrade", this.upgradeHandler);
    this.heartbeat = setInterval(() => this.checkConnections(), HEARTBEAT_MS);
  }

  publish(matchId: string): void {
    if (!this.clientsByMatch.get(matchId)?.size) return;
    if (this.publishing.has(matchId)) {
      this.pendingPublish.add(matchId);
      return;
    }
    this.publishing.add(matchId);
    void this.broadcast(matchId).finally(() => {
      this.publishing.delete(matchId);
      if (this.pendingPublish.delete(matchId)) this.publish(matchId);
    });
  }

  close(): void {
    clearInterval(this.heartbeat);
    this.app.server.off("upgrade", this.upgradeHandler);
    for (const timer of this.transitionTimers.values()) clearTimeout(timer);
    this.transitionTimers.clear();
    for (const socket of this.server.clients) socket.close(1001, "Server shutting down");
    this.server.close();
  }

  private accept(socket: RealtimeSocket, matchId: string): void {
    socket.alive = true;
    socket.authenticating = false;
    socket.matchId = matchId;
    const authTimer = setTimeout(() => socket.close(1008, "Authentication timeout"), AUTH_TIMEOUT_MS);

    socket.on("pong", () => { socket.alive = true; });
    socket.on("error", (error) => {
      this.app.log.debug({ err: error, matchId }, "Multiplayer WebSocket error");
    });
    socket.on("close", () => {
      clearTimeout(authTimer);
      this.remove(socket);
    });
    socket.on("message", (data) => {
      if (socket.userId || socket.authenticating) return;
      const message = parseAuthenticationMessage(data);
      if (!message) {
        send(socket, { type: "error", code: "INVALID_MESSAGE", message: "Authentication is required" });
        socket.close(1008, "Invalid authentication message");
        return;
      }
      socket.authenticating = true;
      void this.authenticate(socket, message.token, authTimer);
    });
  }

  private async authenticate(socket: RealtimeSocket, token: string, authTimer: NodeJS.Timeout): Promise<void> {
    try {
      const session = await resolveSessionToken(this.database, token);
      if (!session || !socket.matchId) {
        send(socket, { type: "error", code: "UNAUTHORIZED", message: "The session is invalid or expired" });
        socket.close(1008, "Unauthorized");
        return;
      }
      const matchClients = this.clientsByMatch.get(socket.matchId) ?? new Set<RealtimeSocket>();
      const sameUserConnections = [...matchClients].filter((client) => client.userId === session.userId).length;
      if (sameUserConnections >= MAX_USER_CONNECTIONS_PER_MATCH) {
        send(socket, { type: "error", code: "CONNECTION_LIMIT", message: "Too many connections" });
        socket.close(1008, "Connection limit reached");
        return;
      }

      const state = await this.multiplayer.getState(session.userId, socket.matchId);
      if (socket.readyState !== WebSocket.OPEN) return;
      clearTimeout(authTimer);
      socket.userId = session.userId;
      socket.authenticating = false;
      matchClients.add(socket);
      this.clientsByMatch.set(socket.matchId, matchClients);
      send(socket, { type: "connection.ready" });
      send(socket, { type: "match.state", match: state });
      this.scheduleTransition(state);
    } catch (error) {
      this.app.log.debug({ err: error, matchId: socket.matchId }, "Multiplayer WebSocket authentication failed");
      send(socket, { type: "error", code: "FORBIDDEN", message: "Match access was denied" });
      socket.close(1008, "Match access denied");
    }
  }

  private async broadcast(matchId: string): Promise<void> {
    const clients = [...(this.clientsByMatch.get(matchId) ?? [])]
      .filter((socket) => socket.readyState === WebSocket.OPEN && socket.userId);
    if (!clients.length) return;
    const states = new Map<string, MatchState>();
    for (const socket of clients) {
      const userId = socket.userId;
      if (!userId) continue;
      try {
        let state = states.get(userId);
        if (!state) {
          state = await this.multiplayer.getState(userId, matchId);
          states.set(userId, state);
        }
        send(socket, { type: "match.state", match: state });
      } catch (error) {
        this.app.log.debug({ err: error, matchId, userId }, "Could not publish multiplayer state");
        send(socket, { type: "error", code: "MATCH_UNAVAILABLE", message: "The match is no longer available" });
        socket.close(1008, "Match unavailable");
      }
    }
    const state = states.values().next().value as MatchState | undefined;
    if (state) this.scheduleTransition(state);
  }

  private scheduleTransition(match: MatchState): void {
    const existing = this.transitionTimers.get(match.id);
    if (existing) clearTimeout(existing);
    this.transitionTimers.delete(match.id);
    const transitionAt = nextMatchTransitionAt(match);
    if (transitionAt === null || !this.clientsByMatch.get(match.id)?.size) return;
    const delay = Math.min(2_147_000_000, Math.max(25, transitionAt - Date.now() + 25));
    this.transitionTimers.set(match.id, setTimeout(() => {
      this.transitionTimers.delete(match.id);
      this.publish(match.id);
    }, delay));
  }

  private remove(socket: RealtimeSocket): void {
    if (!socket.matchId) return;
    const clients = this.clientsByMatch.get(socket.matchId);
    clients?.delete(socket);
    if (clients?.size) return;
    this.clientsByMatch.delete(socket.matchId);
    const timer = this.transitionTimers.get(socket.matchId);
    if (timer) clearTimeout(timer);
    this.transitionTimers.delete(socket.matchId);
  }

  private checkConnections(): void {
    for (const rawSocket of this.server.clients) {
      const socket = rawSocket as RealtimeSocket;
      if (!socket.alive) {
        socket.terminate();
        continue;
      }
      socket.alive = false;
      socket.ping();
    }
  }
}

export function registerMultiplayerRealtime(
  app: FastifyInstance,
  database: Pool,
  multiplayer: MultiplayerService,
  configuredOrigins: string,
): MultiplayerRealtimeHub {
  const hub = new MultiplayerRealtimeHub(app, database, multiplayer, configuredOrigins);
  app.addHook("onClose", async () => hub.close());
  return hub;
}
