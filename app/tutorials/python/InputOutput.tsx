import { router, useNavigation } from "expo-router";
import PythonTutorialTemplate from "./PythonTutorialTemplate";
import { useEffect } from "react";
import { P, TutorialH4 as H4 } from "@/components/UI/typography/Typography";
import CodeSnippet from "@/components/UI/code_snippets/CodeSnippet";
import { Image } from "expo-image";
import TutorialImage from "@/components/tutorials/TutorialImage";
import Section from "@/components/tutorials/Section";
import InteractiveExercise from "@/components/tutorials/exercises/InteractiveExercise";

export default function Operators() {
  const navigation = useNavigation();

  const inputCodeSnippet = `name = input("Enter your name: ")`;
  const sayHelloCodeSnippet = `name = input("Enter your name: ")
print(f"Hello, {name}!")`;

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <PythonTutorialTemplate
      title={"קלט ופלט"}
      onNextPage={function (): void {
        router.navigate("/tutorials/python/IFElse");
      }}
      nextPageTitle="התניות"
    >
      <P>
        קלט הוא מידע אשר התוכנית מקבלת מהמשתמש, ופלט הוא מידע שהתוכנית מעבירה
        חזרה למשתמש.
      </P>
      <Image
        source={require("@/assets/images/tutorials/inputOutput.png")}
        style={{
          width: "100%",
          aspectRatio: 8.41,
          marginTop: 24,
          marginBottom: 24,
        }}
      />
      <P style={{ marginBottom: 16 }}>
        אפשר למצוא קלט ופלט גם בחיי היומיום. מחשבון מקבל תרגיל כקלט ומציג תוצאה
        כפלט; אפליקציית ניווט מקבלת יעד ומציגה מסלול.
      </P>
      <TutorialImage
        source={require("@/assets/images/tutorials/comics/inputOutput.jpg")}
      />
      <Section style={{ marginTop: 32 }}>
        <H4>קלט ופלט בפייתון</H4>
        <P style={{ marginBottom: 16 }}>
          הפעולה input מציגה בקשה, ממתינה שהמשתמש יקליד וילחץ Enter, ומחזירה את
          הטקסט שהוקלד. בדרך כלל נשמור אותו במשתנה כדי להשתמש בו בהמשך.
        </P>
        <CodeSnippet language="python" code={inputCodeSnippet} />

        <P style={{ marginBottom: 16 }}>
          למשל, קטע הקוד הזה יבקש מהמשתמש להקליד את השם שלו, וישמור את התוצאה
          במשתנה בשם name.
        </P>
        <P style={{ marginBottom: 16 }}>
          התוכנית הבאה קולטת שם ומשלבת אותו בתוך הודעה. האות f לפני המחרוזת
          מאפשרת להציב בתוכה את הערך של name בעזרת סוגריים מסולסלים.
        </P>
        <CodeSnippet language="python" code={sayHelloCodeSnippet} />
      </Section>

      <Section>
        <H4>input תמיד מחזירה טקסט</H4>
        <P style={{ marginBottom: 12 }}>
          גם כשהמשתמש מקליד ספרות, התוצאה של input היא מחרוזת. כדי לבצע חישוב
          ממירים אותה ל־int או ל־float.
        </P>
        <CodeSnippet
          language="python"
          code={`age_text = input("Enter your age: ")
age = int(age_text)
print(age + 1)`}
        />
        <P>
          אם המשתמש יקליד 20, התוכנית תציג 21. בלי int, החיבור למספר היה גורם
          לשגיאה מפני שאי אפשר לחבר ישירות מחרוזת ומספר.
        </P>
      </Section>

      <InteractiveExercise
        exercise={{
          id: "python-input-output-fill-blank-1",
          type: "fill_blank",
          prompt: "איזו פעולה חסרה כדי לחשב את הגיל בשנה הבאה?",
          code: `age = ___(input("Age: "))
print(age + 1)`,
          options: [
            { id: "int", label: "int" },
            { id: "str", label: "str" },
            { id: "print", label: "print" },
          ],
          correctOptionId: "int",
          hint: "input מחזירה טקסט, אבל החיבור מתבצע עם מספר.",
          explanation: "int ממירה את הטקסט שהוקלד למספר שלם שאפשר לחבר אליו 1.",
        }}
      />
    </PythonTutorialTemplate>
  );
}
