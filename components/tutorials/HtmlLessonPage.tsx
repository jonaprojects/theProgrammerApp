import { useEffect } from "react";
import { Href, router, useNavigation } from "expo-router";

import CodeSnippet from "@/components/UI/code_snippets/CodeSnippet";
import { P, TutorialH4 as H4 } from "@/components/UI/typography/Typography";
import HtmlTutorialTemplate from "@/app/tutorials/html/HtmlTutorialTemplate";
import type { TutorialLessonContent } from "./PythonLessonPage";
import InteractiveExercise from "./exercises/InteractiveExercise";
import Section from "./Section";

export default function HtmlLessonPage({ lesson }: { lesson: TutorialLessonContent }) {
  const navigation = useNavigation();

  useEffect(() => navigation.setOptions({ headerShown: false }), [navigation]);

  return (
    <HtmlTutorialTemplate
      title={lesson.title}
      onNextPage={lesson.next ? () => router.navigate(lesson.next!.path as Href<string | object>) : undefined}
      nextPageTitle={lesson.next?.title}
    >
      {lesson.intro.map((paragraph, index) => (
        <P key={`intro-${index}`} style={{ marginBottom: 12 }}>{paragraph}</P>
      ))}
      {lesson.sections.map((section, sectionIndex) => (
        <Section key={`${section.title ?? "section"}-${sectionIndex}`}>
          {section.title ? <H4>{section.title}</H4> : null}
          {section.paragraphs?.map((paragraph, paragraphIndex) => (
            <P key={`paragraph-${paragraphIndex}`} style={{ marginBottom: 12 }}>{paragraph}</P>
          ))}
          {section.code ? <CodeSnippet language={section.language ?? "html"} code={section.code} /> : null}
          {section.exercise ? <InteractiveExercise exercise={section.exercise} /> : null}
        </Section>
      ))}
    </HtmlTutorialTemplate>
  );
}
