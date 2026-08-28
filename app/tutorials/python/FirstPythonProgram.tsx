import { router, useNavigation } from "expo-router";
import PythonTutorialTemplate from "./PythonTutorialTemplate";
import { useEffect } from "react";
import { P, TutorialH4 as H4 } from "@/components/UI/typography/Typography";
import CodeSnippet from "@/components/UI/code_snippets/CodeSnippet";
import Section from "@/components/tutorials/Section";
import InteractiveExercise from "@/components/tutorials/exercises/InteractiveExercise";

export default function FirstPythonProgram() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <PythonTutorialTemplate
      title={"תוכנית ראשונה"}
      onNextPage={function (): void {
        router.navigate("/tutorials/python/Datatypes");
      }}
      nextPageTitle="סוגי נתונים"
    >
      <P style={{ marginBottom: 16 }}>
        הגיע הזמן לכתוב ולהריץ תוכנית אמיתית. נתחיל בשורה אחת, נבין כל חלק בה,
        ואז נשנה אותה בעצמנו.
      </P>
      <P style={{ marginBottom: 16 }}>
        פתחו את עורך הקוד וצרו קובץ בשם first.py. הסיומת ‎.py אומרת לעורך ולמערכת
        שזהו קובץ Python.
      </P>
      <P style={{ marginBottom: 16 }}>כתבו את שורת הקוד הבאה:</P>
      <CodeSnippet language="python" code={`print("Hello, world!")`} />
      <P style={{ marginBottom: 16, marginTop: 8 }}>
        הריצו את הקובץ מתוך העורך. אפשר גם לפתוח Terminal באותה תיקייה ולהריץ:
      </P>
      <CodeSnippet language="bash" code={`python first.py
# ב־macOS או Linux ייתכן שתשתמשו ב־python3 first.py`} />

      <Section>
        <H4>מה קורה בשורה הזו?</H4>
        <P style={{ marginBottom: 12 }}>
          print היא פעולה מובנית שמציגה ערך על המסך. הסוגריים מכילים את הערך
          שנעביר לפעולה, והמרכאות מסמנות שמדובר בטקסט. המרכאות עצמן אינן חלק
          מהפלט.
        </P>
        <CodeSnippet
          language="python"
          code={`print("Hello, world!")
print("I wrote my first program")`}
        />
        <P>
          Python מריצה את הקובץ מלמעלה למטה, ולכן ההודעה הראשונה תופיע לפני
          ההודעה השנייה.
        </P>
      </Section>

      <Section>
        <H4>אם מופיעה שגיאה</H4>
        <P>
          בדקו שהמרכאות והסוגריים נסגרו וששם הקובץ מסתיים ב־‎.py. הודעת השגיאה
          מציינת בדרך כלל את מספר השורה שבה Python הפסיקה להבין את הקוד.
        </P>
      </Section>

      <InteractiveExercise
        exercise={{
          id: "python-first-program-predict-output-1",
          type: "predict_output",
          prompt: "באיזה סדר יודפסו ההודעות?",
          code: `print("First")
print("Second")`,
          options: [
            { id: "first-second", label: "First\nSecond" },
            { id: "second-first", label: "Second\nFirst" },
            { id: "same-line", label: "First Second" },
          ],
          correctOptionId: "first-second",
          hint: "Python קוראת את הקובץ מלמעלה למטה.",
          explanation: "כל קריאה ל־print מוסיפה שורת פלט, לפי סדר השורות בקובץ.",
        }}
      />
    </PythonTutorialTemplate>
  );
}
