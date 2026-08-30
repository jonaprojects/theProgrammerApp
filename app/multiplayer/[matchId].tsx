import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Modal, Platform, Pressable, ScrollView, Share, StyleSheet, View } from "react-native";

import MultipleOptionExercise from "@/components/exercises/MultipleOptionExercise";
import YesNoExercise from "@/components/exercises/YesNoExercise";
import Body from "@/components/UI/Body";
import Container from "@/components/UI/Container";
import Navbar from "@/components/UI/Navbar";
import PrimaryButton from "@/components/UI/buttons/PrimaryButton";
import SecondaryButton from "@/components/UI/buttons/SecondaryButton";
import { H2, H3, H4, H5, P, SecondaryText } from "@/components/UI/typography/Typography";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/context/AuthContext";
import { useProgress } from "@/context/ProgressContext";
import { api, createIdempotencyKey } from "@/services/api/client";
import {
  subscribeToMultiplayerMatch,
  type MultiplayerTransportStatus,
} from "@/services/api/multiplayerSocket";
import type { ApiMultiplayerMatch, ApiMultiplayerPlayer } from "@/services/api/types";

function param(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value) ?? "";
}

export default function MultiplayerMatchScreen() {
  const params = useLocalSearchParams<{ matchId?: string | string[] }>();
  const matchId = param(params.matchId);
  const { user } = useAuth();
  const { refresh: refreshProgress } = useProgress();
  const [match, setMatch] = useState<ApiMultiplayerMatch | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [starting, setStarting] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [leaveConfirmationVisible, setLeaveConfirmationVisible] = useState(false);
  const [transportStatus, setTransportStatus] = useState<MultiplayerTransportStatus>("connecting");
  const [actionError, setActionError] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());
  const polling = useRef(false);
  const answerKey = useRef<{ position: number; key: string } | null>(null);

  const refreshMatch = useCallback(async () => {
    if (!matchId || polling.current) return;
    polling.current = true;
    try {
      const next = await api.getMultiplayerMatch(matchId);
      setMatch(next);
    } catch {
      // The WebSocket may still recover; the slow HTTP fallback retries below.
    } finally {
      polling.current = false;
      setLoading(false);
    }
  }, [matchId]);

  useEffect(() => { void refreshMatch(); }, [refreshMatch]);
  useEffect(() => {
    if (!matchId) return;
    return subscribeToMultiplayerMatch(matchId, {
      onMatch: (nextMatch) => {
        setMatch(nextMatch);
        setLoading(false);
      },
      onStatus: setTransportStatus,
      onError: (code) => {
        if (code === "MATCH_UNAVAILABLE" || code === "FORBIDDEN") {
          setActionError("המשחק כבר לא זמין.");
        }
      },
    });
  }, [matchId]);
  useEffect(() => {
    if (match?.status !== "waiting" && match?.status !== "active") return;
    if (transportStatus === "connected") return;
    const id = setInterval(() => { void refreshMatch(); }, 5_000);
    return () => clearInterval(id);
  }, [match?.status, refreshMatch, transportStatus]);
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, []);

  const roundPosition = match?.round?.position ?? 0;
  useEffect(() => {
    setSelectedOptionId(match?.round?.myAnswer?.selectedOptionId ?? null);
    answerKey.current = null;
    setActionError(null);
  }, [roundPosition]);

  useEffect(() => {
    if (match?.status === "finished") void refreshProgress();
  }, [match?.status, refreshProgress]);

  const startMatch = async () => {
    if (!match || starting) return;
    setStarting(true);
    setActionError(null);
    try { setMatch(await api.startMultiplayerMatch(match.id)); }
    catch { setActionError("לא הצלחנו להתחיל. ודאו ששני השחקנים עדיין בחדר."); }
    finally { setStarting(false); }
  };

  const submitAnswer = async () => {
    if (!match?.round || !selectedOptionId || match.round.myAnswer || submitting) return;
    setSubmitting(true);
    setActionError(null);
    const idempotency = answerKey.current?.position === match.round.position
      ? answerKey.current.key
      : createIdempotencyKey();
    answerKey.current = { position: match.round.position, key: idempotency };
    try {
      const result = await api.submitMultiplayerAnswer(match.id, {
        questionPosition: match.round.position,
        selectedOptionId,
        idempotencyKey: idempotency,
      });
      setMatch(result.match);
    } catch {
      setActionError("התשובה לא נשלחה. הבחירה נשמרה—נסו שוב.");
      void refreshMatch();
    } finally {
      setSubmitting(false);
    }
  };

  const leave = async () => {
    if (!match || leaving) return;
    setLeaving(true);
    setActionError(null);
    try {
      await api.leaveMultiplayerMatch(match.id);
      setLeaveConfirmationVisible(false);
      router.replace("/multiplayer");
    } catch {
      setLeaveConfirmationVisible(false);
      setActionError("לא הצלחנו לצאת מהמשחק. בדקו את החיבור ונסו שוב.");
    } finally {
      setLeaving(false);
    }
  };

  if (loading && !match) {
    return <Body><Navbar /><View style={styles.centerState}><ActivityIndicator size="large" color={Colors.dark.primary} /></View></Body>;
  }
  if (!match || !user) {
    return (
      <Body><Navbar /><View style={styles.centerState}><P style={styles.centered}>לא הצלחנו למצוא את המשחק.</P><PrimaryButton onPress={() => router.replace("/multiplayer")}>חזרה</PrimaryButton></View></Body>
    );
  }

  return (
    <Body>
      <Navbar />
      {transportStatus === "reconnecting" || transportStatus === "disconnected" ? (
        <P accessibilityLiveRegion="polite" style={styles.connectionWarning}>
          החיבור בזמן אמת נקטע. מנסים להתחבר מחדש…
        </P>
      ) : null}
      {match.status === "waiting" ? <WaitingRoom match={match} myUserId={user.id} starting={starting} error={actionError} onStart={startMatch} onLeave={() => setLeaveConfirmationVisible(true)} /> : null}
      {match.status === "active" ? (
        <ActiveMatch
          match={match}
          myUserId={user.id}
          now={now}
          selectedOptionId={selectedOptionId}
          submitting={submitting}
          error={actionError}
          onSelect={setSelectedOptionId}
          onSubmit={submitAnswer}
          onLeave={() => setLeaveConfirmationVisible(true)}
        />
      ) : null}
      {match.status === "finished" ? <MatchResults match={match} myUserId={user.id} /> : null}
      {match.status === "cancelled" ? (
        <View style={styles.centerState}><H3 style={styles.centered}>החדר נסגר</H3><P style={styles.centered}>המארח יצא או שפג תוקף החדר.</P><PrimaryButton onPress={() => router.replace("/multiplayer")}>משחק חדש</PrimaryButton></View>
      ) : null}
      <LeaveConfirmation
        visible={leaveConfirmationVisible}
        activeMatch={match.status === "active"}
        leaving={leaving}
        onCancel={() => setLeaveConfirmationVisible(false)}
        onConfirm={() => { void leave(); }}
      />
    </Body>
  );
}

