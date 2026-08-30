import { createContext, type PropsWithChildren, useCallback, useContext, useEffect, useState } from "react";
import { ApiRequestError, api, getSessionToken, onSessionUnauthorized, setSessionToken } from "@/services/api/client";
import type { ApiUserProfile } from "@/services/api/types";
import { clearCachedProfile, readCachedProfile, writeCachedProfile } from "@/services/offline/profileCache";
import { offlineLearning } from "@/services/offline/learning";

type Credentials = { email: string; password: string };
type Registration = Credentials & { displayName: string };

type AuthContextValue = {
  status: "loading" | "authenticated" | "unauthenticated";
  user: ApiUserProfile | null;
  login: (input: Credentials) => Promise<void>;
  register: (input: Registration) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (input: { displayName?: string; bio?: string }) => Promise<ApiUserProfile>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [status, setStatus] = useState<AuthContextValue["status"]>("loading");
  const [user, setUser] = useState<ApiUserProfile | null>(null);

  useEffect(() => onSessionUnauthorized(() => {
    void clearCachedProfile();
    setUser(null);
    setStatus("unauthenticated");
  }), []);

  useEffect(() => {
    let active = true;
    getSessionToken()
      .then(async (token) => {
        if (!token) return null;
        try {
          const profile = await api.getProfile();
          await writeCachedProfile(profile);
          return profile;
        } catch (error) {
          if (error instanceof ApiRequestError && error.status < 500 && error.status !== 429) throw error;
          const cached = await readCachedProfile();
          if (cached) return cached;
          throw error;
        }
      })
      .then((profile) => {
        if (!active) return;
        setUser(profile);
        setStatus(profile ? "authenticated" : "unauthenticated");
      })
      .catch(async () => {
        await setSessionToken(null);
        if (active) {
          setUser(null);
          setStatus("unauthenticated");
        }
      });
    return () => { active = false; };
  }, []);

  const acceptSession = useCallback(async (result: { token: string; user: ApiUserProfile }) => {
    await setSessionToken(result.token);
    await writeCachedProfile(result.user);
    setUser(result.user);
    setStatus("authenticated");
  }, []);

  const login = useCallback(async (input: Credentials) => acceptSession(await api.login(input)), [acceptSession]);
  const register = useCallback(async (input: Registration) => acceptSession(await api.register(input)), [acceptSession]);
  const logout = useCallback(async () => {
    try { await api.logout(); } finally {
      if (user) await offlineLearning.clearUserData(user.id);
      await clearCachedProfile();
      await setSessionToken(null);
      setUser(null);
      setStatus("unauthenticated");
    }
  }, [user]);
  const updateProfile = useCallback(async (input: { displayName?: string; bio?: string }) => {
    const profile = await api.updateProfile(input);
    await writeCachedProfile(profile);
    setUser(profile);
    return profile;
  }, []);

  return (
    <AuthContext.Provider value={{ status, user, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
