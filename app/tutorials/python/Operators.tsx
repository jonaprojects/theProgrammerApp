import { router, useNavigation } from "expo-router";
import PythonTutorialTemplate from "./PythonTutorialTemplate";
import { useEffect } from "react";
import { P, TutorialH4 as H4 } from "@/components/UI/typography/Typography";
import CodeSnippet from "@/components/UI/code_snippets/CodeSnippet";
import { Image } from "expo-image";
import TutorialImage from "@/components/tutorials/TutorialImage";
import Section from "@/components/tutorials/Section";

export default function Operators() {
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
      title={"אופרטורים"}
      onNextPage={function (): void {
        router.navigate("/tutorials/python/InputOutput");
      }}
      nextPageTitle="קלט ופלט"
    >
      <P style={{ marginBottom: 16 }}>
        אופרטורים הם פעולות מיוחדות שאנחנו יכולים לבצע על ערכים ועל משתנים
        שמחזיקים אותם. אופרטורים הם לא יחודיים למדעי המחשב - למעשה, כל מי שרכש
        השכלה בכיתה א ו-ב כנראה התעסק איתם לא מעט.{" "}
      </P>
      <Section>
        <H4>אופרטורים אריתמטיים</H4>
        <P style={{ marginBottom: 16 }}>
          אופרטורים אריתמטיים הם אופרטורים הפועלים על מספרים - אותם כבר הכרנו
          בבית הספר. לדוגמה: חיבור (+), חיסור (-), כפל (*), וחילוק (/) האם
          אופרטורים אריתמטיים נתמכים בפייתון.
        </P>
      </Section>
      <Section>
        <H4>אופרטורים השוואתיים</H4>
        <P style={{ marginBottom: 16 }}>
          אופרטורים השוואתיים מאפשרים לנו להשוות בין ערכים שונים. האופרטורים
          ההשוואתיים מחזירים ביטוי בוליאני, כלומר True או False.
        </P>
        <P
          style={{ marginBottom: 16 }}
        >{`האופרטורים < ו-=< מאפשרים לנו לבדוק האם ערך  גדול או גדול שווה מערך אחר.`}</P>
        <P
          style={{ marginBottom: 16 }}
        >{`האופרטורים > ו- => בודקים האם ערך כלשהו קטן או קטן שווה מערך אחר.`}</P>
        <P style={{ marginBottom: 16 }}>
          האופרטור == בודק האם שני ערכים הם שווים. למשל, הביטוי 3 == 3 יפושט
          ל-True מפני שאכן 3 שווה ל-3, אך 2 == 4 יהיה False מפני ש-2 לא שווה
          ל-4.
        </P>
        <P>
          האופרטור =! עושה בדיוק את ההפך. הוא בודק האם שני ערכים אינם שווים.
          למשל, הביטוי 3 =! 3 יפושט ל- False מפני ש-3 שווה ל-3, והביטוי 2 == 4
          יפושט ל-True מפני ש-2 לא שווה ל-4.
        </P>
      </Section>

      {/* <TutorialImage
        source={require("@/assets/images/tutorials/comics/variables.webp")}
      /> */}
    </PythonTutorialTemplate>
  );
}
