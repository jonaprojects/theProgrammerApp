import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useNavigation } from "expo-router";

import Body from "@/components/UI/Body";
import Container from "@/components/UI/Container";
import Navbar from "@/components/UI/Navbar";
import { P } from "@/components/UI/typography/Typography";
import { Colors } from "@/constants/Colors";
import type { TableOfContentsModel } from "@/data/tutorials/models/tableOfContentsModel";
import { pythonRoutesByLessonSlug } from "@/data/tutorials/python/lessonSlugs";
import { offlineLearning } from "@/services/offline/learning";
import TableOfContents from "../template/TableOfContents";
import { useProgress } from "@/context/ProgressContext";

const sectionTitles = [
  "יסודות התכנות",
  "מבני נתונים",
  "תכנות מונחה עצמים",
  "מתקדם",
];

function sectionIndex(position: number): number {
  if (position <= 11) return 0;
  if (position <= 16) return 1;
  if (position <= 22) return 2;
  return 3;
}

export default function CourseTableOfContents() {
  const navigation = useNavigation();
  const [data, setData] = useState<TableOfContentsModel | null>(null);
  const [error, setError] = useState(false);
  const { progress, refresh } = useProgress();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
    offlineLearning
      .getCourse("python-basics")
      .then(({ data: course }) => {
        const sections = sectionTitles.map((title) => ({
          title,
          contents: {} as Record<string, string>,
        }));
        for (const lesson of course.lessons) {
          const route = pythonRoutesByLessonSlug[lesson.slug];
          if (route) sections[sectionIndex(lesson.position)]!.contents[lesson.title] = route;
        }
        setData(sections.filter(({ contents }) => Object.keys(contents).length > 0));
      })
      .catch(() => setError(true));
  }, [navigation]);

  useEffect(() => { void refresh(); }, [refresh]);

  const enrollment = progress?.enrollments.find(({ courseSlug }) => courseSlug === "python-basics");
  const lessonStatusByPath = Object.fromEntries(
    (enrollment?.lessons ?? []).flatMap((lesson) => {
      const route = pythonRoutesByLessonSlug[lesson.lessonSlug];
      return route ? [[route, lesson.status] as const] : [];
    }),
  );

  if (data) {
    return (
      <TableOfContents
        data={data}
        basePath="/tutorials/python"
        courseHeaderImg={require("@/assets/images/tutorials/headers/pythonTutorialHeader.png")}
        lessonStatusByPath={lessonStatusByPath}
      />
    );
  }

  return (
    <Body>
      <Navbar />
      <Container style={styles.stateContainer}>
        {error ? (
          <P style={styles.centeredText}>לא הצלחנו לטעון את תוכן הקורס מהשרת.</P>
        ) : (
          <ActivityIndicator size="large" color={Colors.dark.primary} />
        )}
      </Container>
    </Body>
  );
}

const styles = StyleSheet.create({
  stateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  centeredText: { textAlign: "center" },
});
