import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { ThemedView } from "@/components/ThemedView";
import CodeSnippet from "@/components/UI/code_snippets/CodeSnippet";
import PrimaryButton from "@/components/UI/buttons/PrimaryButton";
import SecondaryButton from "@/components/UI/buttons/SecondaryButton";
import { H5, H6, P, SecondaryText } from "@/components/UI/typography/Typography";
import { Colors } from "@/constants/Colors";
import { useProgress } from "@/context/ProgressContext";
import { api, createIdempotencyKey } from "@/services/api/client";
import HighlightedCodeText from "./HighlightedCodeText";
import {
  correctExerciseAnswer,
  emptyExerciseAnswer,
  exerciseAnswerIsComplete,
} from "./logic";
import type {
  TutorialExerciseAnswer,
  TutorialExerciseDefinition,
  TutorialExerciseOption,
  TutorialFindBugExercise,
  TutorialOrderCodeExercise,
} from "./types";

type FeedbackStatus = "idle" | "incorrect" | "correct" | "revealed";

const kindPresentation = {
  predict_output: { label: "מה יודפס?", icon: "terminal-outline" },
  fill_blank: { label: "השלימו את החסר", icon: "extension-puzzle-outline" },
  find_bug: { label: "מצאו את הבאג", icon: "bug-outline" },
  order_code: { label: "סדרו את הקוד", icon: "reorder-three-outline" },
  trace: { label: "עקבו אחרי המשתנה", icon: "git-branch-outline" },
} as const;

