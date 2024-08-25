import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  I18nManager,
  ActivityIndicator,
  useColorScheme,
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
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
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

  useEffect(() => {
    if (!loading && !error && questions !== null) {
      const questionIndex = 0;
      const questionObj = questions[questionIndex];
      setCurrentQuestion(questionObj);
    }
  }, [questions]);

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
        </View>
      )}

      {/* <YesNoExercise
          correctAnswer="yes"
          question="פייתון פותחה בשנות ה-50 של המאה ה-20 על ידי מדען המחשב דניס ריצ'י."
          questionID={0}
          userAnswered={false}
        /> */}
    </Body>
  );
}

const styles = StyleSheet.create({
  loadingSpinnerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
