import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import type {
  ApiAttemptResult,
  ApiAuthResult,
  ApiCourse,
  ApiCourseDetails,
  ApiEnvelope,
  ApiProgress,
  ApiQuestion,
  ApiMultiplayerAnswerResult,
  ApiMultiplayerMatch,
  ApiTopic,
  ApiTutorialExerciseSubmission,
  ApiUserProfile,
  ApiLeaderboard,
  ApiLeaderboardPeriod,
  ApiAchievements,
  ApiNotificationPreferences,
} from "./types";

const configuredUrl = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "");
export const API_BASE_URL =
  configuredUrl ??
  (Platform.OS === "android"
    ? "http://10.0.2.2:3000/api/v1"
    : "http://localhost:3000/api/v1");

const SESSION_TOKEN_KEY = `the-programmer:session:${API_BASE_URL}`;
const SECURE_SESSION_TOKEN_KEY = SESSION_TOKEN_KEY.replace(/[^A-Za-z0-9._-]/g, "_");
const unauthorizedListeners = new Set<() => void>();

export class ApiRequestError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: string,
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

async function request<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiRequestError(
      payload?.error?.message ?? `Request failed with status ${response.status}`,
      response.status,
      payload?.error?.code,
    );
  }
  if (response.status === 204) return undefined as T;
  return (payload as ApiEnvelope<T>).data;
}

export async function getSessionToken(): Promise<string | null> {
  if (Platform.OS === "web") return AsyncStorage.getItem(SESSION_TOKEN_KEY);
  const secureToken = await SecureStore.getItemAsync(SECURE_SESSION_TOKEN_KEY);
  if (secureToken) return secureToken;

  // Preserve sessions created before native encrypted storage was introduced.
  const legacyToken = await AsyncStorage.getItem(SESSION_TOKEN_KEY);
  if (legacyToken) {
    await SecureStore.setItemAsync(SECURE_SESSION_TOKEN_KEY, legacyToken);
    await AsyncStorage.removeItem(SESSION_TOKEN_KEY);
  }
  return legacyToken;
}

export async function setSessionToken(token: string | null): Promise<void> {
  if (Platform.OS === "web") {
    if (token) await AsyncStorage.setItem(SESSION_TOKEN_KEY, token);
    else await AsyncStorage.removeItem(SESSION_TOKEN_KEY);
    return;
  }
  if (token) await SecureStore.setItemAsync(SECURE_SESSION_TOKEN_KEY, token);
  else await SecureStore.deleteItemAsync(SECURE_SESSION_TOKEN_KEY);
}

export function onSessionUnauthorized(listener: () => void): () => void {
  unauthorizedListeners.add(listener);
  return () => { unauthorizedListeners.delete(listener); };
}

export async function invalidateSession(): Promise<void> {
  await setSessionToken(null);
  unauthorizedListeners.forEach((listener) => listener());
}

async function authenticatedRequest<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const token = await getSessionToken();
  if (!token) throw new ApiRequestError("Authentication is required", 401, "UNAUTHORIZED");
  try {
    return await request<T>(path, {
      ...init,
      headers: { Authorization: `Bearer ${token}`, ...init.headers },
    });
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 401) {
      await invalidateSession();
    }
    throw error;
  }
}

