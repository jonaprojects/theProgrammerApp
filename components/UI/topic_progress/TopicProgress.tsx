import React from "react";
import { StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedPressable } from "@/components/ThemedPressable";
import { H4, SecondaryText } from "../typography/Typography";
import CircularProgressBar from "@/components/circularProgressBar/CircularProgressBar";
import { Colors } from "@/constants/Colors";

import type { StyleProp, ViewStyle } from "react-native";

type TopicProgressProps = {
  totalNumOfQuestions: number;
  questionsAnswered: number;
  topic: string;
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
};

export default function TopicProgress(props: TopicProgressProps) {
  return (
    <ThemedPressable
      darkColor={Colors.dark.cardBackgroundColor}
      lightColor={Colors.light.cardBackgroundColor}
      style={[styles.container, props.style]}
      onPress={props.onPress}
    >
      <ThemedView style={styles.contentContainer}>
        <H4>{props.topic}</H4>
        <SecondaryText>
          {props.questionsAnswered}/{props.totalNumOfQuestions} שאלות נענו
        </SecondaryText>
      </ThemedView>
      <ThemedView style={styles.circularProgressBarContainer}>
        <CircularProgressBar
          completionRatio={props.questionsAnswered / props.totalNumOfQuestions}
        />
      </ThemedView>
    </ThemedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  contentContainer: {
    backgroundColor: "transparent",
    flex: 1,
  },
  circularProgressBarContainer: {
    backgroundColor: "transparent",
    flex: 1,
  },
});
