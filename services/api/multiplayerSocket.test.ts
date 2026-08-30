jest.mock("@react-native-async-storage/async-storage", () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));
jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

import {
  createMultiplayerSocketUrl,
  parseMultiplayerServerMessage,
  reconnectDelay,
} from "./multiplayerSocket";

const matchId = "123e4567-e89b-42d3-a456-426614174000";

describe("multiplayer WebSocket client protocol", () => {
  it("builds ws and wss URLs without putting credentials in the query string", () => {
    expect(createMultiplayerSocketUrl(matchId, "http://localhost:3000/api/v1")).toBe(
      `ws://localhost:3000/api/v1/multiplayer/matches/${matchId}/socket`,
    );
    expect(createMultiplayerSocketUrl(matchId, "https://api.example.com/api/v1")).toBe(
      `wss://api.example.com/api/v1/multiplayer/matches/${matchId}/socket`,
    );
  });

  it("uses bounded exponential reconnect delays", () => {
    expect(reconnectDelay(0, () => 0)).toBe(500);
    expect(reconnectDelay(3, () => 0)).toBe(4_000);
    expect(reconnectDelay(20, () => 0)).toBe(8_000);
    expect(reconnectDelay(0, () => 0.5)).toBe(625);
  });

  it("rejects malformed and cross-match state frames", () => {
    expect(parseMultiplayerServerMessage("not-json", matchId)).toBeNull();
    expect(parseMultiplayerServerMessage(JSON.stringify({
      type: "match.state",
      match: { id: "another-match" },
    }), matchId)).toBeNull();
    expect(parseMultiplayerServerMessage(JSON.stringify({
      type: "error",
      code: "UNAUTHORIZED",
    }), matchId)).toEqual({ type: "error", code: "UNAUTHORIZED" });
  });
});
