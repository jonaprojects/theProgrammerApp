import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { useNavigation } from "expo-router";
import Body from "@/components/UI/Body";
import Navbar from "@/components/UI/Navbar";
import Container from "@/components/UI/Container";
import CustomTextInput from "@/components/UI/input/CustomTextInput";
import PrimaryButton from "@/components/UI/buttons/PrimaryButton";
import SecondaryButton from "@/components/UI/buttons/SecondaryButton";
import { H2, P, SecondaryText } from "@/components/UI/typography/Typography";
import { useAuth } from "@/context/AuthContext";
import { useProgress } from "@/context/ProgressContext";

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { user, updateProfile, logout } = useAuth();
  const { progress, refresh } = useProgress();
  const [displayName, setDisplayName] = useState(user?.displayName ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => navigation.setOptions({ headerShown: false }), [navigation]);
  useEffect(() => {
    setDisplayName(user?.displayName ?? "");
    setBio(user?.bio ?? "");
  }, [user]);

  const save = async () => {
    if (!displayName.trim()) {
      setMessage("שם התצוגה לא יכול להיות ריק.");
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      await updateProfile({ displayName: displayName.trim(), bio: bio.trim() });
      await refresh();
      setMessage("הפרופיל נשמר בהצלחה.");
    } catch {
      setMessage("שמירת הפרופיל נכשלה. נסו שוב.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Body>
      <Navbar />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Container style={styles.container}>
          <View style={styles.heading}>
            <H2>הפרופיל שלי</H2>
            <SecondaryText>{user?.email}</SecondaryText>
          </View>
          {progress ? (
            <View style={styles.progressSection}>
              <H2 style={styles.sectionTitle}>הישגים בלמידה</H2>
              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <H2>{progress.user.points}</H2>
                  <SecondaryText>נקודות</SecondaryText>
                </View>
                <View style={styles.statCard}>
                  <H2>{progress.summary.completedLessons}/{progress.summary.totalLessons}</H2>
                  <SecondaryText>שיעורים</SecondaryText>
                </View>
                <View style={styles.statCard}>
                  <H2>{progress.summary.answeredQuestions}</H2>
                  <SecondaryText>שאלות</SecondaryText>
                </View>
                <View style={styles.statCard}>
                  <H2>{progress.summary.accuracyPercentage}%</H2>
                  <SecondaryText>דיוק</SecondaryText>
                </View>
              </View>
              <SecondaryText style={styles.activityText}>
                {progress.summary.currentStreakDays > 0
                  ? `רצף נוכחי: ${progress.summary.currentStreakDays} ${progress.summary.currentStreakDays === 1 ? "יום" : "ימים"} · `
                  : ""}
                {progress.summary.activeDays === 1
                  ? "יום למידה אחד בסך הכול"
                  : `${progress.summary.activeDays} ימי למידה בסך הכול`}
              </SecondaryText>
            </View>
          ) : null}
          <View style={styles.form}>
            <P>שם תצוגה</P>
            <CustomTextInput accessibilityLabel="שם תצוגה" value={displayName} onChangeText={setDisplayName} maxLength={80} style={styles.input} />
            <P>קצת עליי</P>
            <CustomTextInput accessibilityLabel="קצת עליי" value={bio} onChangeText={setBio} maxLength={240} multiline numberOfLines={4} style={[styles.input, styles.bio]} />
            <SecondaryText style={styles.counter}>{bio.length}/240</SecondaryText>
            {message && <P style={styles.message}>{message}</P>}
            <PrimaryButton fill onPress={save} disabled={saving}>
              {saving ? <ActivityIndicator color="#ffffff" /> : "שמירת שינויים"}
            </PrimaryButton>
            <SecondaryButton fill onPress={logout}>התנתקות</SecondaryButton>
          </View>
        </Container>
      </ScrollView>
    </Body>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingVertical: 28, paddingBottom: 48 },
  container: { maxWidth: 560, alignSelf: "center", paddingHorizontal: 20, gap: 28 },
  heading: { gap: 6, alignItems: "flex-end" },
  progressSection: { gap: 14 },
  sectionTitle: { textAlign: "right" },
  statsGrid: { flexDirection: "row-reverse", flexWrap: "wrap", gap: 10 },
  statCard: {
    width: "48%",
    flexGrow: 1,
    minWidth: 130,
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderRadius: 10,
    backgroundColor: "#293341",
    alignItems: "center",
    gap: 4,
  },
  activityText: { textAlign: "right" },
  form: { gap: 12 },
  input: { minHeight: 52, paddingHorizontal: 14, textAlign: "right", writingDirection: "rtl" },
  bio: { minHeight: 120, paddingTop: 12, textAlignVertical: "top" },
  counter: { textAlign: "left", fontSize: 13 },
  message: { textAlign: "right", fontSize: 15 },
});
