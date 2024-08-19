import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import QuestionHeader from "./QuestionHeader";
import Option from "./Option";
import Container from "../UI/Container";
import PrimaryButton from "../UI/buttons/PrimaryButton";
import SecondaryButton from "../UI/buttons/SecondaryButton";

type MultipleOptionExerciseProps = {
  question: string;
  questionID: number;
  options: [string, string, string, string];
};

export default function MultipleOptionExercise(
  props: MultipleOptionExerciseProps
) {
  return (
    <View>
      <View style={styles.questionHeaderContainer}>
        <QuestionHeader question={props.question} />
      </View>

      <ScrollView >
        <Container >
          <View style={styles.optionsContainer}>
            <Option text={props.options[0]} index={0} />
            <Option text={props.options[1]} index={1} />
            <Option text={props.options[2]} index={2} />
            <Option text={props.options[3]} index={3} />
          </View>

          <View style={styles.buttonsContainer}>
            <PrimaryButton height={56} textStyle={{ fontSize: 18 }}>
              הצג פתרון
            </PrimaryButton>
            <SecondaryButton height={56} textStyle={{ fontSize: 18 }}>
              דלג
            </SecondaryButton>
          </View>
        </Container>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  questionHeaderContainer: {
    height: 250,
  },
  optionsContainer: {
    marginTop: 36,
    gap: 16,
  },
  buttonsContainer: {
    gap: 8,
    marginTop: 36,
  },
});