export default function InteractiveExercise({
  exercise,
}: {
  exercise: TutorialExerciseDefinition;
}) {
  const { progress, loading: progressLoading, refresh: refreshProgress } = useProgress();
  const [answer, setAnswer] = useState<TutorialExerciseAnswer>(() =>
    emptyExerciseAnswer(exercise),
  );
  const [status, setStatus] = useState<FeedbackStatus>("idle");
  const [attempts, setAttempts] = useState(0);
  const [completedBefore, setCompletedBefore] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [pointsAwarded, setPointsAwarded] = useState(0);

  useEffect(() => {
    setAnswer(emptyExerciseAnswer(exercise));
    setStatus("idle");
    setAttempts(0);
    setCompletedBefore(false);
    setPointsAwarded(0);
    setSubmissionError(null);
    setHydrated(false);
  }, [exercise.id]);

  useEffect(() => {
    // After registration the auth state can change one render before the first
    // authenticated progress request starts. Do not lock in an empty state during
    // that gap; wait for the authoritative progress payload.
    if (progressLoading || !progress || hydrated) return;
    const stored = progress.tutorialExercises.find(({ exerciseId }) => exerciseId === exercise.id);
    if (stored) {
      setAttempts(stored.attemptsCount);
      setCompletedBefore(stored.completed);
      if (stored.completed) {
        setAnswer(correctExerciseAnswer(exercise));
        setStatus("correct");
      } else if (stored.solutionRevealed) {
        setAnswer(correctExerciseAnswer(exercise));
        setStatus("revealed");
      }
    }
    setHydrated(true);
  }, [exercise, hydrated, progress?.tutorialExercises, progressLoading]);

  const updateAnswer = (nextAnswer: TutorialExerciseAnswer) => {
    setAnswer(nextAnswer);
    setSubmissionError(null);
    if (status === "incorrect" || status === "revealed") setStatus("idle");
  };

  const checkAnswer = async () => {
    if (!exerciseAnswerIsComplete(exercise, answer) || submitting || answer === null) return;
    setSubmitting(true);
    setSubmissionError(null);
    try {
      const result = await api.submitTutorialExercise({
        exerciseId: exercise.id,
        action: "check",
        answer,
        hintUsed: attempts >= 1,
        idempotencyKey: createIdempotencyKey(),
      });
      setAttempts(result.progress.attemptsCount);
      setCompletedBefore(result.progress.completed);
      setPointsAwarded(result.pointsAwarded);
      setStatus(result.isCorrect ? "correct" : "incorrect");
      await refreshProgress();
    } catch {
      setSubmissionError("לא הצלחנו לשמור את התשובה. בדקו את החיבור ונסו שוב.");
    } finally {
      setSubmitting(false);
    }
  };

  const revealAnswer = async () => {
    if (submitting) return;
    setSubmitting(true);
    setSubmissionError(null);
    try {
      const result = await api.submitTutorialExercise({
        exerciseId: exercise.id,
        action: "reveal",
        hintUsed: true,
        idempotencyKey: createIdempotencyKey(),
      });
      setAnswer(correctExerciseAnswer(exercise));
      setStatus("revealed");
      setAttempts(result.progress.attemptsCount);
      await refreshProgress();
    } catch {
      setSubmissionError("לא הצלחנו לטעון ולשמור את הפתרון. נסו שוב.");
    } finally {
      setSubmitting(false);
    }
  };

  const tryAgain = () => {
    setAnswer(emptyExerciseAnswer(exercise));
    setStatus("idle");
    setPointsAwarded(0);
    setSubmissionError(null);
  };

  const presentation = kindPresentation[exercise.type];
  const answerComplete = exerciseAnswerIsComplete(exercise, answer);

  return (
    <ThemedView
      accessibilityLabel={`תרגיל אינטראקטיבי: ${presentation.label}`}
      style={styles.card}
    >
      <View style={styles.headingRow}>
        <View style={styles.kindPill}>
          <Ionicons
            name={presentation.icon}
            size={18}
            color={Colors.dark.lineProgressActive}
          />
          <H6 style={styles.kindLabel}>{presentation.label}</H6>
        </View>
        {completedBefore ? (
          <View style={styles.completedBadge}>
            <Ionicons name="checkmark-circle" size={18} color="#4ADE80" />
            <SecondaryText style={styles.completedText}>הושלם</SecondaryText>
          </View>
        ) : null}
      </View>

      <H5 style={styles.prompt}>{exercise.prompt}</H5>

      {!hydrated ? (
        <ActivityIndicator color={Colors.dark.primary} style={styles.loader} />
      ) : (
        <>
          {(exercise.type === "predict_output" ||
            exercise.type === "fill_blank" ||
            exercise.type === "trace") && (
            <ChoiceInteraction
              exercise={exercise}
              selectedOptionId={typeof answer === "string" ? answer : null}
              status={status}
              onSelect={updateAnswer}
            />
          )}

          {exercise.type === "find_bug" && (
            <FindBugInteraction
              exercise={exercise}
              selectedLine={typeof answer === "number" ? answer : null}
              status={status}
              onSelect={updateAnswer}
            />
          )}

          {exercise.type === "order_code" && (
            <OrderCodeInteraction
              exercise={exercise}
              order={Array.isArray(answer) ? answer : []}
              status={status}
              onChange={updateAnswer}
            />
          )}

          {status !== "idle" ? (
            <Feedback
              status={status}
              explanation={exercise.explanation}
              hint={exercise.hint}
              attempts={attempts}
            />
          ) : null}

          {status === "correct" && pointsAwarded > 0 ? (
            <View accessibilityLiveRegion="polite" style={styles.rewardBanner}>
              <Ionicons name="trophy" size={22} color="#FBBF24" />
              <H6 style={styles.rewardText}>+{pointsAwarded} נקודות — השיעור הושלם!</H6>
            </View>
          ) : null}

          {submissionError ? (
            <P accessibilityLiveRegion="polite" style={styles.submissionError}>
              {submissionError}
            </P>
          ) : null}

          <View style={styles.actions}>
            {status === "correct" || status === "revealed" ? (
              <SecondaryButton disabled={submitting} height={48} fill onPress={tryAgain} textStyle={styles.actionText}>
                נסו שוב
              </SecondaryButton>
            ) : (
              <PrimaryButton
                height={48}
                fill
                disabled={!answerComplete || submitting}
                onPress={() => void checkAnswer()}
                textStyle={styles.actionText}
              >
                {submitting ? "שומר..." : "בדיקת תשובה"}
              </PrimaryButton>
            )}

            {status === "incorrect" && attempts >= 2 ? (
              <SecondaryButton
                height={48}
                fill
                disabled={submitting}
                onPress={() => void revealAnswer()}
                textStyle={styles.actionText}
              >
                הציגו לי את הפתרון
              </SecondaryButton>
            ) : null}
          </View>
        </>
      )}
    </ThemedView>
  );
}

