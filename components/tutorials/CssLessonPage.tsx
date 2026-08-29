import { useEffect } from "react";
import { Href, router, useNavigation } from "expo-router";

import CssTutorialTemplate from "@/app/tutorials/css/CssTutorialTemplate";
import CodeSnippet from "@/components/UI/code_snippets/CodeSnippet";
import { P, TutorialH4 as H4 } from "@/components/UI/typography/Typography";
import type { TutorialLessonContent } from "./PythonLessonPage";
import InteractiveExercise from "./exercises/InteractiveExercise";
import Section from "./Section";

export default function CssLessonPage({ lesson }: { lesson: TutorialLessonContent }) {
  const navigation = useNavigation();
  useEffect(() => navigation.setOptions({ headerShown: false }), [navigation]);

  return (
    <CssTutorialTemplate
      title={lesson.title}
      onNextPage={lesson.next ? () => router.navigate(lesson.next!.path as Href<string | object>) : undefined}
      nextPageTitle={lesson.next?.title}
    >
      {lesson.intro.map((paragraph, index) => <P key={`intro-${index}`} style={{ marginBottom: 12 }}>{paragraph}</P>)}
      {lesson.sections.map((section, sectionIndex) => (
        <Section key={`${section.title ?? "section"}-${sectionIndex}`}>
          {section.title ? <H4>{section.title}</H4> : null}
          {section.paragraphs?.map((paragraph, paragraphIndex) => <P key={`paragraph-${paragraphIndex}`} style={{ marginBottom: 12 }}>{paragraph}</P>)}
          {section.code ? <CodeSnippet language={section.language ?? "css"} code={section.code} /> : null}
          {section.exercise ? <InteractiveExercise exercise={section.exercise} /> : null}
        </Section>
      ))}
    </CssTutorialTemplate>
  );
}
