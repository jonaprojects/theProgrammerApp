import { useCallback } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import { type Href, router, useFocusEffect } from "expo-router";

import MyCourse from "@/components/course_cards/MyCourse";
import Body from "@/components/UI/Body";
import Navbar from "@/components/UI/Navbar";
import { H1, P } from "@/components/UI/typography/Typography";
import { Colors } from "@/constants/Colors";
import { courseLessonPath, courseTableOfContentsPath } from "@/data/tutorials/courseRoutes";
import { getCourseImage } from "@/services/api/assets";
import type { ApiEnrollmentProgress } from "@/services/api/types";
import { useProgress } from "@/context/ProgressContext";

function openCourse(enrollment: ApiEnrollmentProgress) {
  if (enrollment.resumeLesson) {
    const path = courseLessonPath(enrollment.courseSlug, enrollment.resumeLesson.lessonSlug);
    if (path) {
      router.navigate(path as Href);
      return;
    }
  }
  const contentsPath = courseTableOfContentsPath(enrollment.courseSlug);
  if (contentsPath) router.navigate(contentsPath as Href);
}

export default function MyCourses() {
  const { progress, loading, error, refresh } = useProgress();
  const enrollments = progress?.enrollments ?? [];

  useFocusEffect(useCallback(() => { void refresh(); }, [refresh]));

  return (
    <Body>
      <Navbar />
      {loading && !progress ? (
        <View style={styles.centeredState}>
          <ActivityIndicator size="large" color={Colors.dark.primary} />
        </View>
      ) : (
        <FlatList
          data={enrollments}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={<H1 style={styles.heading}>הקורסים שלי</H1>}
          ListEmptyComponent={
            <P style={styles.emptyText}>
              {error ? "לא הצלחנו לטעון את ההתקדמות מהשרת." : "עדיין לא נרשמתם לקורס."}
            </P>
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <MyCourse
              courseID={item.courseId}
              courseName={item.courseTitle}
              backgroundImg={getCourseImage(item.courseSlug)}
              completedLessons={item.completedLessons}
              numOfLessons={item.totalLessons}
              completionPercentage={item.completionPercentage}
              status={item.status}
              resumeLessonTitle={item.resumeLesson?.lessonTitle}
              navigateFn={() => openCourse(item)}
            />
          )}
          keyExtractor={({ courseId }) => courseId}
        />
      )}
    </Body>
  );
}

const styles = StyleSheet.create({
  listContent: {
    width: "100%",
    maxWidth: 840,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 32,
  },
  heading: { marginBottom: 24 },
  separator: { height: 12 },
  centeredState: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { textAlign: "center", marginTop: 32 },
});