function ChoiceInteraction({
  exercise,
  selectedOptionId,
  status,
  onSelect,
}: {
  exercise: Extract<
    TutorialExerciseDefinition,
    { type: "predict_output" | "fill_blank" | "trace" }
  >;
  selectedOptionId: string | null;
  status: FeedbackStatus;
  onSelect: (answer: TutorialExerciseAnswer) => void;
}) {
  return (
    <View>
      <CodeSnippet
        compact
        code={exercise.code}
        language={exercise.language ?? "python"}
      />
      <View style={styles.choiceList}>
        {exercise.options.map((option) => (
          <ChoiceButton
            key={option.id}
            option={option}
            selected={selectedOptionId === option.id}
            correct={option.id === exercise.correctOptionId}
            status={status}
            onPress={() => onSelect(option.id)}
          />
        ))}
      </View>
    </View>
  );
}

function ChoiceButton({
  option,
  selected,
  correct,
  status,
  onPress,
}: {
  option: TutorialExerciseOption;
  selected: boolean;
  correct: boolean;
  status: FeedbackStatus;
  onPress: () => void;
}) {
  const showCorrect = (status === "correct" || status === "revealed") && correct;
  const showIncorrect = status === "incorrect" && selected && !correct;
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.choice,
        selected && styles.choiceSelected,
        showCorrect && styles.correctBorder,
        showIncorrect && styles.incorrectBorder,
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected ? <View style={styles.radioDot} /> : null}
      </View>
      <Text style={styles.choiceText}>{option.label}</Text>
      {showCorrect ? (
        <Ionicons name="checkmark-circle" size={21} color="#4ADE80" />
      ) : null}
    </Pressable>
  );
}

function FindBugInteraction({
  exercise,
  selectedLine,
  status,
  onSelect,
}: {
  exercise: TutorialFindBugExercise;
  selectedLine: number | null;
  status: FeedbackStatus;
  onSelect: (answer: TutorialExerciseAnswer) => void;
}) {
  return (
    <View style={styles.codePanel}>
      <View style={styles.codeToolbar}>
        <Text style={styles.codeLanguage}>{exercise.language ?? "python"}</Text>
        <SecondaryText style={styles.codeInstruction}>הקישו על השורה הבעייתית</SecondaryText>
      </View>
      {exercise.codeLines.map((line, index) => {
        const selected = selectedLine === index;
        const correct = exercise.correctLineIndex === index;
        const showCorrect = (status === "correct" || status === "revealed") && correct;
        const showIncorrect = status === "incorrect" && selected && !correct;
        return (
          <Pressable
            accessibilityLabel={`שורה ${index + 1}: ${line}`}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            key={`${index}-${line}`}
            onPress={() => onSelect(index)}
            style={({ pressed }) => [
              styles.codeLine,
              selected && styles.codeLineSelected,
              showCorrect && styles.correctBackground,
              showIncorrect && styles.incorrectBackground,
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.lineNumber}>{index + 1}</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.lineCode}
              contentContainerStyle={styles.codeScrollerContent}
            >
              <HighlightedCodeText code={line || " "} />
            </ScrollView>
          </Pressable>
        );
      })}
    </View>
  );
}

