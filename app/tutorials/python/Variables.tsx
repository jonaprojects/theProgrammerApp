import { router, useNavigation } from "expo-router";
import PythonTutorialTemplate from "./PythonTutorialTemplate";
import { useEffect } from "react";
import { P, TutorialH4 as H4 } from "@/components/UI/typography/Typography";
import CodeSnippet from "@/components/UI/code_snippets/CodeSnippet";
import { Image } from "expo-image";
import TutorialImage from "@/components/tutorials/TutorialImage";
import Section from "@/components/tutorials/Section";

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
      nextPageTitle=""
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
          שם המשתנה, למשל x, name, my_variable וכו׳. טיפוס המשתנה: int, string,
          bool, float ערך: hello”, False, 6, 5.31” וכו׳...
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
          המשתנה. על שם המשתנה להכל רק תווים אלפא-נומרים ומקף תחתון - כלומר:
          A-Z, a-z, 0-9, _ (מקף תחתון). בנוסף, שמו של המשתנה לא יכול להתחיל
          בספרה
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
    </PythonTutorialTemplate>
  );
}
