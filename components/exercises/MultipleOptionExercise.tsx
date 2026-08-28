import React from "react";
import { View, StyleSheet } from "react-native";
import QuestionHeader from "./QuestionHeader";
import Option from "./Option";
import Container from "../UI/Container";
import type { ApiQuestionOption } from "@/services/api/types";

type MultipleOptionExerciseProps = {
  question: string;
  options: ApiQuestionOption[];
  correctOptionId: string | null;
  selectedOptionId: string | null;
  revealed: boolean;
  disabled: boolean;
  onSelect: (optionId: string) => void;
  progressLabel: string;
  codeSnippet?: { language: string; code: string };
};

export default function MultipleOptionExercise(
  props: MultipleOptionExerciseProps
) {
  return (
    <View>
      <QuestionHeader
        question={props.question}
        codeSnippet={props.codeSnippet}
        progressLabel={props.progressLabel}
      />

      <Container style={styles.optionsWrapper}>
        <View style={styles.optionsContainer}>
          {props.options.map((option, index) => (
            <Option
              key={option.id}
              text={option.label}
              index={index}
              selected={props.selectedOptionId === option.id}
              correct={props.correctOptionId === option.id}
              revealed={props.revealed}
              disabled={props.disabled}
              onPress={() => props.onSelect(option.id)}
            />
          ))}
        </View>
      </Container>
    </View>
  );
}

const styles = StyleSheet.create({
  optionsWrapper: {
    width: "100%",
    maxWidth: 840,
    alignSelf: "center",
    paddingHorizontal: 20,
  },
  optionsContainer: {
    marginTop: 28,
    gap: 16,
  },
});