function OrderCodeInteraction({
  exercise,
  order,
  status,
  onChange,
}: {
  exercise: TutorialOrderCodeExercise;
  order: string[];
  status: FeedbackStatus;
  onChange: (answer: TutorialExerciseAnswer) => void;
}) {
  const blockById = useMemo(
    () => new Map(exercise.blocks.map((block) => [block.id, block])),
    [exercise.blocks],
  );
  const remaining = exercise.blocks.filter((block) => !order.includes(block.id));
  const addBlock = (blockId: string) => onChange([...order, blockId]);
  const removeBlock = (index: number) =>
    onChange(order.filter((_, orderIndex) => orderIndex !== index));

  return (
    <View style={styles.orderColumns}>
      <View>
        <View style={styles.orderHeadingRow}>
          <H6>הפתרון שלכם</H6>
          {order.length ? (
            <Pressable
              accessibilityLabel="איפוס סדר השורות"
              onPress={() => onChange([])}
              hitSlop={8}
            >
              <SecondaryText style={styles.resetText}>איפוס</SecondaryText>
            </Pressable>
          ) : null}
        </View>
        <View
          accessibilityLabel="סדר הקוד שנבחר"
          style={[
            styles.orderTarget,
            status === "correct" && styles.correctBorder,
            status === "incorrect" && styles.incorrectBorder,
          ]}
        >
          {order.length === 0 ? (
            <SecondaryText style={styles.orderPlaceholder}>
              הקישו על השורות לפי הסדר
            </SecondaryText>
          ) : (
            order.map((blockId, index) => {
              const block = blockById.get(blockId);
              return block ? (
                <Pressable
                  accessibilityLabel={`הסרת שורה ${index + 1}: ${block.code}`}
                  key={`${blockId}-${index}`}
                  onPress={() => removeBlock(index)}
                  style={({ pressed }) => [styles.codeBlock, pressed && styles.pressed]}
                >
                  <View style={styles.orderNumber}>
                    <Text style={styles.orderNumberText}>{index + 1}</Text>
                  </View>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.blockCode}
                    contentContainerStyle={styles.codeScrollerContent}
                  >
                    <HighlightedCodeText code={block.code} />
                  </ScrollView>
                  <Ionicons name="close" size={18} color="#94A3B8" />
                </Pressable>
              ) : null;
            })
          )}
        </View>
      </View>

      {remaining.length ? (
        <View>
          <H6 style={styles.availableHeading}>השורות הזמינות</H6>
          <View style={styles.availableBlocks}>
            {remaining.map((block) => (
              <Pressable
                accessibilityLabel={`הוספת השורה: ${block.code}`}
                key={block.id}
                onPress={() => addBlock(block.id)}
                style={({ pressed }) => [styles.codeBlock, pressed && styles.pressed]}
              >
                <Ionicons name="add-circle-outline" size={20} color="#52F5FD" />
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.blockCode}
                  contentContainerStyle={styles.codeScrollerContent}
                >
                  <HighlightedCodeText code={block.code} />
                </ScrollView>
              </Pressable>
            ))}
          </View>
        </View>
      ) : null}
    </View>
  );
}

