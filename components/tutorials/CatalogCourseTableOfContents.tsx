import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { useNavigation } from "expo-router";

import TableOfContents from "@/app/tutorials/template/TableOfContents";
import Body from "@/components/UI/Body";
import Container from "@/components/UI/Container";
import Navbar from "@/components/UI/Navbar";
import { P } from "@/components/UI/typography/Typography";
import { Colors } from "@/constants/Colors";
import { useProgress } from "@/context/ProgressContext";
import type { TableOfContentsModel } from "@/data/tutorials/models/tableOfContentsModel";
import { api } from "@/services/api/client";

type Props = {
  courseSlug: string;
  basePath: string;
  lessonSlugs: ReadonlySet<string>;
  sectionTitles: readonly string[];
  lessonsPerSection: number;
  courseHeaderImg: number;
};

export default function CatalogCourseTableOfContents(props: Props) {
  const navigation = useNavigation();
  const [data, setData] = useState<TableOfContentsModel | null>(null);
  const [error, setError] = useState(false);
  const { progress, refresh } = useProgress();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
    api.getCourse(props.courseSlug).then((course) => {
      const sections = props.sectionTitles.map((title) => ({ title, contents: {} as Record<string, string> }));
      for (const lesson of course.lessons) {
        if (!props.lessonSlugs.has(lesson.slug)) continue;
        const index = Math.min(sections.length - 1, Math.floor((lesson.position - 1) / props.lessonsPerSection));
        sections[index]!.contents[lesson.title] = lesson.slug;
      }
      setData(sections.filter(({ contents }) => Object.keys(contents).length > 0));
    }).catch(() => setError(true));
  }, [navigation, props.courseSlug, props.lessonSlugs, props.lessonsPerSection, props.sectionTitles]);

  useEffect(() => { void refresh(); }, [refresh]);
  const enrollment = progress?.enrollments.find(({ courseSlug }) => courseSlug === props.courseSlug);
  const lessonStatusByPath = Object.fromEntries((enrollment?.lessons ?? []).map((lesson) => [lesson.lessonSlug, lesson.status]));

  if (data) return <TableOfContents data={data} basePath={props.basePath} courseHeaderImg={props.courseHeaderImg} lessonStatusByPath={lessonStatusByPath} />;
  return <Body><Navbar /><Container style={styles.stateContainer}>{error ? <P style={styles.centeredText}>לא הצלחנו לטעון את תוכן הקורס מהשרת.</P> : <ActivityIndicator size="large" color={Colors.dark.primary} />}</Container></Body>;
}

const styles = StyleSheet.create({
  stateContainer: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 20 },
  centeredText: { textAlign: "center" },
});
