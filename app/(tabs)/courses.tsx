import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";

import Course from "@/components/course_cards/Course";
import Body from "@/components/UI/Body";
import Navbar from "@/components/UI/Navbar";
import { H1, H4, P } from "@/components/UI/typography/Typography";
import { Colors } from "@/constants/Colors";
import { api } from "@/services/api/client";
import { getCourseImage } from "@/services/api/assets";
import type { ApiCourse } from "@/services/api/types";
import { useProgress } from "@/context/ProgressContext";

export default function Courses() {
  const { refresh: refreshProgress } = useProgress();
  const [courses, setCourses] = useState<ApiCourse[]>([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<Set<string>>(new Set());
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const [catalog, progress] = await Promise.all([
        api.listCourses(),
        api.getProgress(),
      ]);
      setCourses(catalog);
      setEnrolledCourseIds(
        new Set(progress.enrollments.map(({ courseId }) => courseId)),
      );
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const enroll = async (courseId: string) => {
    setEnrollingId(courseId);
    try {
      await api.enroll(courseId);
      setEnrolledCourseIds((current) => new Set(current).add(courseId));
      refreshProgress();
    } catch {
      setError(true);
    } finally {
      setEnrollingId(null);
    }
  };

  return (
    <Body>
      <Navbar />
      {loading ? (
        <View style={styles.centeredState}>
          <ActivityIndicator size="large" color={Colors.dark.primary} />
        </View>
      ) : (
        <FlatList
          data={courses}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.header}>
              <H1>קורסים</H1>
              <H4>בשבילך</H4>
              {error ? (
                <P style={styles.errorText}>
                  חלק מהנתונים לא נטענו. ודאו שהשרת פועל ונסו שוב.
                </P>
              ) : null}
            </View>
          }
          ListEmptyComponent={
            <P style={styles.emptyText}>אין כרגע קורסים זמינים.</P>
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <Course
              courseName={item.title}
              courseBgImage={getCourseImage(item.imageKey)}
              courseDescription={item.description}
              courseID={item.id}
              enrolled={enrolledCourseIds.has(item.id)}
              enrolling={enrollingId === item.id}
              onEnroll={() => enroll(item.id)}
            />
          )}
          keyExtractor={({ id }) => id}
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
  header: { gap: 20, marginBottom: 16 },
  separator: { height: 12 },
  centeredState: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "#FB7185" },
  emptyText: { textAlign: "center", marginTop: 32 },
});
