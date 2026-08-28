import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, useColorScheme, View } from "react-native";

import Body from "@/components/UI/Body";
import Container from "@/components/UI/Container";
import Navbar from "@/components/UI/Navbar";
import PrimaryButton from "@/components/UI/buttons/PrimaryButton";
import SecondaryButton from "@/components/UI/buttons/SecondaryButton";
import { H3, H5, P, SecondaryText } from "@/components/UI/typography/Typography";
import MultipleOptionExercise from "@/components/exercises/MultipleOptionExercise";
import YesNoExercise from "@/components/exercises/YesNoExercise";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { useProgress } from "@/context/ProgressContext";
import {
  createExerciseSession,
  attemptResultMatchesSubmission,
  currentQuestion as getCurrentQuestion,
  currentResponse as getCurrentResponse,
  exerciseSessionReducer,
  restoreExerciseSession,
  summarizeExerciseSession,
  type ExerciseSessionAction,
  type ExerciseSessionState,
} from "@/features/exercises/session";
import { api, createIdempotencyKey } from "@/services/api/client";

const SESSION_LIMIT = 50;
const SESSION_STORAGE_PREFIX = "the-programmer:exercise-session:v1:";

function getTopicParam(value: string | string[] | undefined): string | null {
  const topic = Array.isArray(value) ? value[0] : value;
  return topic?.trim() || null;
}

