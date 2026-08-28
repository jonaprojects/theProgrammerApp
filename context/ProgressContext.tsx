import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useState } from "react";
import { api } from "@/services/api/client";
import type { ApiProgress } from "@/services/api/types";
import { useAuth } from "@/context/AuthContext";

type ProgressContextValue = {
  progress: ApiProgress | null;
  loading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: PropsWithChildren) {
  const { status } = useAuth();
  const [progress, setProgress] = useState<ApiProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    if (status !== "authenticated") {
      setProgress(null);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    try {
      setProgress(await api.getProgress());
      setError(null);
    } catch (reason) {
      setError(reason instanceof Error ? reason : new Error(String(reason)));
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <ProgressContext.Provider value={{ progress, loading, error, refresh }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const value = useContext(ProgressContext);
  if (!value) throw new Error("useProgress must be used inside ProgressProvider");
  return value;
}
