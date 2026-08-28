import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import type {
  ApiAttemptResult,
  ApiAuthResult,
  ApiCourse,
  ApiCourseDetails,
  ApiEnvelope,
  ApiProgress,
  ApiQuestion,
  ApiTopic,
  ApiUserProfile,
} from "./types";

const configuredUrl = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "");
export const API_BASE_URL =
  configuredUrl ??
  (Platform.OS === "android"
    ? "http://10.0.2.2:3000/api/v1"
    : "http://localhost:3000/api/v1");

const SESSION_TOKEN_KEY = `the-programmer:session:${API_BASE_URL}`;
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
  return AsyncStorage.getItem(SESSION_TOKEN_KEY);
}

export async function setSessionToken(token: string | null): Promise<void> {
  if (token) await AsyncStorage.setItem(SESSION_TOKEN_KEY, token);
  else await AsyncStorage.removeItem(SESSION_TOKEN_KEY);
}

export function onSessionUnauthorized(listener: () => void): () => void {
  unauthorizedListeners.add(listener);
  return () => { unauthorizedListeners.delete(listener); };
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
      await setSessionToken(null);
      unauthorizedListeners.forEach((listener) => listener());
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
  logout: () => authenticatedRequest<void>("/auth/logout", { method: "POST" }),
  getProfile: () => authenticatedRequest<ApiUserProfile>("/me/profile"),
  updateProfile: (input: { displayName?: string; bio?: string }) =>
    authenticatedRequest<ApiUserProfile>("/me/profile", {
      method: "PATCH",
      body: JSON.stringify(input),
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
};

export function createIdempotencyKey(): string {
  const bytes = Array.from({ length: 16 }, () => Math.floor(Math.random() * 256));
  bytes[6] = ((bytes[6] ?? 0) & 0x0f) | 0x40;
  bytes[8] = ((bytes[8] ?? 0) & 0x3f) | 0x80;
  const hex = bytes.map((byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
