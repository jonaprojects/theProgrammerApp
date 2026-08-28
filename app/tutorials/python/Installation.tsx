import { router, useNavigation } from "expo-router";
import PythonTutorialTemplate from "./PythonTutorialTemplate";
import { useEffect } from "react";
import { P, TutorialH4 as H4 } from "@/components/UI/typography/Typography";
import CodeSnippet from "@/components/UI/code_snippets/CodeSnippet";
import Section from "@/components/tutorials/Section";
import InteractiveExercise from "@/components/tutorials/exercises/InteractiveExercise";

export default function Installation() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <PythonTutorialTemplate
      title={"פייתון - התקנה"}
      onNextPage={function (): void {
        router.navigate("/tutorials/python/FirstPythonProgram");
      }}
      nextPageTitle="תוכנית ראשונה בפייתון"
    >
      <P style={{ marginBottom: 16 }}>
        כדי להריץ קוד במחשב צריך להתקין גרסה נתמכת של Python 3. מורידים אותה
        מהאתר הרשמי של Python ומתקינים לפי ההוראות של מערכת ההפעלה.
      </P>

      <Section>
        <H4>Windows</H4>
        <P style={{ marginBottom: 12 }}>
          אפשר להתקין את Python Install Manager מהאתר הרשמי או מחנות Microsoft.
          לאחר ההתקנה פתחו Terminal או PowerShell ובדקו שהפקודה python זמינה.
          אם המתקין מציע להוסיף את Python ל־PATH, אפשר לאשר זאת כדי שהפקודה תהיה
          זמינה מכל תיקייה.
        </P>
        <CodeSnippet language="powershell" code={`python --version
py --version`} />
      </Section>

      <Section>
        <H4>macOS ו־Linux</H4>
        <P style={{ marginBottom: 12 }}>
          ב־macOS אפשר להשתמש במתקין הרשמי. בהפצות Linux רבות Python כבר מותקנת.
          במערכות אלה שם הפקודה הוא בדרך כלל python3:
        </P>
        <CodeSnippet language="bash" code={`python3 --version`} />
        <P>
          אם מופיע מספר גרסה שמתחיל ב־3, ההתקנה מוכנה. אין למחוק גרסת Python
          שמגיעה עם מערכת ההפעלה; מתקינים גרסה נוספת לצורכי הלימוד.
        </P>
      </Section>

      <Section>
        <H4>איפה כותבים את הקוד?</H4>
        <P style={{ marginBottom: 12 }}>
          ההתקנה הרשמית כוללת את IDLE, עורך פשוט שמתאים להתחלה. אפשר גם להשתמש
          ב־VS Code או PyCharm. לא משנה באיזה עורך בוחרים—קבצי Python נשמרים
          בסיומת ‎.py.
        </P>
        <P>
          אם אי אפשר להתקין תוכנה כרגע, אפשר להמשיך בעורך מקוון. העיקר שתהיה
          דרך לכתוב קוד, להריץ אותו ולראות את הפלט.
        </P>
      </Section>

      <InteractiveExercise
        exercise={{
          id: "python-installation-fill-blank-1",
          type: "fill_blank",
          prompt: "איזה חלק משלים את הפקודה שבודקת את גרסת Python?",
          language: "bash",
          code: "python ___",
          options: [
            { id: "version", label: "--version" },
            { id: "install", label: "--install" },
            { id: "run", label: "--run" },
          ],
          correctOptionId: "version",
          hint: "אנחנו רוצים לבקש מהפקודה להציג את מספר הגרסה.",
          explanation: "האפשרות --version מציגה את גרסת Python שנמצאה במערכת.",
        }}
      />
    </PythonTutorialTemplate>
  );
}
