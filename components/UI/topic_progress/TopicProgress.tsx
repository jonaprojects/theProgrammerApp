import React from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedPressable } from "@/components/ThemedPressable";
import { H4, SecondaryText } from "../typography/Typography";
import CircularProgressBar from "@/components/circularProgressBar/CircularProgressBar";
import { Colors } from "@/constants/Colors";

import type { StyleProp, ViewStyle } from "react-native";

type TopicProgressProps = {
  totalNumOfQuestions: number;
  questionsAnswered: number;
  accuracyPercentage?: number;
  masteryPercentage?: number;
  topic: string;
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
};

export default function TopicProgress(props: TopicProgressProps) {
  const { width } = useWindowDimensions();
  const progressSize = width < 480 ? 144 : 180;

  return (
    <ThemedPressable
      darkColor={Colors.dark.cardBackgroundColor}
      lightColor={Colors.light.cardBackgroundColor}
      style={[styles.container, props.style]}
      onPress={props.onPress}
      accessibilityRole="button"
      accessibilityLabel={`${props.topic}, ${props.questionsAnswered} מתוך ${props.totalNumOfQuestions} שאלות נענו, דיוק ${props.accuracyPercentage ?? 0} אחוז, שליטה ${props.masteryPercentage ?? 0} אחוז`}
    >
      <ThemedView style={styles.contentContainer}>
        <H4>{props.topic}</H4>
        <SecondaryText>
          {props.questionsAnswered}/{props.totalNumOfQuestions} שאלות נענו
        </SecondaryText>
        {props.questionsAnswered > 0 ? (
          <SecondaryText style={styles.metrics}>
            דיוק {props.accuracyPercentage ?? 0}% · שליטה {props.masteryPercentage ?? 0}%
          </SecondaryText>
        ) : null}
      </ThemedView>
      <ThemedView
        style={[styles.circularProgressBarContainer, { width: progressSize }]}
      >
        <CircularProgressBar
          completionRatio={props.questionsAnswered / props.totalNumOfQuestions}
          size={progressSize}
          accessibilityLabel={`התקדמות בנושא ${props.topic}`}
        />
      </ThemedView>
    </ThemedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderRadius: 8,
  },
  contentContainer: {
    backgroundColor: "transparent",
    flex: 1,
    minWidth: 0,
    alignItems: "flex-end",
  },
  metrics: {
    marginTop: 6,
    fontSize: 14,
  },
  circularProgressBarContainer: {
    backgroundColor: "transparent",
    flexShrink: 0,
  },
});
