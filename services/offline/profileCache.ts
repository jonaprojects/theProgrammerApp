import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { API_BASE_URL } from "@/services/api/client";
import type { ApiUserProfile } from "@/services/api/types";

const key = `the-programmer:offline-profile:${API_BASE_URL}`;
const secureKey = key.replace(/[^A-Za-z0-9._-]/g, "_");

export async function readCachedProfile(): Promise<ApiUserProfile | null> {
  const value = Platform.OS === "web"
    ? await AsyncStorage.getItem(key)
    : await SecureStore.getItemAsync(secureKey);
  if (!value) return null;
  try {
    const profile = JSON.parse(value) as ApiUserProfile;
    return profile?.id && profile?.displayName ? profile : null;
  } catch {
    return null;
  }
}

export async function writeCachedProfile(profile: ApiUserProfile): Promise<void> {
  const value = JSON.stringify(profile);
  if (Platform.OS === "web") await AsyncStorage.setItem(key, value);
  else await SecureStore.setItemAsync(secureKey, value);
}

export async function clearCachedProfile(): Promise<void> {
  if (Platform.OS === "web") await AsyncStorage.removeItem(key);
  else await SecureStore.deleteItemAsync(secureKey);
}
