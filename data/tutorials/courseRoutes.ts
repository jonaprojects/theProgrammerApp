import { pythonRoutesByLessonSlug } from "./python/lessonSlugs";

export function courseTableOfContentsPath(courseSlug: string): string | null {
  if (courseSlug === "python-basics") return "/tutorials/python/CourseTableOfContents";
  if (courseSlug === "html-basics") return "/tutorials/html/CourseTableOfContents";
  if (courseSlug === "css-basics") return "/tutorials/css/CourseTableOfContents";
  if (courseSlug === "javascript-basics") return "/tutorials/javascript/CourseTableOfContents";
  if (courseSlug === "git-basics") return "/tutorials/git/CourseTableOfContents";
  if (courseSlug === "sql-basics") return "/tutorials/sql/CourseTableOfContents";
  return null;
}

export function courseLessonPath(courseSlug: string, lessonSlug: string): string | null {
  if (courseSlug === "python-basics") {
    const route = pythonRoutesByLessonSlug[lessonSlug];
    return route ? `/tutorials/python/${route}` : null;
  }
  if (courseSlug === "html-basics") return `/tutorials/html/${lessonSlug}`;
  if (courseSlug === "css-basics") return `/tutorials/css/${lessonSlug}`;
  if (courseSlug === "javascript-basics") return `/tutorials/javascript/${lessonSlug}`;
  if (courseSlug === "git-basics") return `/tutorials/git/${lessonSlug}`;
  if (courseSlug === "sql-basics") return `/tutorials/sql/${lessonSlug}`;
  return null;
}
