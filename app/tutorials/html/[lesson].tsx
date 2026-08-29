import { useLocalSearchParams } from "expo-router";

import HtmlLessonPage from "@/components/tutorials/HtmlLessonPage";
import { htmlLessons, type HtmlLessonKey } from "@/data/tutorials/html/lessons";
import Body from "@/components/UI/Body";
import Container from "@/components/UI/Container";
import Navbar from "@/components/UI/Navbar";
import { P } from "@/components/UI/typography/Typography";

export default function HtmlLessonRoute() {
  const { lesson } = useLocalSearchParams<{ lesson?: string }>();
  const content = lesson && lesson in htmlLessons ? htmlLessons[lesson as HtmlLessonKey] : null;

  if (!content) {
    return <Body><Navbar /><Container><P>השיעור המבוקש לא נמצא.</P></Container></Body>;
  }

  return <HtmlLessonPage lesson={content} />;
}
