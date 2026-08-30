import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, TextInput, View } from "react-native";

import Body from "@/components/UI/Body";
import Container from "@/components/UI/Container";
import Navbar from "@/components/UI/Navbar";
import PrimaryButton from "@/components/UI/buttons/PrimaryButton";
import SecondaryButton from "@/components/UI/buttons/SecondaryButton";
import { H2, H4, H5, P, SecondaryText } from "@/components/UI/typography/Typography";
import { Colors } from "@/constants/Colors";
import { useProgress } from "@/context/ProgressContext";
import { api, ApiRequestError } from "@/services/api/client";
import type { ApiMultiplayerMatch } from "@/services/api/types";

const questionCounts = [5, 10, 15] as const;
const roundDurations = [15, 20, 30] as const;

function openMatch(match: ApiMultiplayerMatch) {
  router.push(`/multiplayer/${match.id}`);
}

export default function MultiplayerLobby() {
  const { progress, loading: progressLoading, refresh } = useProgress();
  const topics = progress?.topics.filter(({ questionCount }) => questionCount >= 5) ?? [];
  const [topicSlug, setTopicSlug] = useState("");
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [roundDurationSeconds, setRoundDurationSeconds] = useState<number>(20);
  const [roomCode, setRoomCode] = useState("");
  const [currentMatch, setCurrentMatch] = useState<ApiMultiplayerMatch | null>(null);
  const [checkingCurrent, setCheckingCurrent] = useState(true);
  const [busyAction, setBusyAction] = useState<"quick" | "private" | "join" | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!topicSlug && topics[0]) setTopicSlug(topics[0].topicSlug);
  }, [topicSlug, topics]);

  useFocusEffect(useCallback(() => {
    let active = true;
    setCheckingCurrent(true);
    void Promise.all([api.getCurrentMultiplayerMatch(), refresh()])
      .then(([match]) => { if (active) setCurrentMatch(match); })
      .catch(() => { if (active) setCurrentMatch(null); })
      .finally(() => { if (active) setCheckingCurrent(false); });
    return () => { active = false; };
  }, [refresh]));

  const selectedTopic = useMemo(
    () => topics.find((topic) => topic.topicSlug === topicSlug) ?? null,
    [topicSlug, topics],
  );

  const matchInput = { topicSlug, questionCount, roundDurationSeconds };
  const run = async (action: "quick" | "private" | "join") => {
    if (busyAction) return;
    if (action !== "join" && !topicSlug) {
      setError("בחרו נושא לפני שמתחילים.");
      return;
    }
    if (action === "join" && !/^[A-Z2-9]{8}$/.test(roomCode.trim().toUpperCase())) {
      setError("קוד חדר כולל 8 אותיות או מספרים.");
      return;
    }
    setBusyAction(action);
    setError(null);
    try {
      const match = action === "quick"
        ? await api.findMultiplayerMatch(matchInput)
        : action === "private"
          ? await api.createMultiplayerMatch(matchInput)
          : await api.joinMultiplayerMatch(roomCode);
      openMatch(match);
    } catch (cause) {
      if (cause instanceof ApiRequestError && cause.code === "ACTIVE_MATCH_EXISTS") {
        try {
          const existing = await api.getCurrentMultiplayerMatch();
          if (existing) {
            setCurrentMatch(existing);
            openMatch(existing);
            return;
          }
        } catch {
          // Fall through to a useful message when the existing match disappeared concurrently.
        }
        setError("כבר יש לכם משחק פעיל. חזרו אליו או צאו ממנו לפני פתיחת משחק חדש.");
      } else if (cause instanceof ApiRequestError && cause.code === "MATCH_FULL") {
        setError("החדר כבר מלא. בקשו קוד חדש או נסו התאמה מהירה.");
      } else if (cause instanceof ApiRequestError && cause.code === "NOT_FOUND") {
        setError("לא מצאנו חדר פעיל עם הקוד הזה.");
      } else {
        setError("לא הצלחנו להתחבר למשחק. בדקו שהשרת פועל ונסו שוב.");
      }
    } finally {
      setBusyAction(null);
    }
  };

  return (
    <Body>
      <Navbar />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Container style={styles.container}>
          <View style={styles.titleBlock}>
            <View style={styles.titleIcon}><Ionicons name="people" size={30} color="#081018" /></View>
            <H2 style={styles.centered}>תרגול מול חברים</H2>
            <P style={styles.centered}>אותן שאלות, בזמן אמת. תשובה נכונה ומהירה שווה יותר נקודות.</P>
          </View>

          {checkingCurrent ? <ActivityIndicator color={Colors.dark.primary} /> : null}
          {currentMatch ? (
            <View style={[styles.card, styles.resumeCard]}>
              <View style={styles.cardHeadingRow}>
                <Ionicons name="flash" size={22} color="#52F5FD" />
                <H5>יש משחק שמחכה לכם</H5>
              </View>
              <SecondaryText>{currentMatch.topic.title} · {currentMatch.players.length}/2 שחקנים</SecondaryText>
              <PrimaryButton fill height={52} onPress={() => openMatch(currentMatch)}>חזרה למשחק</PrimaryButton>
            </View>
          ) : null}

          <View style={styles.card}>
            <H4>1. בוחרים נושא</H4>
            {progressLoading && topics.length === 0 ? <ActivityIndicator color={Colors.dark.primary} /> : null}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
              {topics.map((topic) => (
                <ChoiceChip
                  key={topic.topicId}
                  selected={topic.topicSlug === topicSlug}
                  label={topic.topicTitle}
                  onPress={() => setTopicSlug(topic.topicSlug)}
                />
              ))}
            </ScrollView>
            {selectedTopic ? <SecondaryText>{selectedTopic.questionCount} שאלות זמינות בנושא</SecondaryText> : null}

            <H5 style={styles.subheading}>מספר שאלות</H5>
            <View style={styles.compactChips}>
              {questionCounts.map((count) => (
                <ChoiceChip key={count} selected={questionCount === count} label={`${count}`} onPress={() => setQuestionCount(count)} />
              ))}
            </View>

            <H5 style={styles.subheading}>זמן לשאלה</H5>
            <View style={styles.compactChips}>
              {roundDurations.map((seconds) => (
                <ChoiceChip key={seconds} selected={roundDurationSeconds === seconds} label={`${seconds} שנ׳`} onPress={() => setRoundDurationSeconds(seconds)} />
              ))}
            </View>
          </View>

          <View style={styles.card}>
            <H4>2. איך משחקים?</H4>
            <PrimaryButton fill height={56} disabled={busyAction !== null || !topicSlug} onPress={() => { void run("quick"); }}>
              {busyAction === "quick" ? "מחפשים יריב..." : "התאמה מהירה"}
            </PrimaryButton>
            <SecondaryButton fill height={54} disabled={busyAction !== null || !topicSlug} onPress={() => { void run("private"); }}>
              {busyAction === "private" ? "יוצרים חדר..." : "יצירת חדר פרטי"}
            </SecondaryButton>
          </View>

          <View style={styles.card}>
            <H4>יש לכם קוד?</H4>
            <TextInput
              value={roomCode}
              onChangeText={(value) => setRoomCode(value.toUpperCase().replace(/[^A-Z2-9]/g, "").slice(0, 8))}
              placeholder="לדוגמה: A7KM3P2Q"
              placeholderTextColor="#7A8491"
              autoCapitalize="characters"
              autoCorrect={false}
              maxLength={8}
              textAlign="center"
              accessibilityLabel="קוד חדר"
              style={styles.codeInput}
            />
            <PrimaryButton fill height={54} disabled={busyAction !== null || roomCode.length !== 8} onPress={() => { void run("join"); }}>
              {busyAction === "join" ? "מצטרפים..." : "כניסה לחדר"}
            </PrimaryButton>
          </View>

          {error ? <P accessibilityLiveRegion="polite" style={styles.error}>{error}</P> : null}
        </Container>
      </ScrollView>
    </Body>
  );
}

