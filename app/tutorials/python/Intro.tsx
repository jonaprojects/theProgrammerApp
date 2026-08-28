import { router, useNavigation } from "expo-router";
import PythonTutorialTemplate from "./PythonTutorialTemplate";
import { useEffect } from "react";
import { P, TutorialH4 as H4 } from "@/components/UI/typography/Typography";
import CodeSnippet from "@/components/UI/code_snippets/CodeSnippet";
import Section from "@/components/tutorials/Section";
import InteractiveExercise from "@/components/tutorials/exercises/InteractiveExercise";

export default function Intro() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <PythonTutorialTemplate
      title={"פייתון - הקדמה"}
      onNextPage={function (): void {
        router.navigate("/tutorials/python/Installation");
      }}
      nextPageTitle="פייתון- התקנה"
    >
      <P style={{ marginBottom: 16 }}>
        פייתון היא שפת תכנות כללית שנוצרה בתחילת שנות ה־90. היא תוכננה כך שקוד
        יהיה קריא וברור, ולכן אפשר להתמקד ברעיון שרוצים לפתור ולא בהרבה סימנים
        טכניים.
      </P>

      <Section>
        <H4>למה להתחיל דווקא בפייתון?</H4>
        <P style={{ marginBottom: 12 }}>
          התחביר שלה קרוב יחסית לשפה רגילה. לדוגמה, השורה הבאה מבקשת מפייתון
          להציג הודעה על המסך:
        </P>
        <CodeSnippet language="python" code={`print("Hello, Python!")`} />
        <P>
          עדיין לא צריך לזכור איך print עובדת. הרעיון החשוב הוא שאפשר להבין
          בקירוב מה הקוד עושה כבר בקריאה הראשונה.
        </P>
      </Section>

      <Section>
        <H4>מה אפשר לבנות איתה?</H4>
        <P style={{ marginBottom: 12 }}>
          משתמשים בפייתון לאוטומציה, ניתוח נתונים, בינה מלאכותית, שרתי Web,
          בדיקות תוכנה וכלים קטנים שחוסכים עבודה ידנית. אותה שפה מתאימה גם
          לתוכנית ראשונה של כמה שורות וגם למערכות גדולות.
        </P>
        <P>
          במהלך הקורס נתחיל מהבסיס, נריץ דוגמאות קצרות, ואז נחבר את הרעיונות
          בהדרגה. אין צורך בניסיון קודם.
        </P>
      </Section>

      <InteractiveExercise
        exercise={{
          id: "python-intro-predict-output-1",
          type: "predict_output",
          prompt: "איזו הודעה תופיע על המסך?",
          code: `print("Hello, Python!")`,
          options: [
            { id: "hello", label: "Hello, Python!" },
            { id: "print", label: "print" },
            { id: "nothing", label: "לא יודפס דבר" },
          ],
          correctOptionId: "hello",
          hint: "הטקסט שנמצא בתוך הסוגריים הוא ההודעה ש־print מציגה.",
          explanation: "print מציגה את הטקסט שנמסר לה, ללא סימני המרכאות.",
        }}
      />
    </PythonTutorialTemplate>
  );
}
