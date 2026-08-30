import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Platform } from "react-native";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api/client";
import type { ApiNotificationPreferences } from "@/services/api/types";

if (Platform.OS !== "web") {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

type PermissionState = "unknown" | "granted" | "denied";
type NotificationsContextValue = {
  loading: boolean;
  busy: boolean;
  supported: boolean;
  registered: boolean;
  permission: PermissionState;
  preferences: ApiNotificationPreferences;
  error: string | null;
  enable: () => Promise<void>;
  disable: () => Promise<void>;
  updatePreference: (key: "multiplayer" | "achievements", value: boolean) => Promise<void>;
};

const defaults: ApiNotificationPreferences = { enabled: true, multiplayer: true, achievements: true };
const NotificationsContext = createContext<NotificationsContextValue | null>(null);

function notificationRoute(data: Record<string, unknown>): string | null {
  const route = data.route;
  if (typeof route !== "string") return null;
  return /^\/multiplayer\/[0-9a-f-]{36}$/.test(route) || route === "/leaderboard" || route === "/profile"
    ? route
    : null;
}

export function NotificationsProvider({ children }: PropsWithChildren) {
  const { status } = useAuth();
  const router = useRouter();
  const currentToken = useRef<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [permission, setPermission] = useState<PermissionState>("unknown");
  const [preferences, setPreferences] = useState(defaults);
  const [error, setError] = useState<string | null>(null);
  const supported = Platform.OS === "android" || Platform.OS === "ios";

  const registerDevice = useCallback(async (askPermission: boolean) => {
    if (!supported) throw new Error("התראות Push זמינות באפליקציה המותקנת בטלפון.");
    if (!Device.isDevice) throw new Error("התראות Push דורשות מכשיר אמיתי ולא סימולטור.");
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("learning-updates", {
        name: "עדכוני למידה ומשחקים",
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 200, 150, 200],
        lightColor: "#00ADB5",
      });
    }
    let permissionResult = await Notifications.getPermissionsAsync();
    if (permissionResult.status !== "granted" && askPermission) {
      permissionResult = await Notifications.requestPermissionsAsync();
    }
    if (permissionResult.status !== "granted") {
      setPermission(permissionResult.canAskAgain ? "unknown" : "denied");
      throw new Error(permissionResult.canAskAgain
        ? "כדי לקבל עדכונים צריך לאשר התראות."
        : "ההתראות חסומות בהגדרות המכשיר. אפשר לאפשר אותן בהגדרות האפליקציה.");
    }
    setPermission("granted");
    const projectId = Constants.easConfig?.projectId ?? Constants.expoConfig?.extra?.eas?.projectId;
    if (!projectId) {
      throw new Error("חסר EAS project ID. יש להריץ eas init ולבנות מחדש את האפליקציה.");
    }
    const pushToken = await Notifications.getExpoPushTokenAsync({ projectId });
    currentToken.current = pushToken.data;
    await api.registerPushDevice({
      token: pushToken.data,
      platform: Platform.OS as "android" | "ios",
      ...(Device.deviceName ? { deviceName: Device.deviceName } : {}),
    });
    setRegistered(true);
  }, [supported]);

  useEffect(() => {
    if (status !== "authenticated") {
      setLoading(status === "loading");
      setRegistered(false);
      currentToken.current = null;
      return;
    }
    let active = true;
    api.getNotificationPreferences()
      .then(async (value) => {
        if (!active) return;
        setPreferences(value);
        if (value.enabled && supported) await registerDevice(false).catch(() => undefined);
      })
      .catch(() => { if (active) setError("לא הצלחנו לטעון את הגדרות ההתראות."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [registerDevice, status, supported]);

  useEffect(() => {
    if (!supported || status !== "authenticated") return;
    const responseSubscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const route = notificationRoute(response.notification.request.content.data);
      if (route) router.push(route as never);
    });
    void Notifications.getLastNotificationResponseAsync().then((response) => {
      const route = response && notificationRoute(response.notification.request.content.data);
      if (route) router.push(route as never);
    });
    const tokenSubscription = Notifications.addPushTokenListener((token) => {
      currentToken.current = token.data;
      void api.registerPushDevice({ token: token.data, platform: Platform.OS as "android" | "ios" });
    });
    return () => {
      responseSubscription.remove();
      tokenSubscription.remove();
    };
  }, [router, status, supported]);

  const enable = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      await registerDevice(true);
      setPreferences(await api.updateNotificationPreferences({ enabled: true }));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "הפעלת ההתראות נכשלה.");
    } finally {
      setBusy(false);
    }
  }, [registerDevice]);

  const disable = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      if (currentToken.current) await api.deactivatePushDevice(currentToken.current);
      setPreferences(await api.updateNotificationPreferences({ enabled: false }));
      setRegistered(false);
    } catch {
      setError("כיבוי ההתראות נכשל. נסו שוב.");
    } finally {
      setBusy(false);
    }
  }, []);

  const updatePreference = useCallback(async (key: "multiplayer" | "achievements", value: boolean) => {
    const previous = preferences;
    setPreferences((current) => ({ ...current, [key]: value }));
    setError(null);
    try {
      setPreferences(await api.updateNotificationPreferences({ [key]: value }));
    } catch {
      setPreferences(previous);
      setError("שמירת העדפת ההתראות נכשלה.");
    }
  }, [preferences]);

  return (
    <NotificationsContext.Provider value={{
      loading, busy, supported, registered, permission, preferences, error,
      enable, disable, updatePreference,
    }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications(): NotificationsContextValue {
  const value = useContext(NotificationsContext);
  if (!value) throw new Error("useNotifications must be used inside NotificationsProvider");
  return value;
}
