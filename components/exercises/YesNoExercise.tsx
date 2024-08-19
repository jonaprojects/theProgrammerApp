import { StyleSheet, Image, Platform } from "react-native";

import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { H4 } from "@/components/UI/typography/Typography";
import PrimaryButton from "@/components/UI/buttons/PrimaryButton";
import SecondaryButton from "@/components/UI/buttons/SecondaryButton";
import { View } from "react-native";
import YesNoButton from "@/components/UI/buttons/YesNoButton";

import { I18nManager } from "react-native";
import QuestionHeader from "./QuestionHeader";

I18nManager.forceRTL(false); // Forces LTR layout

type YesNoExerciseProps = {
  question: string;
  correctAnswer: "yes" | "no";
  questionID: number;
  userAnswered: boolean;
};
export default function YesNoExercise(props: YesNoExerciseProps) {
  return (
    <>
      <View style={styles.questionHeaderContainer}>
        <QuestionHeader question={props.question}></QuestionHeader>
      </View>
      <ThemedView
        darkColor={Colors.dark.cardBackgroundColor}
        lightColor={Colors.light.cardBackgroundColor}
        style={styles.exerciseContainer}
      >
        <View style={styles.optionsContainer}>
          <YesNoButton
            type="yes"
            userAnswered={props.userAnswered}
            questionId={props.questionID}
            correctAnswer={props.correctAnswer}
          />
          <YesNoButton
            type="no"
            userAnswered={props.userAnswered}
            questionId={props.questionID}
            correctAnswer={props.correctAnswer}
          />
        </View>
        <View style={styles.buttonsContainer}>
          <PrimaryButton>הצג פתרון</PrimaryButton>
          <SecondaryButton>דלג</SecondaryButton>
        </View>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  buttonsContainer: {
    gap: 8,
  },
  optionsContainer: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
    height: 150,
  },
  title: {},

  exerciseContainer: {
    gap: 48,
    paddingHorizontal: 16,
    paddingVertical: 64,
  },
  questionHeaderContainer: {
    maxHeight: 300,
    minHeight: 200,
  },
});
