import { useLocalSearchParams } from "expo-router";
import Body from "@/components/UI/Body";
import Container from "@/components/UI/Container";
import Navbar from "@/components/UI/Navbar";
import { P } from "@/components/UI/typography/Typography";
import CatalogLessonPage from "@/components/tutorials/CatalogLessonPage";
import { sqlLessons, type SqlLessonKey } from "@/data/tutorials/sql/lessons";

const lessonSlugs = new Set(Object.keys(sqlLessons));
export default function SqlLessonRoute() {
  const { lesson } = useLocalSearchParams<{ lesson?: string }>();
  const content = lesson && lesson in sqlLessons ? sqlLessons[lesson as SqlLessonKey] : null;
  if (!content) return <Body><Navbar /><Container><P>השיעור המבוקש לא נמצא.</P></Container></Body>;
  return <CatalogLessonPage lesson={content} courseSlug="sql-basics" lessonSlugs={lessonSlugs} tableOfContentsPath="/tutorials/sql/CourseTableOfContents" defaultLanguage="sql" />;
}
