import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { useNavigation } from "expo-router";

import Body from "@/components/UI/Body";
import Container from "@/components/UI/Container";
import Navbar from "@/components/UI/Navbar";
import { P } from "@/components/UI/typography/Typography";
import { Colors } from "@/constants/Colors";
import { useProgress } from "@/context/ProgressContext";
import type { TableOfContentsModel } from "@/data/tutorials/models/tableOfContentsModel";
import { cssLessons } from "@/data/tutorials/css/lessons";
import { offlineLearning } from "@/services/offline/learning";
import TableOfContents from "../template/TableOfContents";

const sectionTitles = ["יסודות CSS", "עיצוב חזותי", "גודל ופריסה", "רספונסיביות ואינטראקציה", "CSS לתחזוקה"];
const sectionIndex = (position: number) => Math.min(4, Math.floor((position - 1) / 3));

export default function CssCourseTableOfContents() {
  const navigation = useNavigation();
  const [data, setData] = useState<TableOfContentsModel | null>(null);
  const [error, setError] = useState(false);
  const { progress, refresh } = useProgress();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
    offlineLearning.getCourse("css-basics").then(({ data: course }) => {
      const sections = sectionTitles.map((title) => ({ title, contents: {} as Record<string, string> }));
      for (const lesson of course.lessons) {
        if (lesson.slug in cssLessons) sections[sectionIndex(lesson.position)]!.contents[lesson.title] = lesson.slug;
      }
      setData(sections.filter(({ contents }) => Object.keys(contents).length > 0));
    }).catch(() => setError(true));
  }, [navigation]);

  useEffect(() => { void refresh(); }, [refresh]);
  const enrollment = progress?.enrollments.find(({ courseSlug }) => courseSlug === "css-basics");
  const lessonStatusByPath = Object.fromEntries((enrollment?.lessons ?? []).map((lesson) => [lesson.lessonSlug, lesson.status]));

  if (data) return <TableOfContents data={data} basePath="/tutorials/css" courseHeaderImg={require("@/assets/images/courses/cssCourseCard.png")} lessonStatusByPath={lessonStatusByPath} />;
  return <Body><Navbar /><Container style={styles.stateContainer}>{error ? <P style={styles.centeredText}>לא הצלחנו לטעון את תוכן הקורס מהשרת.</P> : <ActivityIndicator size="large" color={Colors.dark.primary} />}</Container></Body>;
}

const styles = StyleSheet.create({
  stateContainer: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 20 },
  centeredText: { textAlign: "center" },
});
