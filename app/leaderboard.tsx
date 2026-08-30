import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import Body from "@/components/UI/Body";
import Container from "@/components/UI/Container";
import Navbar from "@/components/UI/Navbar";
import UserIconsMap, { letterMapper } from "@/components/UI/UserIconMap";
import { H2, H4, H5, H6, P, SecondaryText } from "@/components/UI/typography/Typography";
import { Colors } from "@/constants/Colors";
import { api } from "@/services/api/client";
import type {
  ApiAchievement,
  ApiAchievements,
  ApiLeaderboard,
  ApiLeaderboardEntry,
  ApiLeaderboardPeriod,
} from "@/services/api/types";

type IconName = React.ComponentProps<typeof Ionicons>["name"];

function userIcon(displayName: string) {
  return UserIconsMap[letterMapper[displayName.trim().charAt(0)] ?? 10];
}

function RankRow({ entry }: { entry: ApiLeaderboardEntry }) {
  const rankIcon = entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : entry.rank === 3 ? "🥉" : null;
  return (
    <View style={[styles.rankRow, entry.isCurrentUser && styles.myRankRow]}>
      <View style={styles.rankIdentity}>
        <View style={styles.rankBadge}>
          <Text style={styles.rankText}>{rankIcon ?? entry.rank}</Text>
        </View>
        <Image source={userIcon(entry.displayName)} style={styles.avatar} />
        <View style={styles.nameBlock}>
          <H6 numberOfLines={1}>{entry.displayName}</H6>
          {entry.isCurrentUser ? <Text style={styles.youLabel}>זה אתם</Text> : null}
        </View>
      </View>
      <View style={styles.pointsBlock}>
        <H6>{entry.points.toLocaleString("he-IL")}</H6>
        <SecondaryText style={styles.pointsLabel}>נק׳</SecondaryText>
      </View>
    </View>
  );
}

