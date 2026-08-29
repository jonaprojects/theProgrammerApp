import { PropsWithChildren, useEffect, useState } from "react";
import { router, usePathname } from "expo-router";

import TutorialTemplate from "../template/TutorialTemplate";
import { api } from "@/services/api/client";
import { useProgress } from "@/context/ProgressContext";
import { htmlLessons } from "@/data/tutorials/html/lessons";

type HtmlTutorialTemplateProps = PropsWithChildren<{
  title: string;
  onNextPage?: () => void;
  nextPageTitle?: string;
}>;

export default function HtmlTutorialTemplate(props: HtmlTutorialTemplateProps) {
  const pathname = usePathname();
  const { progress, refresh: refreshProgress } = useProgress();
  const [saving, setSaving] = useState(false);
  const [progressError, setProgressError] = useState<string | null>(null);
  const routeName = pathname.split("/").filter(Boolean).at(-1) ?? "";
  const lessonSlug = routeName in htmlLessons ? routeName : undefined;

  useEffect(() => {
    if (!lessonSlug) return;
    api.updateLessonProgress("html-basics", lessonSlug, "in_progress")
      .then(() => refreshProgress())
      .catch(() => setProgressError("לא הצלחנו לשמור את ההתקדמות. בדקו את החיבור ונסו שוב."));
  }, [lessonSlug, refreshProgress]);

  const lessonProgress = progress?.enrollments
    .find(({ courseSlug }) => courseSlug === "html-basics")
    ?.lessons.find(({ lessonSlug: slug }) => slug === lessonSlug);

  const saveCompletion = async () => {
    if (!lessonSlug || saving) return false;
    setSaving(true);
    setProgressError(null);
    try {
      await api.updateLessonProgress("html-basics", lessonSlug, "completed");
      await refreshProgress();
      return true;
    } catch {
      setProgressError("שמירת סיום השיעור נכשלה. נסו שוב.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const completeAndContinue = props.onNextPage
    ? async () => {
        if (await saveCompletion()) props.onNextPage?.();
      }
    : undefined;

  const completeCourse = !props.onNextPage
    ? async () => {
        if (lessonProgress?.status === "completed" || await saveCompletion()) {
          router.replace("/tutorials/html/CourseTableOfContents");
        }
      }
    : undefined;

  return (
    <TutorialTemplate
      headerBackgroundImg={require("@/assets/images/courses/htmlCourseCard.png")}
      headerTitle={props.title}
      onNextPage={completeAndContinue}
      nextPageTitle={props.nextPageTitle}
      onComplete={completeCourse}
      completionLabel={lessonProgress?.status === "completed" ? "חזרה לתוכן הקורס" : "סיום הקורס"}
      completionPending={saving}
      progressError={progressError}
      tableOfContentsPath="/tutorials/html/CourseTableOfContents"
    >
      {props.children}
    </TutorialTemplate>
  );
}
