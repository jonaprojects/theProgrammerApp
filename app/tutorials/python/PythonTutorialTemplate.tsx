import { P } from "@/components/UI/typography/Typography";
import TutorialTemplate from "../template/TutorialTemplate";
import Container from "@/components/UI/Container";
import { PropsWithChildren, useEffect, useState } from "react";
import { router, usePathname } from "expo-router";
import { pythonLessonSlugs } from "@/data/tutorials/python/lessonSlugs";
import { useProgress } from "@/context/ProgressContext";

type PythonTutorialTemplate = PropsWithChildren<{
  title: string;
  onNextPage?: () => void;
  nextPageTitle?: string;
}>;
export default function PythonTutorialTemplate(props: PythonTutorialTemplate) {
  const pathname = usePathname();
  const { progress, recordLessonProgress } = useProgress();
  const [saving, setSaving] = useState(false);
  const [progressError, setProgressError] = useState<string | null>(null);
  const routeName = pathname.split("/").filter(Boolean).at(-1) ?? "";
  const lessonSlug = pythonLessonSlugs[routeName];

  useEffect(() => {
    if (!lessonSlug) return;
    recordLessonProgress("python-basics", lessonSlug, "in_progress")
      .then(() => setProgressError(null))
      .catch(() => setProgressError("לא הצלחנו לשמור את ההתקדמות. בדקו את החיבור ונסו שוב."));
  }, [lessonSlug, recordLessonProgress]);

  const lessonProgress = progress?.enrollments
    .find(({ courseSlug }) => courseSlug === "python-basics")
    ?.lessons.find(({ lessonSlug: slug }) => slug === lessonSlug);

  const saveCompletion = async () => {
    if (!lessonSlug || saving) return false;
    setSaving(true);
    setProgressError(null);
    try {
      await recordLessonProgress("python-basics", lessonSlug, "completed");
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
          router.replace("/tutorials/python/CourseTableOfContents");
        }
      }
    : undefined;

  return (
    <TutorialTemplate
      headerBackgroundImg={require("@/assets/images/tutorials/headers/pythonTutorialHeader.png")}
      headerTitle={props.title}
      onNextPage={completeAndContinue}
      nextPageTitle={props.nextPageTitle}
      onComplete={completeCourse}
      completionLabel={lessonProgress?.status === "completed" ? "חזרה לתוכן הקורס" : "סיום הקורס"}
      completionPending={saving}
      progressError={progressError}
      tableOfContentsPath="/tutorials/python/CourseTableOfContents"
    >
      {props.children}
    </TutorialTemplate>
  );
}
