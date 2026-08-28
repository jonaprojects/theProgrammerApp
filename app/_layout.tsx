import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import {
  Inter_900Black,
  Inter_400Regular,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import {
  Heebo_400Regular,
  Heebo_500Medium,
  Heebo_700Bold,
  Heebo_900Black,
} from "@expo-google-fonts/heebo";
import { JetBrainsMono_400Regular } from "@expo-google-fonts/jetbrains-mono";

import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";

// Force LTR
import { I18nManager } from "react-native";
import { ProgressProvider } from "@/context/ProgressContext";
import { AuthProvider, useAuth } from "@/context/AuthContext";
I18nManager.forceRTL(false);
I18nManager.allowRTL(false);

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Loading the fonts and the color scheme
  const colorScheme = useColorScheme();

  const [loaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
    Inter_900Black,
    Heebo_400Regular,
    Heebo_500Medium,
    Heebo_700Bold,
    Heebo_900Black,
    JetBrainsMono_400Regular,
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <ProgressProvider>
          <AuthenticatedNavigator />
        </ProgressProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

function AuthenticatedNavigator() {
  const { status } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const isAuthScreen = segments[0] === "auth";

  useEffect(() => {
    if (status === "loading") return;
    if (status === "unauthenticated" && !isAuthScreen) router.replace("/auth");
    if (status === "authenticated" && isAuthScreen) router.replace("/");
  }, [isAuthScreen, router, status]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="auth" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
