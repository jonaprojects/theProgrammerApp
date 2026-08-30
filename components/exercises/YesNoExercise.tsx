import { StyleSheet } from "react-native";

import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { View } from "react-native";
import YesNoButton from "@/components/UI/buttons/YesNoButton";

import QuestionHeader from "./QuestionHeader";
import type { ApiQuestionOption } from "@/services/api/types";

type YesNoExerciseProps = {
  question: string;
  options: ApiQuestionOption[];
  selectedOptionId: string | null;
  correctOptionId: string | null;
  revealed: boolean;
  disabled: boolean;
  onSelect: (optionId: string) => void;
  progressLabel: string;
  codeSnippet?: { language: string; code: string };
};
export default function YesNoExercise(props: YesNoExerciseProps) {
  return (
    <>
      <QuestionHeader
        question={props.question}
        codeSnippet={props.codeSnippet}
        progressLabel={props.progressLabel}
      />
      <ThemedView
        darkColor={Colors.dark.cardBackgroundColor}
        lightColor={Colors.light.cardBackgroundColor}
        style={styles.exerciseContainer}
      >
        <View
          style={styles.optionsContainer}
          accessibilityRole="radiogroup"
          accessibilityLabel="אפשרויות תשובה"
        >
          {props.options.map((option) => (
            <YesNoButton
              key={option.id}
              label={option.label}
              selected={props.selectedOptionId === option.id}
              revealed={props.revealed}
              disabled={props.disabled}
              correct={props.correctOptionId === option.id}
              onClick={() => props.onSelect(option.id)}
            />
          ))}
        </View>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  optionsContainer: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
    minHeight: 150,
    width: "100%",
    maxWidth: 840,
    alignSelf: "center",
  },
  exerciseContainer: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 0,
  },
});