function Feedback({
  status,
  explanation,
  hint,
  attempts,
}: {
  status: FeedbackStatus;
  explanation: string;
  hint?: string;
  attempts: number;
}) {
  const correct = status === "correct";
  const revealed = status === "revealed";
  return (
    <View
      accessibilityLiveRegion="polite"
      style={[
        styles.feedback,
        correct && styles.correctFeedback,
        status === "incorrect" && styles.incorrectFeedback,
        revealed && styles.revealedFeedback,
      ]}
    >
      <View style={styles.feedbackHeading}>
        <Ionicons
          name={correct ? "sparkles" : revealed ? "eye-outline" : "bulb-outline"}
          size={20}
          color={correct ? "#4ADE80" : revealed ? "#FBBF24" : "#FB7185"}
        />
        <H6>
          {correct
            ? "בדיוק!"
            : revealed
              ? "זה הפתרון"
              : attempts >= 2
                ? "כמעט—אפשר לנסות שוב או לראות את הפתרון"
                : "לא בדיוק—נסו שוב"}
        </H6>
      </View>
      <P>{correct || revealed ? explanation : hint ?? "עברו שוב על הקוד וחפשו את השינוי המרכזי."}</P>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    marginVertical: 20,
    padding: 16,
    gap: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#3B4A60",
    backgroundColor: "#1B222C",
  },
  headingRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  kindPill: {
    minHeight: 36,
    paddingHorizontal: 10,
    borderRadius: 18,
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 7,
    backgroundColor: "#263342",
  },
  kindLabel: { fontSize: 14, color: "#DDFBFC" },
  completedBadge: { flexDirection: "row-reverse", alignItems: "center", gap: 5 },
  completedText: { color: "#4ADE80", fontSize: 13 },
  prompt: { marginTop: 2 },
  loader: { minHeight: 100 },
  choiceList: { gap: 10, marginTop: 14 },
  choice: {
    width: "100%",
    minHeight: 52,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#435269",
    backgroundColor: "#293548",
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 10,
  },
  choiceSelected: { borderColor: "#52F5FD", backgroundColor: "#263F4A" },
  choiceText: {
    flex: 1,
    color: "#FFFFFF",
    fontFamily: "JetBrainsMono_400Regular",
    fontSize: 15,
    lineHeight: 21,
    textAlign: "left",
    writingDirection: "ltr",
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#7E8A9B",
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: { borderColor: "#52F5FD" },
  radioDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: "#52F5FD" },
  correctBorder: { borderColor: "#4ADE80" },
  incorrectBorder: { borderColor: "#FB7185" },
  correctBackground: { backgroundColor: "rgba(74, 222, 128, 0.14)" },
  incorrectBackground: { backgroundColor: "rgba(251, 113, 133, 0.14)" },
  codePanel: {
    overflow: "hidden",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#39485E",
    backgroundColor: "#202631",
  },
  codeToolbar: {
    minHeight: 38,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    backgroundColor: "#171C24",
  },
  codeLanguage: {
    color: "#94A3B8",
    fontFamily: "JetBrainsMono_400Regular",
    fontSize: 11,
    textTransform: "uppercase",
  },
  codeInstruction: { flex: 1, fontSize: 12, textAlign: "right" },
  codeLine: {
    minHeight: 44,
    paddingVertical: 9,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "flex-start",
    borderTopWidth: 1,
    borderTopColor: "#303C4E",
  },
  codeLineSelected: { backgroundColor: "#263F4A" },
  lineNumber: {
    width: 28,
    color: "#65758B",
    fontFamily: "JetBrainsMono_400Regular",
    fontSize: 13,
    lineHeight: 21,
  },
  lineCode: { flex: 1, minWidth: 0 },
  codeScrollerContent: { minWidth: "100%", alignItems: "flex-start" },
  orderColumns: { gap: 16 },
  orderHeadingRow: {
    minHeight: 32,
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resetText: { color: "#52F5FD", fontSize: 13 },
  orderTarget: {
    minHeight: 100,
    padding: 8,
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#526178",
    backgroundColor: "#171D25",
    justifyContent: "center",
  },
  orderPlaceholder: { textAlign: "center", color: "#94A3B8" },
  availableHeading: { marginBottom: 8 },
  availableBlocks: { gap: 8 },
  codeBlock: {
    minHeight: 48,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    backgroundColor: "#293548",
    borderWidth: 1,
    borderColor: "#435269",
  },
  blockCode: { flex: 1, minWidth: 0 },
  orderNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00ADB5",
  },
  orderNumberText: {
    color: "#FFFFFF",
    fontFamily: "Heebo_700Bold",
    fontSize: 13,
  },
  feedback: { padding: 13, gap: 7, borderRadius: 12, borderWidth: 1 },
  correctFeedback: { borderColor: "#357D55", backgroundColor: "#1D392D" },
  incorrectFeedback: { borderColor: "#8A4856", backgroundColor: "#3A2932" },
  revealedFeedback: { borderColor: "#8A723B", backgroundColor: "#3A3426" },
  feedbackHeading: { flexDirection: "row-reverse", alignItems: "center", gap: 7 },
  actions: { gap: 10 },
  rewardBanner: {
    minHeight: 52,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#8A723B",
    backgroundColor: "#3A3426",
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  rewardText: { color: "#FDE68A" },
  submissionError: { color: "#FDA4AF", textAlign: "center" },
  actionText: { fontSize: 16 },
  pressed: { opacity: 0.72 },
});
