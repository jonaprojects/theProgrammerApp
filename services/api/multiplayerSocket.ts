import { API_BASE_URL, getSessionToken, invalidateSession } from "./client";
import type { ApiMultiplayerMatch } from "./types";

export type MultiplayerTransportStatus =
  | "connecting"
  | "connected"
  | "reconnecting"
  | "disconnected";

export type MultiplayerSocketHandlers = {
  onMatch: (match: ApiMultiplayerMatch) => void;
  onStatus: (status: MultiplayerTransportStatus) => void;
  onError?: (code: string) => void;
};

type ServerMessage =
  | { type: "connection.ready" }
  | { type: "match.state"; match: ApiMultiplayerMatch }
  | { type: "error"; code: string; message?: string };

const CONNECTION_TIMEOUT_MS = 10_000;
const MAX_RECONNECT_DELAY_MS = 8_000;

export function createMultiplayerSocketUrl(matchId: string, apiBaseUrl = API_BASE_URL): string {
  const base = new URL(apiBaseUrl.endsWith("/") ? apiBaseUrl : `${apiBaseUrl}/`);
  base.protocol = base.protocol === "https:" ? "wss:" : "ws:";
  base.pathname = `${base.pathname.replace(/\/$/, "")}/multiplayer/matches/${encodeURIComponent(matchId)}/socket`;
  base.search = "";
  base.hash = "";
  return base.toString();
}

export function reconnectDelay(attempt: number, random = Math.random): number {
  const exponential = Math.min(MAX_RECONNECT_DELAY_MS, 500 * (2 ** Math.max(0, attempt)));
  return exponential + Math.floor(random() * 250);
}

export function parseMultiplayerServerMessage(raw: string, expectedMatchId: string): ServerMessage | null {
  try {
    const value = JSON.parse(raw) as Partial<ServerMessage>;
    if (value.type === "connection.ready") return { type: "connection.ready" };
    if (value.type === "error" && typeof value.code === "string") {
      return { type: "error", code: value.code, ...(typeof value.message === "string" ? { message: value.message } : {}) };
    }
    if (
      value.type === "match.state"
      && typeof value.match === "object"
      && value.match !== null
      && value.match.id === expectedMatchId
    ) {
      return value as { type: "match.state"; match: ApiMultiplayerMatch };
    }
    return null;
  } catch {
    return null;
  }
}

export function subscribeToMultiplayerMatch(
  matchId: string,
  handlers: MultiplayerSocketHandlers,
): () => void {
  let stopped = false;
  let socket: WebSocket | null = null;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let connectionTimer: ReturnType<typeof setTimeout> | null = null;
  let attempt = 0;

  const clearConnectionTimer = () => {
    if (connectionTimer) clearTimeout(connectionTimer);
    connectionTimer = null;
  };

  const scheduleReconnect = () => {
    if (stopped || reconnectTimer) return;
    handlers.onStatus("reconnecting");
    const delay = reconnectDelay(attempt);
    attempt += 1;
    reconnectTimer = setTimeout(() => {
      reconnectTimer = null;
      void connect();
    }, delay);
  };

  const connect = async () => {
    handlers.onStatus(attempt === 0 ? "connecting" : "reconnecting");
    const token = await getSessionToken();
    if (stopped) return;
    if (!token) {
      handlers.onStatus("disconnected");
      handlers.onError?.("UNAUTHORIZED");
      return;
    }

    const nextSocket = new WebSocket(createMultiplayerSocketUrl(matchId));
    socket = nextSocket;
    connectionTimer = setTimeout(() => nextSocket.close(), CONNECTION_TIMEOUT_MS);

    nextSocket.onopen = () => {
      nextSocket.send(JSON.stringify({ type: "authenticate", token }));
    };
    nextSocket.onmessage = (event) => {
      const message = parseMultiplayerServerMessage(String(event.data), matchId);
      if (!message) return;
      if (message.type === "connection.ready") {
        clearConnectionTimer();
        attempt = 0;
        handlers.onStatus("connected");
        return;
      }
      if (message.type === "match.state") {
        clearConnectionTimer();
        attempt = 0;
        handlers.onStatus("connected");
        handlers.onMatch(message.match);
        return;
      }
      handlers.onError?.(message.code);
      if (["UNAUTHORIZED", "FORBIDDEN", "INVALID_MESSAGE", "CONNECTION_LIMIT", "MATCH_UNAVAILABLE"].includes(message.code)) {
        stopped = true;
        handlers.onStatus("disconnected");
        if (message.code === "UNAUTHORIZED") void invalidateSession();
        nextSocket.close(1000, "Terminal transport error");
      }
    };
    nextSocket.onerror = () => {
      // `close` owns reconnection so each failure schedules exactly one attempt.
    };
    nextSocket.onclose = () => {
      clearConnectionTimer();
      if (socket === nextSocket) socket = null;
      if (!stopped) scheduleReconnect();
    };
  };

  void connect();
  return () => {
    stopped = true;
    clearConnectionTimer();
    if (reconnectTimer) clearTimeout(reconnectTimer);
    reconnectTimer = null;
    socket?.close(1000, "Screen closed");
    socket = null;
  };
}
