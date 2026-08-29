import CodeSnippet from "@/components/UI/code_snippets/CodeSnippet";
import { P, TutorialH4 as H4 } from "@/components/UI/typography/Typography";
import { Href, router, useNavigation } from "expo-router";
import { useEffect } from "react";
import Section from "./Section";
import PythonTutorialTemplate from "@/app/tutorials/python/PythonTutorialTemplate";
import InteractiveExercise from "./exercises/InteractiveExercise";
import type { TutorialExerciseDefinition } from "./exercises/types";

export type PythonLessonSection = {
  title?: string;
  paragraphs?: string[];
  code?: string;
  language?: string;
  exercise?: TutorialExerciseDefinition;
};

export type TutorialLessonContent = {
  title: string;
  intro: string[];
  sections: PythonLessonSection[];
  next?: { title: string; path: string };
};

export type PythonLessonContent = TutorialLessonContent;

export default function PythonLessonPage({ lesson }: { lesson: PythonLessonContent }) {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <PythonTutorialTemplate
      title={lesson.title}
      onNextPage={
        lesson.next
          ? () => router.navigate(lesson.next!.path as Href<string | object>)
          : undefined
      }
      nextPageTitle={lesson.next?.title}
    >
      {lesson.intro.map((paragraph, index) => (
        <P key={`intro-${index}`} style={{ marginBottom: 12 }}>
          {paragraph}
        </P>
      ))}

      {lesson.sections.map((section, sectionIndex) => (
        <Section key={`${section.title ?? "section"}-${sectionIndex}`}>
          {section.title ? <H4>{section.title}</H4> : null}
          {section.paragraphs?.map((paragraph, paragraphIndex) => (
            <P key={`paragraph-${paragraphIndex}`} style={{ marginBottom: 12 }}>
              {paragraph}
            </P>
          ))}
          {section.code ? (
            <CodeSnippet language={section.language ?? "python"} code={section.code} />
          ) : null}
          {section.exercise ? (
            <InteractiveExercise exercise={section.exercise} />
          ) : null}
        </Section>
      ))}
    </PythonTutorialTemplate>
  );
}