function ChoiceChip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={[styles.chip, selected && styles.selectedChip]}
    >
      <P style={[styles.chipText, selected && styles.selectedChipText]}>{label}</P>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingVertical: 24, paddingBottom: 48 },
  container: { width: "100%", maxWidth: 720, alignSelf: "center", paddingHorizontal: 20, gap: 16 },
  titleBlock: { alignItems: "center", gap: 9, marginBottom: 6 },
  titleIcon: { width: 54, height: 54, borderRadius: 27, backgroundColor: Colors.dark.primary, alignItems: "center", justifyContent: "center" },
  centered: { textAlign: "center" },
  card: { padding: 18, borderRadius: 16, backgroundColor: "#242D39", borderWidth: 1, borderColor: "#344050", gap: 14 },
  resumeCard: { borderColor: "#00ADB5", backgroundColor: "#20333D" },
  cardHeadingRow: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "flex-start", gap: 8 },
  chipsRow: { flexDirection: "row-reverse", gap: 8, paddingVertical: 2 },
  compactChips: { flexDirection: "row-reverse", gap: 8, flexWrap: "wrap" },
  chip: { minHeight: 44, paddingHorizontal: 16, borderRadius: 22, borderWidth: 1, borderColor: "#536071", backgroundColor: "#1B222C", justifyContent: "center" },
  selectedChip: { borderColor: Colors.dark.primary, backgroundColor: "#0B4A50" },
  chipText: { lineHeight: 21, textAlign: "center" },
  selectedChipText: { color: "#75F7FD", fontFamily: "Heebo_700Bold" },
  subheading: { marginTop: 4 },
  codeInput: { height: 58, borderRadius: 10, borderWidth: 1, borderColor: "#596677", backgroundColor: "#151B23", color: "#FFFFFF", fontFamily: "JetBrainsMono_400Regular", fontSize: 22, letterSpacing: 3, paddingHorizontal: 14, writingDirection: "ltr" },
  error: { color: "#FB7185", textAlign: "center", paddingHorizontal: 12 },
});
