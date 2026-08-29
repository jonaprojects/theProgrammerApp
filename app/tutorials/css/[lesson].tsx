import { useLocalSearchParams } from "expo-router";

import CssLessonPage from "@/components/tutorials/CssLessonPage";
import { cssLessons, type CssLessonKey } from "@/data/tutorials/css/lessons";
import Body from "@/components/UI/Body";
import Container from "@/components/UI/Container";
import Navbar from "@/components/UI/Navbar";
import { P } from "@/components/UI/typography/Typography";

export default function CssLessonRoute() {
  const { lesson } = useLocalSearchParams<{ lesson?: string }>();
  const content = lesson && lesson in cssLessons ? cssLessons[lesson as CssLessonKey] : null;
  if (!content) return <Body><Navbar /><Container><P>השיעור המבוקש לא נמצא.</P></Container></Body>;
  return <CssLessonPage lesson={content} />;
}
