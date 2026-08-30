import NetInfo from "@react-native-community/netinfo";
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import type { ApiProgress } from "@/services/api/types";
import { useAuth } from "@/context/AuthContext";
import { offlineLearning } from "@/services/offline/learning";
import type { LessonProgressStatus } from "@/services/offline/logic";

type ProgressContextValue = {
  progress: ApiProgress | null;
  loading: boolean;
  error: Error | null;
  isOffline: boolean;
  pendingChanges: number;
  refresh: () => Promise<void>;
  recordLessonProgress: (
    courseSlug: string,
    lessonSlug: string,
    status: LessonProgressStatus,
  ) => Promise<{ queued: boolean }>;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: PropsWithChildren) {
  const { status, user } = useAuth();
  const [progress, setProgress] = useState<ApiProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [pendingChanges, setPendingChanges] = useState(0);
  const synchronizing = useRef(false);

  const refresh = useCallback(async () => {
    if (status !== "authenticated" || !user) {
      setProgress(null);
      setLoading(false);
      setError(null);
      setIsOffline(false);
      setPendingChanges(0);
      return;
    }
    setLoading(true);
    try {
      const result = await offlineLearning.getProgress(user.id);
      setProgress(result.data);
      setIsOffline(result.source === "cache");
      setPendingChanges(await offlineLearning.pendingLessonProgressCount(user.id));
      if (result.source === "network") void offlineLearning.warmEnrolledCourses(result.data);
      setError(null);
    } catch (reason) {
      setError(reason instanceof Error ? reason : new Error(String(reason)));
    } finally {
      setLoading(false);
    }
  }, [status, user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const synchronize = useCallback(async () => {
    if (status !== "authenticated" || !user || synchronizing.current) return;
    synchronizing.current = true;
    try {
      await offlineLearning.flushLessonProgress(user.id);
      await refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason : new Error(String(reason)));
    } finally {
      synchronizing.current = false;
    }
  }, [refresh, status, user]);

  useEffect(() => NetInfo.addEventListener((state) => {
    const offline = state.isConnected === false || state.isInternetReachable === false;
    if (offline) {
      setIsOffline(true);
      return;
    }
    void synchronize();
  }), [synchronize]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active") void synchronize();
    });
    return () => subscription.remove();
  }, [synchronize]);

  const recordLessonProgress = useCallback(async (
    courseSlug: string,
    lessonSlug: string,
    lessonStatus: LessonProgressStatus,
  ) => {
    if (!user) throw new Error("Authentication is required");
    const result = await offlineLearning.recordLessonProgress(user.id, courseSlug, lessonSlug, lessonStatus);
    if (result.progress) setProgress(result.progress);
    setIsOffline(result.queued);
    setPendingChanges(await offlineLearning.pendingLessonProgressCount(user.id));
    if (!result.queued) await refresh();
    return { queued: result.queued };
  }, [refresh, user]);

  return (
    <ProgressContext.Provider value={{
      progress, loading, error, isOffline, pendingChanges, refresh, recordLessonProgress,
    }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const value = useContext(ProgressContext);
  if (!value) throw new Error("useProgress must be used inside ProgressProvider");
  return value;
}
