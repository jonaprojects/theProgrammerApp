import { router, useNavigation } from "expo-router";
import PythonTutorialTemplate from "./PythonTutorialTemplate";
import { useEffect } from "react";
import { P, TutorialH4 as H4 } from "@/components/UI/typography/Typography";
import CodeSnippet from "@/components/UI/code_snippets/CodeSnippet";
import TutorialImage from "@/components/tutorials/TutorialImage";
import Section from "@/components/tutorials/Section";
import InteractiveExercise from "@/components/tutorials/exercises/InteractiveExercise";

export default function Datatypes() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <PythonTutorialTemplate
      title={"סוגי נתונים"}
      onNextPage={function (): void {
        router.navigate("/tutorials/python/Variables");
      }}
      nextPageTitle="משתנים"
    >
      <P style={{ marginBottom: 16 }}>
        בתכנות אנו עובדים עם כל מיני סוגים של נתונים; מספרים, תווים, מחרוזות
        וכדומה. גם בפייתון כל ערך שאנו יוצרים שייך לאחד הסוגים האלה.
      </P>
      <TutorialImage
        source={require("@/assets/images/tutorials/comics/datatypes1.png")}
      />
      <Section>
        <H4 style={{ marginTop: 16, marginBottom: 8 }}>
          למה צריכים סוגי נתונים?
        </H4>

        <P>
          כדי לדעת איך להתייחס למידע. למשל, נוכל לבצע פעולות מתמטיות על מספרים,
          אבל לא על טקסט.
        </P>
      </Section>

      <Section>
        <H4>סוגי נתונים בפייתון</H4>
        <P style={{ marginBottom: 12 }}>
          נתחיל מארבעה טיפוסים נפוצים: מספר שלם, מספר עשרוני, מחרוזת וערך
          בוליאני. לכל אחד יש דרך כתיבה והתנהגות משלו.
        </P>
        <CodeSnippet
          language="python"
          code={`age = 24             # int — מספר שלם
price = 19.90        # float — מספר עשרוני
name = "Dana"        # str — טקסט
is_student = True    # bool — נכון או לא נכון`}
        />
      </Section>

      <Section>
        <H4>מספר אינו טקסט</H4>
        <P style={{ marginBottom: 12 }}>
          הערך 5 הוא מספר, אבל הערך "5" הוא מחרוזת שמכילה תו. על מספרים אפשר
          לבצע חיבור מתמטי; חיבור מחרוזות מצמיד אותן זו לזו.
        </P>
        <CodeSnippet
          language="python"
          code={`print(5 + 2)        # 7
print("5" + "2")    # 52`}
        />
      </Section>

      <Section>
        <H4>בדיקת הטיפוס והמרה</H4>
        <P style={{ marginBottom: 12 }}>
          הפעולה type מגלה מהו הטיפוס של ערך. הפעולות int, float ו־str יוצרות
          ערך מטיפוס אחר, כל עוד ההמרה הגיונית.
        </P>
        <CodeSnippet
          language="python"
          code={`value = "12"
print(type(value))  # <class 'str'>

number = int(value)
print(number + 3)   # 15`}
        />
        <P>
          ניסיון להמיר טקסט שאינו מספר, למשל int("hello"), יגרום לשגיאה. בהמשך
          נלמד כיצד לבדוק קלט לפני שמשתמשים בו.
        </P>
      </Section>

      <InteractiveExercise
        exercise={{
          id: "python-datatypes-predict-output-1",
          type: "predict_output",
          prompt: "מה יודפס בתוכנית?",
          code: `value = "4"
print(value + value)`,
          options: [
            { id: "44", label: "44" },
            { id: "8", label: "8" },
            { id: "error", label: "תתרחש שגיאה" },
          ],
          correctOptionId: "44",
          hint: "המרכאות הופכות את 4 למחרוזת, לא למספר.",
          explanation: "חיבור שתי מחרוזות מצמיד אותן, ולכן \"4\" + \"4\" יוצר את \"44\".",
        }}
      />
    </PythonTutorialTemplate>
  );
}