function AchievementCard({ achievement }: { achievement: ApiAchievement }) {
  const shownValue = Math.min(achievement.currentValue, achievement.threshold);
  return (
    <View style={[styles.achievementCard, achievement.isUnlocked && styles.unlockedCard]}>
      <View style={[styles.achievementIcon, achievement.isUnlocked && styles.unlockedIcon]}>
        <Ionicons
          name={(achievement.isUnlocked ? achievement.iconName : "lock-closed") as IconName}
          size={25}
          color={achievement.isUnlocked ? "#081E22" : "#9BA1A6"}
        />
      </View>
      <View style={styles.achievementCopy}>
        <View style={styles.achievementTitleRow}>
          {achievement.isUnlocked ? <Text style={styles.unlockedLabel}>הושג</Text> : null}
          <H6 style={styles.achievementTitle}>{achievement.title}</H6>
        </View>
        <SecondaryText style={styles.achievementDescription}>{achievement.description}</SecondaryText>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${achievement.progressPercentage}%` }]} />
        </View>
        <SecondaryText style={styles.progressCaption}>
          {achievement.isUnlocked
            ? `נפתח ב-${new Date(achievement.unlockedAt!).toLocaleDateString("he-IL")}`
            : `${shownValue.toLocaleString("he-IL")} מתוך ${achievement.threshold.toLocaleString("he-IL")}`}
        </SecondaryText>
      </View>
    </View>
  );
}

export default function LeaderboardScreen() {
  const router = useRouter();
  const [period, setPeriod] = useState<ApiLeaderboardPeriod>("weekly");
  const [leaderboard, setLeaderboard] = useState<ApiLeaderboard | null>(null);
  const [achievements, setAchievements] = useState<ApiAchievements | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(false);

  const load = useCallback(async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    setError(false);
    try {
      const [nextLeaderboard, nextAchievements] = await Promise.all([
        api.getLeaderboard(period),
        api.getAchievements(),
      ]);
      setLeaderboard(nextLeaderboard);
      setAchievements(nextAchievements);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [period]);

  useEffect(() => { void load(); }, [load]);

  const myEntryOutsideList = leaderboard?.me &&
    !leaderboard.entries.some((entry) => entry.userId === leaderboard.me?.userId)
    ? leaderboard.me : null;

  return (
    <Body>
      <Navbar />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => void load(true)} tintColor={Colors.dark.primary} />}
      >
        <Container style={styles.container}>
          <View style={styles.topBar}>
            <Pressable accessibilityRole="button" accessibilityLabel="חזרה" hitSlop={8} onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
            </Pressable>
            <View style={styles.headingCopy}>
              <H2>דירוג והישגים</H2>
              <SecondaryText>התקדמו בקצב שלכם וחגגו כל צעד בדרך</SecondaryText>
            </View>
          </View>

          {loading ? (
            <View style={styles.stateBox}><ActivityIndicator size="large" color={Colors.dark.primary} /></View>
          ) : error ? (
            <View style={styles.stateBox}>
              <Ionicons name="cloud-offline-outline" size={38} color="#9BA1A6" />
              <H5>לא הצלחנו לטעון את הנתונים</H5>
              <Pressable accessibilityRole="button" onPress={() => void load()} style={styles.retryButton}><H6>ניסיון נוסף</H6></Pressable>
            </View>
          ) : (
            <>
              <View style={styles.sectionHeader}>
                <H4>טבלת המובילים</H4>
                <Ionicons name="podium" size={26} color={Colors.dark.primary} />
              </View>
              <View style={styles.segmentedControl} accessibilityRole="tablist">
                {(["weekly", "all_time"] as const).map((item) => (
                  <Pressable
                    key={item}
                    accessibilityRole="tab"
                    accessibilityState={{ selected: period === item }}
                    onPress={() => setPeriod(item)}
                    style={[styles.segment, period === item && styles.activeSegment]}
                  >
                    <Text style={[styles.segmentText, period === item && styles.activeSegmentText]}>
                      {item === "weekly" ? "השבוע" : "כל הזמנים"}
                    </Text>
                  </Pressable>
                ))}
              </View>
              <View style={styles.list}>
                {leaderboard?.entries.map((entry) => <RankRow key={entry.userId} entry={entry} />)}
                {myEntryOutsideList ? (
                  <>
                    <Text style={styles.ellipsis}>•••</Text>
                    <RankRow entry={myEntryOutsideList} />
                  </>
                ) : null}
              </View>

              <View style={[styles.sectionHeader, styles.achievementsHeader]}>
                <View style={styles.counterPill}>
                  <Text style={styles.counterText}>{achievements?.unlockedCount ?? 0}/{achievements?.totalCount ?? 0}</Text>
                </View>
                <H4>ההישגים שלכם</H4>
              </View>
              <P style={styles.sectionDescription}>הישגים נפתחים אוטומטית לפי הפעילות שלכם.</P>
              <View style={styles.achievementList}>
                {achievements?.achievements.map((achievement) => (
                  <AchievementCard key={achievement.key} achievement={achievement} />
                ))}
              </View>
            </>
          )}
        </Container>
      </ScrollView>
    </Body>
  );
}

const styles = StyleSheet.create({
  scrollContent: { paddingVertical: 24, paddingBottom: 56 },
  container: { width: "100%", maxWidth: 640, alignSelf: "center", paddingHorizontal: 20 },
  topBar: { flexDirection: "row-reverse", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 28 },
  headingCopy: { flex: 1, alignItems: "flex-end", gap: 4 },
  backButton: { width: 44, height: 44, borderRadius: 12, borderWidth: 1, borderColor: "#3A4553", alignItems: "center", justifyContent: "center" },
  stateBox: { minHeight: 300, alignItems: "center", justifyContent: "center", gap: 16 },
  retryButton: { minHeight: 48, paddingHorizontal: 24, borderRadius: 8, backgroundColor: Colors.dark.primary, justifyContent: "center" },
  sectionHeader: { flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 14 },
  segmentedControl: { flexDirection: "row-reverse", padding: 4, backgroundColor: "#171D25", borderRadius: 12, marginBottom: 14 },
  segment: { flex: 1, minHeight: 44, alignItems: "center", justifyContent: "center", borderRadius: 9 },
  activeSegment: { backgroundColor: Colors.dark.primary },
  segmentText: { color: "#AEB5BE", fontFamily: "Heebo_700Bold", fontSize: 15 },
  activeSegmentText: { color: "#FFFFFF" },
  list: { gap: 8 },
  rankRow: { minHeight: 70, paddingHorizontal: 12, paddingVertical: 10, backgroundColor: "#293341", borderRadius: 12, flexDirection: "row-reverse", alignItems: "center", justifyContent: "space-between", borderWidth: 1, borderColor: "transparent" },
  myRankRow: { borderColor: Colors.dark.primary, backgroundColor: "#203A42" },
  rankIdentity: { flex: 1, flexDirection: "row-reverse", alignItems: "center", gap: 10, minWidth: 0 },
  rankBadge: { width: 34, alignItems: "center" },
  rankText: { color: "#FFFFFF", fontFamily: "Heebo_700Bold", fontSize: 18 },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  nameBlock: { flex: 1, minWidth: 0, alignItems: "flex-end" },
  youLabel: { color: Colors.dark.primary, fontFamily: "Heebo_700Bold", fontSize: 12 },
  pointsBlock: { flexDirection: "row", alignItems: "baseline", gap: 3 },
  pointsLabel: { fontSize: 12 },
  ellipsis: { color: "#9BA1A6", textAlign: "center", letterSpacing: 4 },
  achievementsHeader: { marginTop: 36, marginBottom: 4 },
  counterPill: { minHeight: 30, paddingHorizontal: 12, borderRadius: 15, backgroundColor: "#17444A", justifyContent: "center" },
  counterText: { color: "#52F5FD", fontFamily: "Heebo_700Bold", fontSize: 14 },
  sectionDescription: { color: "#C6CBD2", marginBottom: 16 },
  achievementList: { gap: 10 },
  achievementCard: { flexDirection: "row-reverse", alignItems: "center", gap: 12, padding: 14, borderRadius: 12, backgroundColor: "#252D38", borderWidth: 1, borderColor: "#343E4B" },
  unlockedCard: { backgroundColor: "#26383B", borderColor: "#26757B" },
  achievementIcon: { width: 48, height: 48, flexShrink: 0, borderRadius: 24, alignItems: "center", justifyContent: "center", backgroundColor: "#343E4B" },
  unlockedIcon: { backgroundColor: "#52F5FD" },
  achievementCopy: { flex: 1, gap: 5 },
  achievementTitleRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  achievementTitle: { flex: 1 },
  unlockedLabel: { color: "#52F5FD", fontFamily: "Heebo_700Bold", fontSize: 12 },
  achievementDescription: { fontSize: 14, textAlign: "right" },
  progressTrack: { height: 6, borderRadius: 3, overflow: "hidden", backgroundColor: "#151B22" },
  progressFill: { height: "100%", borderRadius: 3, backgroundColor: Colors.dark.primary },
  progressCaption: { fontSize: 12, textAlign: "right" },
});
