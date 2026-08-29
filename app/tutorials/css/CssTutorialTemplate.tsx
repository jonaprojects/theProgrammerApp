import { PropsWithChildren, useEffect, useState } from "react";
import { router, usePathname } from "expo-router";

import TutorialTemplate from "../template/TutorialTemplate";
import { api } from "@/services/api/client";
import { useProgress } from "@/context/ProgressContext";
import { cssLessons } from "@/data/tutorials/css/lessons";

type Props = PropsWithChildren<{ title: string; onNextPage?: () => void; nextPageTitle?: string }>;

export default function CssTutorialTemplate(props: Props) {
  const pathname = usePathname();
  const { progress, refresh } = useProgress();
  const [saving, setSaving] = useState(false);
  const [progressError, setProgressError] = useState<string | null>(null);
  const routeName = pathname.split("/").filter(Boolean).at(-1) ?? "";
  const lessonSlug = routeName in cssLessons ? routeName : undefined;

  useEffect(() => {
    if (!lessonSlug) return;
    api.updateLessonProgress("css-basics", lessonSlug, "in_progress")
      .then(() => refresh())
      .catch(() => setProgressError("לא הצלחנו לשמור את ההתקדמות. בדקו את החיבור ונסו שוב."));
  }, [lessonSlug, refresh]);

  const lessonProgress = progress?.enrollments
    .find(({ courseSlug }) => courseSlug === "css-basics")
    ?.lessons.find(({ lessonSlug: slug }) => slug === lessonSlug);

  const saveCompletion = async () => {
    if (!lessonSlug || saving) return false;
    setSaving(true);
    setProgressError(null);
    try {
      await api.updateLessonProgress("css-basics", lessonSlug, "completed");
      await refresh();
      return true;
    } catch {
      setProgressError("שמירת סיום השיעור נכשלה. נסו שוב.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const completeAndContinue = props.onNextPage ? async () => {
    if (await saveCompletion()) props.onNextPage?.();
  } : undefined;
  const completeCourse = !props.onNextPage ? async () => {
    if (lessonProgress?.status === "completed" || await saveCompletion()) {
      router.replace("/tutorials/css/CourseTableOfContents");
    }
  } : undefined;

  return (
    <TutorialTemplate
      headerTitle={props.title}
      onNextPage={completeAndContinue}
      nextPageTitle={props.nextPageTitle}
      onComplete={completeCourse}
      completionLabel={lessonProgress?.status === "completed" ? "חזרה לתוכן הקורס" : "סיום הקורס"}
      completionPending={saving}
      progressError={progressError}
      tableOfContentsPath="/tutorials/css/CourseTableOfContents"
    >
      {props.children}
    </TutorialTemplate>
  );
}