function LeaveConfirmation({ visible, activeMatch, leaving, onCancel, onConfirm }: {
  visible: boolean;
  activeMatch: boolean;
  leaving: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={leaving ? undefined : onCancel}
    >
      <View style={styles.modalBackdrop}>
        <View accessibilityRole="alert" style={styles.confirmationCard}>
          <View style={styles.confirmationIcon}><Ionicons name="exit-outline" size={28} color="#FB7185" /></View>
          <H3 style={styles.centered}>{activeMatch ? "לפרוש מהמשחק?" : "לצאת מהחדר?"}</H3>
          <P style={styles.centered}>{activeMatch ? "המשחק יסתיים והיריב ינצח בסיבוב הנוכחי." : "החדר ייסגר אם אתם המארחים. תוכלו לפתוח משחק חדש בכל רגע."}</P>
          <View style={styles.confirmationActions}>
            <SecondaryButton fill height={50} disabled={leaving} onPress={onCancel}>ביטול</SecondaryButton>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={activeMatch ? "אישור פרישה מהמשחק" : "אישור יציאה מהחדר"}
              disabled={leaving}
              onPress={onConfirm}
              style={({ pressed }) => [styles.destructiveButton, pressed && styles.destructiveButtonPressed, leaving && styles.disabledButton]}
            >
              {leaving ? <ActivityIndicator color="#FFFFFF" /> : <P style={styles.destructiveButtonText}>{activeMatch ? "פרישה" : "יציאה"}</P>}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function WaitingRoom({ match, myUserId, starting, error, onStart, onLeave }: {
  match: ApiMultiplayerMatch;
  myUserId: string;
  starting: boolean;
  error: string | null;
  onStart: () => void;
  onLeave: () => void;
}) {
  const isHost = match.hostUserId === myUserId;
  const activePlayers = match.players.filter(({ status }) => status === "active");
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  const shareCode = async () => {
    setShareFeedback(null);
    try {
      if (Platform.OS === "web" && typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(match.code);
        setShareFeedback("קוד החדר הועתק.");
        return;
      }
      await Share.share({ message: `בואו לשחק איתי ב״המתכנת״. קוד החדר: ${match.code}` });
    } catch {
      setShareFeedback("לא הצלחנו לשתף כרגע. אפשר להעתיק את הקוד שמופיע למעלה.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <Container style={styles.narrowContainer}>
        <View style={styles.heroIcon}><Ionicons name="game-controller" size={34} color="#071116" /></View>
        <H2 style={styles.centered}>{match.visibility === "public" ? "מחפשים יריב" : "החדר מוכן"}</H2>
        <P style={styles.centered}>{match.topic.title} · {match.questionCount} שאלות · {match.roundDurationSeconds} שניות</P>

        {match.visibility === "private" ? (
          <View style={styles.codeCard}>
            <SecondaryText style={styles.centered}>קוד החדר</SecondaryText>
            <H2 style={styles.roomCode} selectable>{match.code}</H2>
            <SecondaryButton fill height={48} onPress={() => { void shareCode(); }}>{Platform.OS === "web" ? "העתקת הקוד" : "שיתוף הקוד"}</SecondaryButton>
            {shareFeedback ? <SecondaryText accessibilityLiveRegion="polite" style={styles.centered}>{shareFeedback}</SecondaryText> : null}
          </View>
        ) : null}

        <View style={styles.panel}>
          <View style={styles.panelHeader}><H4>שחקנים</H4><SecondaryText>{activePlayers.length}/2</SecondaryText></View>
          {activePlayers.map((player) => <LobbyPlayer key={player.userId} player={player} host={player.userId === match.hostUserId} me={player.userId === myUserId} />)}
          {activePlayers.length < 2 ? (
            <View style={styles.emptyPlayer}><ActivityIndicator color={Colors.dark.primary} /><P>מחכים לשחקן נוסף…</P></View>
          ) : null}
        </View>

        {isHost && match.visibility === "private" ? (
          <PrimaryButton fill height={56} disabled={starting || activePlayers.length !== 2} onPress={onStart}>{starting ? "מתחילים…" : "התחלת המשחק"}</PrimaryButton>
        ) : <P style={styles.centered}>המשחק יתחיל ברגע שהחדר יהיה מוכן.</P>}
        {error ? <P style={styles.error}>{error}</P> : null}
        <SecondaryButton fill height={50} onPress={onLeave}>יציאה מהחדר</SecondaryButton>
      </Container>
    </ScrollView>
  );
}

function LobbyPlayer({ player, host, me }: { player: ApiMultiplayerPlayer; host: boolean; me: boolean }) {
  return (
    <View style={styles.lobbyPlayer}>
      <View style={styles.avatar}><P style={styles.avatarText}>{player.displayName.trim().charAt(0).toUpperCase()}</P></View>
      <View style={styles.flex}><H5>{player.displayName}{me ? " (אתם)" : ""}</H5><SecondaryText>{host ? "מארח" : "מוכן"}</SecondaryText></View>
      <Ionicons name="checkmark-circle" size={24} color="#4ADE80" />
    </View>
  );
}

function ActiveMatch({ match, myUserId, now, selectedOptionId, submitting, error, onSelect, onSubmit, onLeave }: {
  match: ApiMultiplayerMatch;
  myUserId: string;
  now: number;
  selectedOptionId: string | null;
  submitting: boolean;
  error: string | null;
  onSelect: (id: string) => void;
  onSubmit: () => void;
  onLeave: () => void;
}) {
  const round = match.round;
  if (!round) return <View style={styles.centerState}><ActivityIndicator color={Colors.dark.primary} /></View>;
  const answered = round.myAnswer !== null;
  const revealed = round.phase === "reveal";
  const secondsLeft = Math.max(0, Math.ceil((new Date(round.endsAt).getTime() - now) / 1_000));
  const progress = Math.max(0, Math.min(1, (new Date(round.endsAt).getTime() - now) / (match.roundDurationSeconds * 1_000)));
  const reviewLeft = round.revealedAt ? Math.max(0, Math.ceil((new Date(round.revealedAt).getTime() + 3_000 - now) / 1_000)) : 0;
  const progressLabel = `שאלה ${round.position} מתוך ${match.questionCount}`;
  return (
    <ScrollView contentContainerStyle={styles.gameScroll} keyboardShouldPersistTaps="handled">
      <Container style={styles.gameContainer}>
        <View style={styles.gameTopBar}>
          <SecondaryButton height={42} paddingHorizontal={12} onPress={onLeave}>פרישה</SecondaryButton>
          <View style={styles.timerBlock}><H4 style={secondsLeft <= 5 ? styles.timerDanger : undefined}>{revealed ? reviewLeft : secondsLeft}</H4><SecondaryText>{revealed ? "לשאלה הבאה" : "שניות"}</SecondaryText></View>
          <View style={styles.topicBadge}><P>{match.topic.title}</P></View>
        </View>
        <View style={styles.timerTrack}><View style={[styles.timerFill, { width: `${revealed ? 0 : progress * 100}%` }]} /></View>
        <Scoreboard players={match.players} myUserId={myUserId} />
      </Container>

      {round.question.type === "multiple_choice" ? (
        <MultipleOptionExercise
          question={round.question.prompt}
          options={round.question.options}
          correctOptionId={revealed ? round.correctOptionId : null}
          selectedOptionId={round.myAnswer?.selectedOptionId ?? selectedOptionId}
          revealed={revealed}
          disabled={answered || revealed || submitting || secondsLeft === 0}
          onSelect={onSelect}
          progressLabel={progressLabel}
          codeSnippet={round.question.codeSnippet ?? undefined}
        />
      ) : (
        <YesNoExercise
          question={round.question.prompt}
          options={round.question.options}
          correctOptionId={revealed ? round.correctOptionId : null}
          selectedOptionId={round.myAnswer?.selectedOptionId ?? selectedOptionId}
          revealed={revealed}
          disabled={answered || revealed || submitting || secondsLeft === 0}
          onSelect={onSelect}
          progressLabel={progressLabel}
          codeSnippet={round.question.codeSnippet ?? undefined}
        />
      )}

      <Container style={styles.answerActions}>
        {answered && !revealed ? <View style={styles.waitingAnswer}><ActivityIndicator color={Colors.dark.primary} /><P>התשובה נקלטה. מחכים ליריב…</P></View> : null}
        {revealed ? (
          <View style={[styles.feedback, round.myAnswer?.isCorrect ? styles.correctFeedback : styles.wrongFeedback]}>
            <H5>{!round.myAnswer ? "הזמן נגמר" : round.myAnswer.isCorrect ? "נכון!" : "לא הפעם"}</H5>
            {round.myAnswer?.isCorrect ? <P>+{round.myAnswer.pointsAwarded} נקודות</P> : <P>השאלה הבאה כבר בדרך.</P>}
          </View>
        ) : null}
        {!answered && !revealed ? (
          <PrimaryButton fill height={56} disabled={!selectedOptionId || submitting || secondsLeft === 0} onPress={onSubmit}>{submitting ? "שולחים…" : "נעילת תשובה"}</PrimaryButton>
        ) : null}
        {error ? <P style={styles.error}>{error}</P> : null}
      </Container>
    </ScrollView>
  );
}

function Scoreboard({ players, myUserId }: { players: ApiMultiplayerPlayer[]; myUserId: string }) {
  return (
    <View style={styles.scoreboard}>
      {players.filter(({ status }) => status !== "left").map((player) => (
        <View key={player.userId} style={[styles.scorePlayer, player.userId === myUserId && styles.myScorePlayer]}>
          <View style={styles.scoreNameRow}><View style={[styles.statusDot, player.answeredCurrent && styles.answeredDot]} /><P numberOfLines={1} style={styles.scoreName}>{player.displayName}</P></View>
          <H4>{player.score}</H4>
        </View>
      ))}
    </View>
  );
}

function MatchResults({ match, myUserId }: { match: ApiMultiplayerMatch; myUserId: string }) {
  const draw = match.winnerUserId === null;
  const won = match.winnerUserId === myUserId;
  const sorted = [...match.players].sort((a, b) => b.score - a.score);
  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <Container style={styles.narrowContainer}>
        <View style={[styles.resultIcon, won && styles.winIcon]}><Ionicons name={draw ? "remove" : won ? "trophy" : "ribbon"} size={38} color="#071116" /></View>
        <H2 style={styles.centered}>{draw ? "תיקו!" : won ? "ניצחתם!" : "משחק טוב!"}</H2>
        <P style={styles.centered}>{match.topic.title} · {match.questionCount} שאלות</P>
        <View style={styles.panel}>
          {sorted.map((player, index) => (
            <View key={player.userId} style={[styles.resultRow, player.userId === myUserId && styles.myResultRow]}>
              <H4 style={styles.rank}>{index + 1}</H4>
              <View style={styles.flex}><H5>{player.displayName}{player.userId === myUserId ? " (אתם)" : ""}</H5><SecondaryText>{player.correctCount}/{match.questionCount} תשובות נכונות</SecondaryText></View>
              <View style={styles.resultScore}><H4>{player.score}</H4><SecondaryText>+{player.rewardPoints} XP</SecondaryText></View>
            </View>
          ))}
        </View>
        <PrimaryButton fill height={56} onPress={() => router.replace("/multiplayer")}>משחק נוסף</PrimaryButton>
        <SecondaryButton fill height={52} onPress={() => router.replace("/(tabs)/exercises")}>חזרה לתרגול</SecondaryButton>
      </Container>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  centered: { textAlign: "center" },
  centerState: { flex: 1, justifyContent: "center", alignItems: "center", gap: 18, paddingHorizontal: 24 },
  connectionWarning: { color: "#FBBF24", textAlign: "center", backgroundColor: "#3C321D", paddingHorizontal: 16, paddingVertical: 8 },
  scrollContent: { paddingVertical: 28, paddingBottom: 48 },
  narrowContainer: { width: "100%", maxWidth: 620, alignSelf: "center", paddingHorizontal: 20, gap: 18, alignItems: "stretch" },
  heroIcon: { width: 64, height: 64, borderRadius: 32, alignSelf: "center", alignItems: "center", justifyContent: "center", backgroundColor: Colors.dark.primary },
  codeCard: { padding: 18, borderRadius: 16, backgroundColor: "#17232D", borderWidth: 1, borderColor: "#00ADB5", gap: 10 },
  roomCode: { textAlign: "center", writingDirection: "ltr", letterSpacing: 5, fontFamily: "JetBrainsMono_400Regular" },
  panel: { borderRadius: 16, backgroundColor: "#242D39", borderWidth: 1, borderColor: "#344050", overflow: "hidden" },
  panelHeader: { flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", padding: 16, borderBottomWidth: 1, borderBottomColor: "#344050" },
  lobbyPlayer: { flexDirection: "row-reverse", alignItems: "center", gap: 12, padding: 16, borderBottomWidth: 1, borderBottomColor: "#344050" },
  avatar: { width: 42, height: 42, borderRadius: 21, backgroundColor: "#0B4A50", alignItems: "center", justifyContent: "center" },
  avatarText: { color: "#75F7FD", fontFamily: "Heebo_700Bold", fontSize: 20 },
  emptyPlayer: { minHeight: 74, flexDirection: "row-reverse", gap: 12, justifyContent: "center", alignItems: "center", opacity: 0.8 },
  error: { color: "#FB7185", textAlign: "center" },
  gameScroll: { paddingBottom: 40 },
  gameContainer: { width: "100%", maxWidth: 840, alignSelf: "center", paddingHorizontal: 20, paddingTop: 14, gap: 12 },
  gameTopBar: { minHeight: 54, flexDirection: "row-reverse", justifyContent: "space-between", alignItems: "center", gap: 10 },
  timerBlock: { alignItems: "center", minWidth: 64 },
  timerDanger: { color: "#FB7185" },
  topicBadge: { maxWidth: 120, backgroundColor: "#293341", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20 },
  timerTrack: { height: 6, borderRadius: 3, overflow: "hidden", backgroundColor: "#313C4B", writingDirection: "ltr" },
  timerFill: { height: "100%", backgroundColor: Colors.dark.primary },
  scoreboard: { flexDirection: "row-reverse", gap: 10 },
  scorePlayer: { flex: 1, minWidth: 0, padding: 12, borderRadius: 12, backgroundColor: "#242D39", borderWidth: 1, borderColor: "#344050", gap: 3 },
  myScorePlayer: { borderColor: "#00ADB5" },
  scoreNameRow: { flexDirection: "row-reverse", alignItems: "center", gap: 6 },
  scoreName: { flexShrink: 1 },
  statusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#697587" },
  answeredDot: { backgroundColor: "#4ADE80" },
  answerActions: { width: "100%", maxWidth: 840, alignSelf: "center", paddingHorizontal: 20, paddingTop: 22, gap: 12 },
  waitingAnswer: { minHeight: 60, flexDirection: "row-reverse", justifyContent: "center", alignItems: "center", gap: 12, padding: 14, borderRadius: 12, backgroundColor: "#242D39" },
  feedback: { padding: 16, borderRadius: 12, borderWidth: 1, gap: 4 },
  correctFeedback: { backgroundColor: "#17372A", borderColor: "#4ADE80" },
  wrongFeedback: { backgroundColor: "#3C202A", borderColor: "#FB7185" },
  resultIcon: { width: 70, height: 70, borderRadius: 35, alignSelf: "center", alignItems: "center", justifyContent: "center", backgroundColor: "#94A3B8" },
  winIcon: { backgroundColor: "#FBBF24" },
  resultRow: { flexDirection: "row-reverse", alignItems: "center", gap: 12, padding: 16, borderBottomWidth: 1, borderBottomColor: "#344050" },
  myResultRow: { backgroundColor: "#20333D" },
  rank: { width: 28, textAlign: "center" },
  resultScore: { alignItems: "flex-start" },
  modalBackdrop: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 20, backgroundColor: "rgba(4, 8, 13, 0.78)" },
  confirmationCard: { width: "100%", maxWidth: 420, padding: 22, gap: 14, borderRadius: 18, backgroundColor: "#242D39", borderWidth: 1, borderColor: "#465366" },
  confirmationIcon: { width: 52, height: 52, borderRadius: 26, alignSelf: "center", alignItems: "center", justifyContent: "center", backgroundColor: "#3C202A" },
  confirmationActions: { gap: 10, marginTop: 4 },
  destructiveButton: { minHeight: 50, borderRadius: 10, backgroundColor: "#BE123C", alignItems: "center", justifyContent: "center", paddingHorizontal: 18 },
  destructiveButtonPressed: { backgroundColor: "#9F1239" },
  destructiveButtonText: { color: "#FFFFFF", textAlign: "center", fontFamily: "Heebo_700Bold" },
  disabledButton: { opacity: 0.6 },
});
