import React, { useEffect, useReducer, useState } from "react";
import {
  StyleSheet,
  View,
  I18nManager,
  ActivityIndicator,
  useColorScheme,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { Image } from "expo-image";

import Navbar from "@/components/UI/Navbar";
import Body from "@/components/UI/Body";
import MultipleOptionExercise from "@/components/exercises/MultipleOptionExercise";
import { loadQuestions } from "@/data/questions/loadData";
import {
  MultipleChoiceQuestion,
  Question,
  Questions,
  YesNoQuestion,
} from "@/data/questions/models";
import { Colors } from "@/constants/Colors";
import { getShuffledOptions } from "@/data/questions/processData";
import YesNoExercise from "@/components/exercises/YesNoExercise";
import PrimaryButton from "@/components/UI/buttons/PrimaryButton";
import SecondaryButton from "@/components/UI/buttons/SecondaryButton";
import Container from "@/components/UI/Container";

I18nManager.forceRTL(false); // Forces LTR layout

interface ExerciseSearchParams {
  topic: string;
}

export default function Exercise() {
  const params = useLocalSearchParams();
  const colorScheme = useColorScheme();

  // Use type assertion to specify the type of `params`
  const { topic } = params as unknown as ExerciseSearchParams;

  const [questions, setQuestions] = useState<Questions | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown | null>(null);

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  // load the questions when the component is loaded
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await loadQuestions(topic);
        setQuestions(res);
      } catch (e) {
        setError(e);
      }
    };
    setLoading(true); // Start loading
    loadData();
    setLoading(false); // Finish loading

    // We want to repeat this each time the URL parameters change!
  }, [params]);

  const onSkipHandler = () => {
    if (!questions) {
      //TODO: Show some kind of error message
      return;
    }
    setCurrentQuestionIndex((prevIndex) => {
      if (prevIndex < questions.length) {
        return prevIndex + 1;
      }
      return prevIndex;
    });
  };

  let currentQuestion = null;
  if (questions !== null && !loading && !error) {
    currentQuestion = questions[currentQuestionIndex];
  }

  let currentQuestionJSX = null;

  if (currentQuestion !== null) {
    if (currentQuestion.type === "multiple") {
      const multipleQuestionObj = currentQuestion as MultipleChoiceQuestion;

      const [shuffledArray, correctIndex] = getShuffledOptions(
        multipleQuestionObj.correctAnswer,
        multipleQuestionObj.incorrectAnswers
      );
      currentQuestionJSX = (
        <MultipleOptionExercise
          question={multipleQuestionObj.question}
          questionID={multipleQuestionObj.id}
          options={shuffledArray}
        />
      );
    } else {
      const yesNoQuestion = currentQuestion as YesNoQuestion;
      currentQuestionJSX = (
        <YesNoExercise
          question={yesNoQuestion.question}
          correctAnswer={yesNoQuestion.correctAnswer}
          questionID={yesNoQuestion.id}
          userAnswered={false}
        />
      );
    }
  }

  return (
    <Body>
      <Navbar />
      <ScrollView>
        {loading && (
          <View style={styles.loadingSpinnerContainer}>
            <ActivityIndicator
              size="large"
              color={Colors[colorScheme ?? "dark"].primary}
            />
          </View>
        )}
        {!loading && !error && currentQuestionJSX !== null && (
          <View
            style={{
              flex: 1,
            }}
          >
            {currentQuestionJSX}
            <Container>
              <View style={styles.buttonsContainer}>
                <PrimaryButton height={56} textStyle={{ fontSize: 18 }}>
                  הצג פתרון
                </PrimaryButton>
                <SecondaryButton
                  height={56}
                  textStyle={{ fontSize: 18 }}
                  onPress={onSkipHandler}
                >
                  דלג
                </SecondaryButton>
              </View>
            </Container>
          </View>
        )}

        {/* <YesNoExercise
          correctAnswer="yes"
          question="פייתון פותחה בשנות ה-50 של המאה ה-20 על ידי מדען המחשב דניס ריצ'י."
          questionID={0}
          userAnswered={false}
        /> */}
      </ScrollView>
    </Body>
  );
}

const styles = StyleSheet.create({
  loadingSpinnerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonsContainer: {
    gap: 8,
    marginTop: 36,
  },
});
