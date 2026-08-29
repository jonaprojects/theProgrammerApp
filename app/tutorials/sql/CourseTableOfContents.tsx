import CatalogCourseTableOfContents from "@/components/tutorials/CatalogCourseTableOfContents";
import { sqlLessons } from "@/data/tutorials/sql/lessons";

const lessonSlugs = new Set(Object.keys(sqlLessons));
const sectionTitles = ["קריאת data", "סיכום וקשרים", "כתיבה ו־integrity", "ביצועים ו־transactions"] as const;
export default function SqlCourseTableOfContents() {
  return <CatalogCourseTableOfContents courseSlug="sql-basics" basePath="/tutorials/sql" lessonSlugs={lessonSlugs} sectionTitles={sectionTitles} lessonsPerSection={3} courseHeaderImg={require("@/assets/images/courses/sqlCourseCard.png")} />;
}
