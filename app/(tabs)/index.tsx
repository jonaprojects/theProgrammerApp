import { useCallback } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { type Href, router, useFocusEffect } from "expo-router";

import MyCourse from "@/components/course_cards/MyCourse";
import Body from "@/components/UI/Body";
import Navbar from "@/components/UI/Navbar";
import PrimaryButton from "@/components/UI/buttons/PrimaryButton";
import TopicProgress from "@/components/UI/topic_progress/TopicProgress";
import { H4, H5, P, SecondaryText } from "@/components/UI/typography/Typography";
import { useProgress } from "@/context/ProgressContext";
import { Colors } from "@/constants/Colors";
import { pythonRoutesByLessonSlug } from "@/data/tutorials/python/lessonSlugs";
import { getCourseImage } from "@/services/api/assets";
import type { ApiEnrollmentProgress } from "@/services/api/types";

function openCourse(enrollment: ApiEnrollmentProgress) {
  if (enrollment.courseSlug === "python-basics" && enrollment.resumeLesson) {
    const route = pythonRoutesByLessonSlug[enrollment.resumeLesson.lessonSlug];
    if (route) {
      router.navigate(`/tutorials/python/${route}` as Href);
      return;
    }
  }
  router.navigate("/tutorials/python/CourseTableOfContents");
}

export default function Home() {
  const { progress, loading, error, refresh } = useProgress();

  useFocusEffect(useCallback(() => { void refresh(); }, [refresh]));

  const recentTopicProgress = progress?.topics.filter(({ attemptsCount }) => attemptsCount > 0).slice(0, 3) ?? [];
  const activeEnrollment = progress?.enrollments[0] ?? null;
  const summary = progress?.summary;

  return (
    <Body>
      <Navbar />
      {loading && !progress ? (
        <View style={styles.centeredState}>
          <ActivityIndicator size="large" color={Colors.dark.primary} />
        </View>
      ) : (
        <FlatList
          data={recentTopicProgress}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          keyExtractor={({ topicId }) => topicId}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          ListHeaderComponent={
            <View>
              {summary ? (
                <View style={styles.summarySection}>
                  <H4>ההתקדמות שלי</H4>
                  <View style={styles.summaryRow}>
                    <View style={styles.statCard}>
                      <H5>{summary.completedLessons}/{summary.totalLessons}</H5>
                      <SecondaryText>שיעורים</SecondaryText>
                    </View>
                    <View style={styles.statCard}>
                      <H5>{summary.answeredQuestions}</H5>
                      <SecondaryText>שאלות</SecondaryText>
                    </View>
                    <View style={styles.statCard}>
                      <H5>{summary.accuracyPercentage}%</H5>
                      <SecondaryText>דיוק</SecondaryText>
                    </View>
                  </View>
                  {summary.currentStreakDays > 0 ? (
                    <SecondaryText style={styles.streak}>
                      רצף למידה: {summary.currentStreakDays} {summary.currentStreakDays === 1 ? "יום" : "ימים"}
                    </SecondaryText>
                  ) : null}
                </View>
              ) : null}

              <View style={styles.continueSection}>
                <H4>המשך מאיפה שעצרת</H4>
                {activeEnrollment ? (
                  <MyCourse
                    courseID={activeEnrollment.courseId}
                    courseName={activeEnrollment.courseTitle}
                    backgroundImg={getCourseImage(activeEnrollment.courseSlug)}
                    completedLessons={activeEnrollment.completedLessons}
                    numOfLessons={activeEnrollment.totalLessons}
                    completionPercentage={activeEnrollment.completionPercentage}
                    status={activeEnrollment.status}
                    resumeLessonTitle={activeEnrollment.resumeLesson?.lessonTitle}
                    navigateFn={() => openCourse(activeEnrollment)}
                  />
                ) : (
                  <View style={styles.emptyCard}>
                    <P>עדיין לא נרשמתם לקורס.</P>
                    <PrimaryButton height={48} onPress={() => router.navigate("/(tabs)/courses")}>
                      לצפייה בקורסים
                    </PrimaryButton>
                  </View>
                )}
              </View>
              <H4 style={styles.progressHeading}>התקדמות בתרגול</H4>
              {error ? <P style={styles.errorText}>לא הצלחנו לרענן את ההתקדמות מהשרת.</P> : null}
              {!error && recentTopicProgress.length === 0 ? (
                <View style={styles.emptyCard}>
                  <P>עוד לא עניתם על שאלות.</P>
                  <PrimaryButton height={48} onPress={() => router.navigate("/(tabs)/exercises")}>
                    להתחלת תרגול
                  </PrimaryButton>
                </View>
              ) : null}
            </View>
          }
          renderItem={({ item }) => (
            <TopicProgress
              topic={item.topicTitle}
              totalNumOfQuestions={item.questionCount}
              questionsAnswered={item.answeredCount}
              accuracyPercentage={item.accuracyPercentage}
              masteryPercentage={item.masteryPercentage}
              onPress={() => router.navigate(`/exercise?topic=${item.topicSlug}`)}
            />
          )}
        />
      )}
    </Body>
  );
}

const styles = StyleSheet.create({
  list: { flex: 1 },
  listContent: {
    width: "100%",
    maxWidth: 840,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
  },
  summarySection: { gap: 14, marginBottom: 28 },
  summaryRow: { flexDirection: "row-reverse", gap: 10 },
  statCard: {
    flex: 1,
    minWidth: 0,
    paddingHorizontal: 8,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: "#293341",
    alignItems: "center",
    gap: 4,
  },
  streak: { textAlign: "right" },
  continueSection: { gap: 16, marginBottom: 32 },
  progressHeading: { marginBottom: 16 },
  separator: { height: 12 },
  centeredState: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyCard: { padding: 18, gap: 16, borderRadius: 10, backgroundColor: "#293341" },
  errorText: { color: "#FB7185", marginBottom: 16 },
});
