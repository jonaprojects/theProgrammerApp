import CatalogCourseTableOfContents from "@/components/tutorials/CatalogCourseTableOfContents";
import { javascriptLessons } from "@/data/tutorials/javascript/lessons";

const lessonSlugs = new Set(Object.keys(javascriptLessons));
const sectionTitles = ["JavaScript בדפדפן", "לוגיקה ונתונים", "Functions ו־Objects", "דף אינטראקטיבי"] as const;

export default function JavascriptCourseTableOfContents() {
  return <CatalogCourseTableOfContents courseSlug="javascript-basics" basePath="/tutorials/javascript" lessonSlugs={lessonSlugs} sectionTitles={sectionTitles} lessonsPerSection={3} courseHeaderImg={require("@/assets/images/courses/javascriptCourseCard.png")} />;
}
