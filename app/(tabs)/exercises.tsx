import { Image, StyleSheet, Platform, View, Text } from "react-native";
import { useRootNavigationState, Redirect, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { useEffect, useState } from "react";
import Body from "@/components/UI/Body";
import { Colors } from "@/constants/Colors";
import { H1, H2 } from "@/components/UI/typography/Typography";
import TopicProgress from "@/components/UI/topic_progress/TopicProgress";
import { ScrollView } from "react-native";
import Navbar from "@/components/UI/Navbar";

export default function ExerciseScreen() {
  const [completedOnboarding, setCompletedOnboarding] = useState<string | null>(
    null
  );

  useEffect(() => {
    async function checkCompletedOnboarding() {
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
      <Navbar />
      <ScrollView style={{ flex: 1 }}>
        <H2 style={{ textAlign: "center", marginVertical: 32 }}>
          תרגלת כבר היום?
        </H2>
        <TopicProgress
          topic="תכנות מונחה עצמים"
          totalNumOfQuestions={25}
          questionsAnswered={10}
          style={{ marginBottom: 8 }}
          onPress={() => {
            router.navigate("/exercise?topic=oop");
          }}
        />
        <TopicProgress
          topic="פיתוח אתרים"
          totalNumOfQuestions={37}
          questionsAnswered={12}
          style={{ marginBottom: 8 }}
          onPress={() => {
            router.navigate("/exercise?topic=webdev");
          }}
        />
        <TopicProgress
          topic="פייתון"
          totalNumOfQuestions={41}
          questionsAnswered={6}
          style={{ marginBottom: 8 }}
          onPress={() => {
            router.navigate("/exercise?topic=python");
          }}
        />
        <TopicProgress
          topic="תקשורת ורשתות"
          totalNumOfQuestions={15}
          questionsAnswered={9}
          style={{ marginBottom: 8 }}
          onPress={() => {
            router.navigate("/exercise?topic=networks");
          }}
        />
        <TopicProgress
          topic="שפת C"
          totalNumOfQuestions={41}
          questionsAnswered={4}
          style={{ marginBottom: 8 }}
          onPress={() => {
            router.navigate("/exercise?topic=clang");
          }}
        />
        <TopicProgress
          topic="שפת אסמבלי"
          totalNumOfQuestions={26}
          questionsAnswered={1}
          style={{ marginBottom: 8 }}
          onPress={() => {
            router.navigate("/exercise?topic=assembly");
          }}
        />
      </ScrollView>
    </Body>
  );
}
