import { useLocalSearchParams } from "expo-router";
import Body from "@/components/UI/Body";
import Container from "@/components/UI/Container";
import Navbar from "@/components/UI/Navbar";
import { P } from "@/components/UI/typography/Typography";
import CatalogLessonPage from "@/components/tutorials/CatalogLessonPage";
import { gitLessons, type GitLessonKey } from "@/data/tutorials/git/lessons";

const lessonSlugs = new Set(Object.keys(gitLessons));
export default function GitLessonRoute() {
  const { lesson } = useLocalSearchParams<{ lesson?: string }>();
  const content = lesson && lesson in gitLessons ? gitLessons[lesson as GitLessonKey] : null;
  if (!content) return <Body><Navbar /><Container><P>השיעור המבוקש לא נמצא.</P></Container></Body>;
  return <CatalogLessonPage lesson={content} courseSlug="git-basics" lessonSlugs={lessonSlugs} tableOfContentsPath="/tutorials/git/CourseTableOfContents" defaultLanguage="bash" />;
}