export default function Exercise() {
  const params = useLocalSearchParams<{ topic?: string | string[] }>();
  const topic = getTopicParam(params.topic);
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const { refresh: refreshProgress } = useProgress();
  const scrollRef = useRef<ScrollView>(null);
  const questionShownAt = useRef(Date.now());
  const loadRequestId = useRef(0);
  const [session, setSession] = useState<ExerciseSessionState | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [restored, setRestored] = useState(false);
  const [persistenceWarning, setPersistenceWarning] = useState(false);

  useEffect(() => navigation.setOptions({ headerShown: false }), [navigation]);

  const updateSession = useCallback((action: ExerciseSessionAction) => {
    setSession((previous) => previous ? exerciseSessionReducer(previous, action) : previous);
  }, []);

  const loadExercise = useCallback(async (allowRestore: boolean) => {
    const requestId = ++loadRequestId.current;
    if (!topic) {
      setLoadError(true);
      setLoading(false);
      return;
    }
    setLoading(true);
    setLoadError(false);
    setPersistenceWarning(false);
    try {
      const storageKey = `${SESSION_STORAGE_PREFIX}${topic}`;
      if (allowRestore) {
        const serialized = await AsyncStorage.getItem(storageKey).catch(() => {
          setPersistenceWarning(true);
          return null;
        });
        const saved = restoreExerciseSession(serialized, topic);
        if (requestId !== loadRequestId.current) return;
        if (saved) {
          setSession(saved);
          setRestored(!saved.finished);
          questionShownAt.current = Date.now();
          return;
        }
      }
      const fresh = createExerciseSession(topic, await api.listQuestions(topic, SESSION_LIMIT));
      if (requestId !== loadRequestId.current) return;
      setSession(fresh);
      setRestored(false);
      questionShownAt.current = Date.now();
      await AsyncStorage.setItem(storageKey, JSON.stringify(fresh)).catch(() => {
        setPersistenceWarning(true);
      });
    } catch {
      if (requestId !== loadRequestId.current) return;
      setSession(null);
      setLoadError(true);
    } finally {
      if (requestId === loadRequestId.current) setLoading(false);
    }
  }, [topic]);

  useEffect(() => { void loadExercise(true); }, [loadExercise]);

  useEffect(() => {
    if (!session || !topic) return;
    AsyncStorage.setItem(`${SESSION_STORAGE_PREFIX}${topic}`, JSON.stringify(session))
      .then(() => setPersistenceWarning(false))
      .catch(() => setPersistenceWarning(true));
  }, [session, topic]);

  const currentQuestion = session ? getCurrentQuestion(session) : null;
  const currentResponse = session ? getCurrentResponse(session) : null;

  const moveForward = () => {
    if (!session || !currentResponse?.revealed) return;
    updateSession({ type: "next" });
    setRestored(false);
    questionShownAt.current = Date.now();
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const selectOption = (optionId: string) => {
    if (!session || submitting) return;
    updateSession({ type: "select", optionId });
  };

  const checkAnswerOrContinue = async () => {
    if (!session || !currentQuestion || !currentResponse) return;
    if (currentResponse.revealed) {
      moveForward();
      return;
    }
    if (!currentResponse.selectedOptionId || submitting) return;

    const idempotencyKey = currentResponse.idempotencyKey ?? createIdempotencyKey();
    updateSession({ type: "submission_started", idempotencyKey });
    setSubmitting(true);
    try {
      const result = await api.submitAttempt({
        questionId: currentQuestion.id,
        selectedOptionId: currentResponse.selectedOptionId,
        idempotencyKey,
        timeSpentSeconds: Math.min(86_400, Math.max(0, Math.round((Date.now() - questionShownAt.current) / 1000))),
      });
      if (!attemptResultMatchesSubmission(currentQuestion, currentResponse.selectedOptionId, result)) {
        throw new Error("Attempt response did not match the submitted question");
      }
      updateSession({ type: "answer_revealed", result });
      setRestored(false);
      void refreshProgress();
    } catch {
      updateSession({
        type: "submission_failed",
        error: "לא הצלחנו לבדוק את התשובה. הבחירה נשמרה—נסו שוב.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const skipQuestion = () => {
    if (!session || !currentQuestion || submitting) return;
    updateSession({ type: "skip" });
    setRestored(false);
    questionShownAt.current = Date.now();
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const startNewPractice = async () => {
    if (!topic) return;
    await AsyncStorage.removeItem(`${SESSION_STORAGE_PREFIX}${topic}`).catch(() => undefined);
    setSession(null);
    await loadExercise(false);
  };

  if (session?.finished) {
    const summary = summarizeExerciseSession(session);
    return (
      <Body>
        <Navbar />
        <ScrollView contentContainerStyle={styles.summaryScroll}>
          <Container style={styles.summaryContainer}>
            <ThemedView style={styles.summaryCard} accessibilityLiveRegion="polite">
              <H3 style={styles.centeredText}>סיימתם את התרגול!</H3>
              <H5 style={styles.centeredText}>{summary.accuracyPercentage}% דיוק</H5>
              <P style={styles.centeredText}>עניתם נכון על {summary.correct} מתוך {summary.answered} שאלות שנענו.</P>
              <SecondaryText style={styles.centeredText}>דולגו: {summary.skipped} · לא הוצגו: {summary.remaining}</SecondaryText>
              {summary.points > 0 ? <H5 style={[styles.centeredText, styles.correctText]}>צברתם {summary.points} נקודות</H5> : null}
              <PrimaryButton onPress={() => { void startNewPractice(); }} height={56} fill>תרגול חדש</PrimaryButton>
              <SecondaryButton onPress={() => router.replace("/(tabs)/exercises")} height={56} fill>חזרה לנושאים</SecondaryButton>
            </ThemedView>
          </Container>
        </ScrollView>
      </Body>
    );
  }

  const progressLabel = session ? `שאלה ${session.currentQuestionIndex + 1} מתוך ${session.questions.length}` : "";
  const isLastQuestion = Boolean(session && session.currentQuestionIndex === session.questions.length - 1);
  const selectionLocked = Boolean(currentResponse?.idempotencyKey && !currentResponse.revealed);

  return (
    <Body>
      <Navbar />
      <ScrollView ref={scrollRef} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {loading ? (
          <View style={styles.loadingSpinnerContainer}>
            <ActivityIndicator size="large" color={Colors[colorScheme ?? "dark"].primary} />
          </View>
        ) : null}

        {!loading && loadError ? (
          <Container style={styles.messageContainer}>
            <P style={styles.centeredText}>{topic ? "לא הצלחנו לטעון את התרגול." : "לא נבחר נושא לתרגול."}</P>
            {topic ? (
              <PrimaryButton fill height={52} onPress={() => { void loadExercise(true); }}>ניסיון נוסף</PrimaryButton>
            ) : (
              <PrimaryButton fill height={52} onPress={() => router.replace("/(tabs)/exercises")}>בחירת נושא</PrimaryButton>
            )}
          </Container>
        ) : null}

        {!loading && !loadError && session && !currentQuestion ? (
          <Container style={styles.messageContainer}>
            <P style={styles.centeredText}>לא נמצאו שאלות בנושא הזה.</P>
            <PrimaryButton fill height={52} onPress={() => router.replace("/(tabs)/exercises")}>חזרה לנושאים</PrimaryButton>
          </Container>
        ) : null}

        {!loading && !loadError && session && currentQuestion && currentResponse ? (
          <View>
            {restored ? <SecondaryText style={styles.restoredText}>התרגול הקודם שוחזר</SecondaryText> : null}
            {persistenceWarning ? (
              <P accessibilityLiveRegion="polite" style={styles.persistenceWarning}>ההתקדמות נשמרה בשרת, אך לא הצלחנו לשמור את מצב המסך במכשיר.</P>
            ) : null}
            {currentQuestion.type === "multiple_choice" ? (
              <MultipleOptionExercise
                question={currentQuestion.prompt}
                options={currentQuestion.options}
                correctOptionId={currentResponse.correctOptionId}
                selectedOptionId={currentResponse.selectedOptionId}
                revealed={currentResponse.revealed}
                disabled={submitting || selectionLocked}
                onSelect={selectOption}
                progressLabel={progressLabel}
                codeSnippet={currentQuestion.codeSnippet ?? undefined}
              />
            ) : (
              <YesNoExercise
                question={currentQuestion.prompt}
                options={currentQuestion.options}
                selectedOptionId={currentResponse.selectedOptionId}
                correctOptionId={currentResponse.correctOptionId}
                revealed={currentResponse.revealed}
                disabled={submitting || selectionLocked}
                onSelect={selectOption}
                progressLabel={progressLabel}
                codeSnippet={currentQuestion.codeSnippet ?? undefined}
              />
            )}

            <Container style={styles.actionsWrapper}>
              {currentResponse.revealed ? (
                <ThemedView accessibilityLiveRegion="polite" style={styles.feedbackCard}>
                  <H5 style={[styles.feedbackTitle, currentResponse.isCorrect ? styles.correctText : styles.incorrectText]}>
                    {currentResponse.isCorrect ? "תשובה נכונה!" : "לא בדיוק — הנה הפתרון"}
                  </H5>
                  <P>{currentResponse.explanation ?? `התשובה הנכונה היא: ${currentResponse.correctOptionLabel}`}</P>
                  {currentResponse.pointsAwarded > 0 ? <SecondaryText style={styles.correctText}>+{currentResponse.pointsAwarded} נקודות</SecondaryText> : null}
                </ThemedView>
              ) : null}

              {currentResponse.error ? <P accessibilityLiveRegion="polite" style={styles.errorText}>{currentResponse.error}</P> : null}

              <View style={styles.buttonsContainer}>
                <PrimaryButton
                  height={56}
                  fill
                  textStyle={{ fontSize: 18 }}
                  disabled={submitting || (!currentResponse.revealed && currentResponse.selectedOptionId === null)}
                  onPress={() => { void checkAnswerOrContinue(); }}
                >
                  {submitting ? "בודקים..." : currentResponse.revealed ? (isLastQuestion ? "סיום התרגול" : "לשאלה הבאה") : currentResponse.error ? "ניסיון נוסף" : "בדיקת תשובה"}
                </PrimaryButton>
                {!currentResponse.revealed && !selectionLocked ? (
                  <SecondaryButton height={56} fill disabled={submitting} textStyle={{ fontSize: 18 }} onPress={skipQuestion}>
                    {isLastQuestion ? "דלג וסיים" : "דלג"}
                  </SecondaryButton>
                ) : null}
              </View>
            </Container>
          </View>
        ) : null}
      </ScrollView>
    </Body>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingBottom: 32 },
  loadingSpinnerContainer: { minHeight: 360, justifyContent: "center", alignItems: "center" },
  messageContainer: { maxWidth: 840, alignSelf: "center", paddingHorizontal: 20, paddingVertical: 64, gap: 18 },
  actionsWrapper: { width: "100%", maxWidth: 840, alignSelf: "center", paddingHorizontal: 20 },
  restoredText: { textAlign: "center", paddingVertical: 8, backgroundColor: "#293341" },
  persistenceWarning: { color: "#FBBF24", textAlign: "center", paddingHorizontal: 20, paddingVertical: 10 },
  feedbackCard: { marginTop: 24, padding: 18, gap: 8, borderRadius: 10, backgroundColor: "#293341" },
  feedbackTitle: { marginBottom: 2 },
  correctText: { color: "#4ADE80" },
  incorrectText: { color: "#FB7185" },
  errorText: { color: "#FB7185", marginTop: 16, textAlign: "right" },
  buttonsContainer: { gap: 10, marginTop: 24 },
  summaryScroll: { flexGrow: 1, justifyContent: "center", paddingVertical: 32 },
  summaryContainer: { width: "100%", maxWidth: 600, alignSelf: "center", paddingHorizontal: 20 },
  summaryCard: { padding: 24, gap: 16, borderRadius: 12, backgroundColor: "#293341" },
  centeredText: { textAlign: "center" },
});
