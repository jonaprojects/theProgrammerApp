import { Image, StyleSheet, Platform, View, Text } from "react-native";
import { useRootNavigationState, Redirect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import Body from "@/components/UI/Body";
import CircularProgressBar from "@/components/circularProgressBar/CircularProgressBar";

export default function HomeScreen() {
  const [completedOnboarding, setCompletedOnboarding] = useState<string | null>(
    null
  );

  useEffect(() => {
    async function checkCompletedOnboarding() {
      console.log("Running this");
      try {
        const value = await AsyncStorage.getItem("Completed_Onboarding");
        setCompletedOnboarding(value);
      } catch (e) {
        // error reading value
      }
    }

    checkCompletedOnboarding();
  }, []);
  const rootNavigationState = useRootNavigationState();

  if (!rootNavigationState?.key) return null;

  if (completedOnboarding === "false") {
    return <Redirect href="/onboarding/new_questions" />;
  }

  return (
   <Body>
    <CircularProgressBar completionRatio={0.5}/>
   </Body>
  );
}
