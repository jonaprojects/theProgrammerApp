import { router, useNavigation } from "expo-router";
import PythonTutorialTemplate from "./PythonTutorialTemplate";
import { useEffect } from "react";
import { P, TutorialH4 as H4 } from "@/components/UI/typography/Typography";
import CodeSnippet from "@/components/UI/code_snippets/CodeSnippet";
import TutorialImage from "@/components/tutorials/TutorialImage";
import Section from "@/components/tutorials/Section";
import InteractiveExercise from "@/components/tutorials/exercises/InteractiveExercise";

export default function Variables() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const nameVariable = `name = "roni"
print(name)`;

  const xVariable = `x = 4
print(x)`;

  return (
    <PythonTutorialTemplate
      title={"משתנים"}
      onNextPage={function (): void {
        router.navigate("/tutorials/python/Operators");
      }}
      nextPageTitle="אופרטורים"
    >
      <P style={{ marginBottom: 16 }}>
        משתנים מאפשרים לנו לשמור ערכים ולהשתמש בהם כמה פעמים במהלך התוכנית.
      </P>
      <P style={{ marginBottom: 16 }}>
        אפשר לחשוב על משתנים בתור מגירות בזיכרון המחשב, כך שכאשר אנחנו יוצרים
        משתנה חדש ומכניסים לו ערך, אנחנו בעצם מכניסים מסמך חדש למגירה. כאשר נרצה
        להשתמש בערך פעם נוספת, נפתח את המגירה ונשלוף את המסמך.
      </P>

      <TutorialImage
        source={require("@/assets/images/tutorials/comics/variables.webp")}
      />
      <Section>
        <P>לכל משתנה יש 3 תכונות עיקריות:</P>
        <P style={{ marginBottom: 16 }}>
          שם, טיפוס וערך. לדוגמה, במשתנה age השם הוא age, הטיפוס יכול להיות int,
          והערך יכול להיות 24.
        </P>
      </Section>

      <H4>משתנים בפייתון</H4>
      <P style={{ marginBottom: 16 }}>
        מאוד קל ליצור משתנים חדשים בפייתון. פשוט נרשום את שם המשתנה, סימן ‘=’,
        ואת הערך. למשל, כך נוכל ליצור משתנה name שמכיל את הערך “roni”
      </P>

      <CodeSnippet language="python" code={nameVariable} />
      <P style={{ marginBottom: 16 }}>
        בדוגמה זו, name הוא שם המשתנה והערך הוא “roni”, שזה ערך מסוג מחרוזת.
        כאשר אנו ניגשים ל-name, אנחנו בעצם שולפים את הערך “roni” שהוא מכיל, ולכן
        יודפס על המסך “roni”.
      </P>
      <P>באופן דומה, נוכל ליצור משתנה ששמו x וערכו 4, ולהדפיס אותו על המסך.</P>
      <CodeSnippet language="python" code={xVariable} />
      <Section>
        <H4>כללים ביצירת משתנים</H4>
        <P style={{ marginBottom: 16 }}>
          כאשר יוצרים משתנה חדש בפייתון יש לעקוב אחר מספר חוקים שנוגעים לשמו של
          המשתנה. שם יכול להכיל אותיות, ספרות ומקף תחתון - כלומר:
          A-Z, a-z, 0-9, _ (מקף תחתון). בנוסף, שמו של המשתנה לא יכול להתחיל
          בספרה, ואסור להשתמש במילה שמורה כמו if או for.
        </P>
        <P style={{ marginBottom: 16 }}>
          מומלץ להעניק למשתנים שמות בהתאם למה שהם מייצגים. למשל אם נרצה לשמור שם
          של אדם, נקרא למשתנה name ולא x. בכך אנו מונעים בלבול רב ושגיאות רבות
          במהלך הקוד והופכים אותו ליותר קריא וברור.
        </P>
        <P style={{ marginBottom: 16 }}>
          יתר על כן, כאשר השם מורכב מכמה מילים, מומלץ לחבר ביניהן במקפים תחתונים
          (snake case). לדוגמה:
        </P>
        <CodeSnippet language="python" code={`num_of_participants = 4`} />
      </Section>

      <Section>
        <H4>עדכון ערך</H4>
        <P style={{ marginBottom: 12 }}>
          סימן השוויון כאן אינו שאלה מתמטית. הוא אומר: חשבו את הביטוי בצד ימין
          ושמרו את התוצאה במשתנה שבצד שמאל.
        </P>
        <CodeSnippet
          language="python"
          code={`score = 10
score = score + 5
print(score)  # 15`}
        />
        <P>
          בשורה השנייה Python קוראת קודם את הערך הישן של score, מוסיפה 5, ואז
          מחליפה את הערך השמור בתוצאה החדשה.
        </P>
      </Section>

      <InteractiveExercise
        exercise={{
          id: "python-variables-trace-1",
          type: "trace",
          prompt: "מה יהיה הערך של points בסוף?",
          code: `points = 4
points = points + 3
points = points * 2`,
          options: [
            { id: "14", label: "14" },
            { id: "10", label: "10" },
            { id: "11", label: "11" },
          ],
          correctOptionId: "14",
          hint: "עברו שורה־שורה ועדכנו את הערך אחרי כל פעולה.",
          explanation: "מתחילים ב־4, מוסיפים 3 ומקבלים 7, ואז מכפילים ב־2 ומקבלים 14.",
        }}
      />
    </PythonTutorialTemplate>
  );
}
