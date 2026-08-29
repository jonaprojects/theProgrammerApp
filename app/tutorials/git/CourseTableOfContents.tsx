import CatalogCourseTableOfContents from "@/components/tutorials/CatalogCourseTableOfContents";
import { gitLessons } from "@/data/tutorials/git/lessons";

const lessonSlugs = new Set(Object.keys(gitLessons));
const sectionTitles = ["הבסיס של Git", "Commits ו־history", "Branches ושיתוף", "עבודה בטוחה בצוות"] as const;
export default function GitCourseTableOfContents() {
  return <CatalogCourseTableOfContents courseSlug="git-basics" basePath="/tutorials/git" lessonSlugs={lessonSlugs} sectionTitles={sectionTitles} lessonsPerSection={3} courseHeaderImg={require("@/assets/images/courses/gitCourseCard.png")} />;
}
