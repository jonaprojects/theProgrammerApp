import { useEffect, useState } from "react";
import { Href, router, useNavigation, usePathname } from "expo-router";

import TutorialTemplate from "@/app/tutorials/template/TutorialTemplate";
import CodeSnippet from "@/components/UI/code_snippets/CodeSnippet";
import { P, TutorialH4 as H4 } from "@/components/UI/typography/Typography";
import { useProgress } from "@/context/ProgressContext";
import { api } from "@/services/api/client";
import InteractiveExercise from "./exercises/InteractiveExercise";
import type { TutorialLessonContent } from "./PythonLessonPage";
import Section from "./Section";

type Props = {
  lesson: TutorialLessonContent;
  courseSlug: string;
  lessonSlugs: ReadonlySet<string>;
  tableOfContentsPath: string;
  defaultLanguage: string;
  headerBackgroundImg?: number;
};

export default function CatalogLessonPage(props: Props) {
  const navigation = useNavigation();
  const pathname = usePathname();
  const { progress, refresh } = useProgress();
  const [saving, setSaving] = useState(false);
  const [progressError, setProgressError] = useState<string | null>(null);
  const routeName = pathname.split("/").filter(Boolean).at(-1) ?? "";
  const lessonSlug = props.lessonSlugs.has(routeName) ? routeName : undefined;

  useEffect(() => navigation.setOptions({ headerShown: false }), [navigation]);

  useEffect(() => {
    if (!lessonSlug) return;
    api.updateLessonProgress(props.courseSlug, lessonSlug, "in_progress")
      .then(() => refresh())
      .catch(() => setProgressError("לא הצלחנו לשמור את ההתקדמות. בדקו את החיבור ונסו שוב."));
  }, [lessonSlug, props.courseSlug, refresh]);

  const lessonProgress = progress?.enrollments
    .find(({ courseSlug }) => courseSlug === props.courseSlug)
    ?.lessons.find(({ lessonSlug: slug }) => slug === lessonSlug);

  const saveCompletion = async () => {
    if (!lessonSlug || saving) return false;
    setSaving(true);
    setProgressError(null);
    try {
      await api.updateLessonProgress(props.courseSlug, lessonSlug, "completed");
      await refresh();
      return true;
    } catch {
      setProgressError("שמירת סיום השיעור נכשלה. נסו שוב.");
      return false;
    } finally {
      setSaving(false);
    }
  };

  const continueToNext = props.lesson.next ? async () => {
    if (await saveCompletion()) router.navigate(props.lesson.next!.path as Href<string | object>);
  } : undefined;
  const completeCourse = !props.lesson.next ? async () => {
    if (lessonProgress?.status === "completed" || await saveCompletion()) {
      router.replace(props.tableOfContentsPath as Href<string | object>);
    }
  } : undefined;

  return (
    <TutorialTemplate
      headerBackgroundImg={props.headerBackgroundImg}
      headerTitle={props.lesson.title}
      onNextPage={continueToNext}
      nextPageTitle={props.lesson.next?.title}
      onComplete={completeCourse}
      completionLabel={lessonProgress?.status === "completed" ? "חזרה לתוכן הקורס" : "סיום הקורס"}
      completionPending={saving}
      progressError={progressError}
      tableOfContentsPath={props.tableOfContentsPath}
    >
      {props.lesson.intro.map((paragraph, index) => <P key={`intro-${index}`} style={{ marginBottom: 12 }}>{paragraph}</P>)}
      {props.lesson.sections.map((section, sectionIndex) => (
        <Section key={`${section.title ?? "section"}-${sectionIndex}`}>
          {section.title ? <H4>{section.title}</H4> : null}
          {section.paragraphs?.map((paragraph, paragraphIndex) => <P key={`paragraph-${paragraphIndex}`} style={{ marginBottom: 12 }}>{paragraph}</P>)}
          {section.code ? <CodeSnippet language={section.language ?? props.defaultLanguage} code={section.code} /> : null}
          {section.exercise ? <InteractiveExercise exercise={section.exercise} /> : null}
          {section.exercises?.map((exercise) => <InteractiveExercise key={exercise.id} exercise={exercise} />)}
        </Section>
      ))}
    </TutorialTemplate>
  );
}
