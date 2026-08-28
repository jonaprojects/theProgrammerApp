export function getCourseImage(imageKey: string | null): number {
  if (imageKey?.includes("html")) {
    return require("@/assets/images/courses/htmlCourseCard.png");
  }
  return require("@/assets/images/courses/pythonCourseCard.png");
}
