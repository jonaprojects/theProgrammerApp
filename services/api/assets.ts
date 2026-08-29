export function getCourseImage(imageKey: string | null): number {
  if (imageKey?.includes("javascript")) {
    return require("@/assets/images/courses/javascriptCourseCard.png");
  }
  if (imageKey?.includes("git")) {
    return require("@/assets/images/courses/gitCourseCard.png");
  }
  if (imageKey?.includes("sql")) {
    return require("@/assets/images/courses/sqlCourseCard.png");
  }
  if (imageKey?.includes("css")) {
    return require("@/assets/images/courses/cssCourseCard.png");
  }
  if (imageKey?.includes("html")) {
    return require("@/assets/images/courses/htmlCourseCard.png");
  }
  return require("@/assets/images/courses/pythonCourseCard.png");
}
