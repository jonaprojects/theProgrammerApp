import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { API_BASE_URL, ApiRequestError, api } from "@/services/api/client";
import type { ApiCourse, ApiCourseDetails, ApiProgress } from "@/services/api/types";
import {
  applyLessonProgress,
  compactLessonProgressQueue,
  type LessonProgressStatus,
  type PendingLessonProgress,
} from "./logic";

type CacheEnvelope<T> = { version: 1; savedAt: string; data: T };
export type OfflineResult<T> = { data: T; source: "network" | "cache"; savedAt: string };

const namespace = `the-programmer:offline:v1:${API_BASE_URL}`;
const catalogKey = `${namespace}:catalog`;
const courseKey = (slug: string) => `${namespace}:course:${slug}`;
const progressKey = (userId: string) => `${namespace}:progress:${userId}`;
const queueKey = (userId: string) => `${namespace}:lesson-progress-queue:${userId}`;

export class OfflineCacheMissError extends Error {
  constructor() {
    super("The requested content has not been saved for offline access yet");
    this.name = "OfflineCacheMissError";
  }
}

async function writeCache<T>(key: string, data: T): Promise<CacheEnvelope<T>> {
  const envelope: CacheEnvelope<T> = { version: 1, savedAt: new Date().toISOString(), data };
  await AsyncStorage.setItem(key, JSON.stringify(envelope));
  return envelope;
}

async function readCache<T>(key: string): Promise<CacheEnvelope<T> | null> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return null;
  try {
    const envelope = JSON.parse(raw) as CacheEnvelope<T>;
    return envelope.version === 1 && envelope.savedAt && envelope.data ? envelope : null;
  } catch {
    await AsyncStorage.removeItem(key);
    return null;
  }
}

async function isDefinitelyOffline(): Promise<boolean> {
  const state = await NetInfo.fetch();
  return state.isConnected === false || state.isInternetReachable === false;
}

function canUseOfflineFallback(error: unknown): boolean {
  return !(error instanceof ApiRequestError) || error.status === 429 || error.status >= 500;
}

async function networkFirst<T>(
  key: string,
  request: () => Promise<T>,
): Promise<OfflineResult<T>> {
  if (!await isDefinitelyOffline()) {
    try {
      const envelope = await writeCache(key, await request());
      return { data: envelope.data, source: "network", savedAt: envelope.savedAt };
    } catch (error) {
      if (!canUseOfflineFallback(error)) throw error;
    }
  }
  const cached = await readCache<T>(key);
  if (!cached) throw new OfflineCacheMissError();
  return { data: cached.data, source: "cache", savedAt: cached.savedAt };
}

async function readQueue(userId: string): Promise<PendingLessonProgress[]> {
  return (await readCache<PendingLessonProgress[]>(queueKey(userId)))?.data ?? [];
}

async function writeQueue(userId: string, queue: PendingLessonProgress[]): Promise<void> {
  if (queue.length === 0) await AsyncStorage.removeItem(queueKey(userId));
  else await writeCache(queueKey(userId), queue);
}

async function cacheOptimisticProgress(userId: string, change: PendingLessonProgress): Promise<ApiProgress | null> {
  const cached = await readCache<ApiProgress>(progressKey(userId));
  if (!cached) return null;
  const progress = applyLessonProgress(cached.data, change);
  await writeCache(progressKey(userId), progress);
  return progress;
}

export const offlineLearning = {
  listCourses: () => networkFirst<ApiCourse[]>(catalogKey, api.listCourses),
  getCourse: (slug: string) => networkFirst<ApiCourseDetails>(courseKey(slug), () => api.getCourse(slug)),
  getProgress: (userId: string) => networkFirst<ApiProgress>(progressKey(userId), api.getProgress),

  async warmEnrolledCourses(progress: ApiProgress): Promise<void> {
    if (await isDefinitelyOffline()) return;
    await Promise.all(progress.enrollments.map(({ courseSlug }) =>
      this.getCourse(courseSlug).catch(() => undefined)));
  },

  async recordLessonProgress(
    userId: string,
    courseSlug: string,
    lessonSlug: string,
    status: LessonProgressStatus,
  ): Promise<{ queued: boolean; progress: ApiProgress | null }> {
    const change: PendingLessonProgress = {
      courseSlug,
      lessonSlug,
      status,
      updatedAt: new Date().toISOString(),
    };
    if (!await isDefinitelyOffline()) {
      try {
        await api.updateLessonProgress(courseSlug, lessonSlug, status);
        return { queued: false, progress: await cacheOptimisticProgress(userId, change) };
      } catch (error) {
        if (!canUseOfflineFallback(error)) throw error;
      }
    }
    const queue = compactLessonProgressQueue(await readQueue(userId), change);
    await writeQueue(userId, queue);
    return { queued: true, progress: await cacheOptimisticProgress(userId, change) };
  },

  async flushLessonProgress(userId: string): Promise<number> {
    if (await isDefinitelyOffline()) return 0;
    let queue = await readQueue(userId);
    let synced = 0;
    while (queue.length > 0) {
      const change = queue[0]!;
      try {
        await api.updateLessonProgress(change.courseSlug, change.lessonSlug, change.status);
      } catch (error) {
        if (canUseOfflineFallback(error)) break;
        if (error instanceof ApiRequestError && (error.status === 400 || error.status === 404)) {
          queue = queue.slice(1);
          await writeQueue(userId, queue);
          continue;
        }
        throw error;
      }
      queue = queue.slice(1);
      synced += 1;
      await writeQueue(userId, queue);
    }
    return synced;
  },

  async pendingLessonProgressCount(userId: string): Promise<number> {
    return (await readQueue(userId)).length;
  },

  async clearUserData(userId: string): Promise<void> {
    await AsyncStorage.multiRemove([progressKey(userId), queueKey(userId)]);
  },
};