export const api = {
  register: (input: { email: string; password: string; displayName: string }) =>
    request<ApiAuthResult>("/auth/register", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  login: (input: { email: string; password: string }) =>
    request<ApiAuthResult>("/auth/login", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  reportClientError: (input: {
    message: string;
    stack?: string;
    componentStack?: string;
    route: string;
    platform: "android" | "ios" | "web" | "unknown";
    appVersion: string;
    clientEventId: string;
  }) => request<{ eventId: string }>("/client-errors", {
    method: "POST",
    body: JSON.stringify(input),
  }),
  logout: () => authenticatedRequest<void>("/auth/logout", { method: "POST" }),
  getProfile: () => authenticatedRequest<ApiUserProfile>("/me/profile"),
  updateProfile: (input: { displayName?: string; bio?: string }) =>
    authenticatedRequest<ApiUserProfile>("/me/profile", {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  getNotificationPreferences: () =>
    authenticatedRequest<ApiNotificationPreferences>("/me/notifications/preferences"),
  updateNotificationPreferences: (input: Partial<ApiNotificationPreferences>) =>
    authenticatedRequest<ApiNotificationPreferences>("/me/notifications/preferences", {
      method: "PATCH",
      body: JSON.stringify(input),
    }),
  registerPushDevice: (input: {
    token: string;
    platform: "android" | "ios";
    deviceName?: string;
  }) => authenticatedRequest<void>("/me/notifications/devices", {
    method: "POST",
    body: JSON.stringify(input),
  }),
  deactivatePushDevice: (token: string) =>
    authenticatedRequest<void>("/me/notifications/devices/deactivate", {
      method: "POST",
      body: JSON.stringify({ token }),
    }),
  listCourses: () => request<ApiCourse[]>("/courses"),
  getCourse: (slug: string) =>
    request<ApiCourseDetails>(`/courses/${encodeURIComponent(slug)}`),
  listTopics: () => request<ApiTopic[]>("/topics"),
  listQuestions: (topicSlug: string, limit = 20) =>
    request<ApiQuestion[]>(
      `/topics/${encodeURIComponent(topicSlug)}/questions?limit=${limit}`,
    ),
  submitAttempt: (input: {
    questionId: string;
    selectedOptionId: string;
    idempotencyKey: string;
    timeSpentSeconds?: number;
  }) =>
    authenticatedRequest<ApiAttemptResult>("/attempts", {
      method: "POST",
      body: JSON.stringify(input),
    }),
  getProgress: () => authenticatedRequest<ApiProgress>("/me/progress"),
  getLeaderboard: (period: ApiLeaderboardPeriod = "weekly", limit = 25) =>
    authenticatedRequest<ApiLeaderboard>(`/leaderboards?period=${period}&limit=${limit}`),
  getAchievements: () => authenticatedRequest<ApiAchievements>("/me/achievements"),
  enroll: (courseId: string) =>
    authenticatedRequest<void>("/me/enrollments", {
      method: "POST",
      body: JSON.stringify({ courseId }),
    }),
  updateLessonProgress: (
    courseSlug: string,
    lessonSlug: string,
    status: "in_progress" | "completed",
  ) =>
    authenticatedRequest<void>(
      `/me/courses/${encodeURIComponent(courseSlug)}/lessons/${encodeURIComponent(lessonSlug)}/progress`,
      {
        method: "PUT",
        body: JSON.stringify({ status }),
      },
    ),
  submitTutorialExercise: (input: {
    exerciseId: string;
    action: "check" | "reveal";
    answer?: string | number | string[];
    hintUsed: boolean;
    idempotencyKey: string;
  }) => {
    const { exerciseId, ...body } = input;
    return authenticatedRequest<ApiTutorialExerciseSubmission>(
      `/me/tutorial-exercises/${encodeURIComponent(exerciseId)}/submissions`,
      { method: "POST", body: JSON.stringify(body) },
    );
  },
  getCurrentMultiplayerMatch: () =>
    authenticatedRequest<ApiMultiplayerMatch | null>("/multiplayer/me/current"),
  createMultiplayerMatch: (input: {
    topicSlug: string;
    questionCount: number;
    roundDurationSeconds: number;
  }) => authenticatedRequest<ApiMultiplayerMatch>("/multiplayer/matches", {
    method: "POST",
    body: JSON.stringify(input),
  }),
  findMultiplayerMatch: (input: {
    topicSlug: string;
    questionCount: number;
    roundDurationSeconds: number;
  }) => authenticatedRequest<ApiMultiplayerMatch>("/multiplayer/matchmaking", {
    method: "POST",
    body: JSON.stringify(input),
  }),
  joinMultiplayerMatch: (code: string) =>
    authenticatedRequest<ApiMultiplayerMatch>("/multiplayer/join", {
      method: "POST",
      body: JSON.stringify({ code }),
    }),
  getMultiplayerMatch: (matchId: string) =>
    authenticatedRequest<ApiMultiplayerMatch>(`/multiplayer/matches/${encodeURIComponent(matchId)}`),
  startMultiplayerMatch: (matchId: string) =>
    authenticatedRequest<ApiMultiplayerMatch>(`/multiplayer/matches/${encodeURIComponent(matchId)}/start`, {
      method: "POST",
    }),
  submitMultiplayerAnswer: (matchId: string, input: {
    questionPosition: number;
    selectedOptionId: string;
    idempotencyKey: string;
  }) => authenticatedRequest<ApiMultiplayerAnswerResult>(
    `/multiplayer/matches/${encodeURIComponent(matchId)}/answers`,
    { method: "POST", body: JSON.stringify(input) },
  ),
  leaveMultiplayerMatch: (matchId: string) =>
    authenticatedRequest<void>(`/multiplayer/matches/${encodeURIComponent(matchId)}/leave`, {
      method: "POST",
    }),
};

export function createIdempotencyKey(): string {
  const bytes = Array.from({ length: 16 }, () => Math.floor(Math.random() * 256));
  bytes[6] = ((bytes[6] ?? 0) & 0x0f) | 0x40;
  bytes[8] = ((bytes[8] ?? 0) & 0x3f) | 0x80;
  const hex = bytes.map((byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
