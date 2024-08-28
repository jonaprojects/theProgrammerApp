import { router, useNavigation } from "expo-router";
import PythonTutorialTemplate from "./PythonTutorialTemplate";
import { useEffect } from "react";
import { P, TutorialH4 as H4 } from "@/components/UI/typography/Typography";
import CodeSnippet from "@/components/UI/code_snippets/CodeSnippet";
import { Image } from "expo-image";
import TutorialImage from "@/components/tutorials/TutorialImage";
import Section from "@/components/tutorials/Section";

export default function IfElse() {
  const navigation = useNavigation();
  const clubCodeSnippet = `age = int(input("Enter your age: "))
if age >= 18:
    print("You can enter the club!")`;

  const clubElseCodeSnippet = `age = int(input("Enter your age: "))
if age >= 18:
    print("You can enter the club!")
else: 
    print("You can't enter the club!")
`;

  const psuedoCode = `אם התנאי מתקיים:
    תריץ את השורות בבלוק הזה

אחרת: 
    תריץ את השורות בבלוק הזה
`;
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <PythonTutorialTemplate
      title={"קלט ופלט"}
      onNextPage={function (): void {
        router.navigate("/tutorials/python/Intro");
      }}
      nextPageTitle=" elif התניות"
    >
      <P style={{ marginBottom: 16 }}>
        אפשר לומר התניות הן ״הלחם והחמאה״ של עולם התכנות. הן מאפשרות לנו לבצע
        פעולות שונות בהתאם לתנאים שונים.
      </P>
      <Section>
        <H4>בלוק if</H4>
        <P style={{ marginBottom: 16 }}>
          באמצעות שימוש בבלוק if נדאג ששורות הקוד שבתוך הבלוק ירוצו רק אם התנאי
          מתקיים. התנאי הוא ביטוי בוליאני, כלומר ביטוי שמפושט ל-True או False.
        </P>
        <CodeSnippet language="" code={psuedoCode} />
        <P style={{ marginBottom: 16 }}>
          לדוגמה, נניח שנרצה לכתוב תוכנית למועדון שמוודאת שרק בני 18 ומעלה יהיו
          מורשים להיכנס.
        </P>
        <CodeSnippet language="python" code={clubCodeSnippet} />

        <P
          style={{ marginBottom: 16 }}
        >{`אם הגיל של המשתמש הוא לפחות 18, אז הביטוי  age >= 18 יפושט ל-True ולכן התנאי מתקיים, וכל שורות הקוד בבלוק ה-if יתבצעו. במקרה הזה יודפס חזרה: “You can enter the club!”. אחרת, לא יתבצע שום דבר.`}</P>
        <TutorialImage
          source={require("@/assets/images/tutorials/comics/ifElse1.png")}
        />
      </Section>

      <Section>
        <H4>בלוק else</H4>
        <P style={{ marginBottom: 16 }}>
          בלוק ה-else יכול להגיע לאחר בלוק ה-if, והקוד שבתוכו יתבצע אם התנאי לא
          מתקיים.
        </P>
        <P style={{ marginBottom: 16 }}>
          למשל, בדוגמה הקודמת, ייתכן שנרצה להדפיס הודעה למשתמשים שלא מלאו להם 18
          שנים שתיידע אותם שהם לא מורשים להיכנס למועדון.
        </P>

        <CodeSnippet language="python" code={clubElseCodeSnippet} />
      </Section>
    </PythonTutorialTemplate>
  );
}
