import { createContext, type PropsWithChildren, useCallback, useContext, useEffect, useState } from "react";
import { api, getSessionToken, onSessionUnauthorized, setSessionToken } from "@/services/api/client";
import type { ApiUserProfile } from "@/services/api/types";

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
    setUser(null);
    setStatus("unauthenticated");
  }), []);

  useEffect(() => {
    let active = true;
    getSessionToken()
      .then(async (token) => token ? api.getProfile() : null)
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
    setUser(result.user);
    setStatus("authenticated");
  }, []);

  const login = useCallback(async (input: Credentials) => acceptSession(await api.login(input)), [acceptSession]);
  const register = useCallback(async (input: Registration) => acceptSession(await api.register(input)), [acceptSession]);
  const logout = useCallback(async () => {
    try { await api.logout(); } finally {
      await setSessionToken(null);
      setUser(null);
      setStatus("unauthenticated");
    }
  }, []);
  const updateProfile = useCallback(async (input: { displayName?: string; bio?: string }) => {
    const profile = await api.updateProfile(input);
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
