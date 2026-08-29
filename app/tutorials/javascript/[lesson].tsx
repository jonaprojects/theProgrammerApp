import { useLocalSearchParams } from "expo-router";

import Body from "@/components/UI/Body";
import Container from "@/components/UI/Container";
import Navbar from "@/components/UI/Navbar";
import { P } from "@/components/UI/typography/Typography";
import CatalogLessonPage from "@/components/tutorials/CatalogLessonPage";
import { javascriptLessons, type JavascriptLessonKey } from "@/data/tutorials/javascript/lessons";

const lessonSlugs = new Set(Object.keys(javascriptLessons));

export default function JavascriptLessonRoute() {
  const { lesson } = useLocalSearchParams<{ lesson?: string }>();
  const content = lesson && lesson in javascriptLessons ? javascriptLessons[lesson as JavascriptLessonKey] : null;
  if (!content) return <Body><Navbar /><Container><P>השיעור המבוקש לא נמצא.</P></Container></Body>;
  return <CatalogLessonPage lesson={content} courseSlug="javascript-basics" lessonSlugs={lessonSlugs} tableOfContentsPath="/tutorials/javascript/CourseTableOfContents" defaultLanguage="javascript" />;
}
