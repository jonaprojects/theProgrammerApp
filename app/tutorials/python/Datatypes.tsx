import { router, useNavigation } from "expo-router";
import PythonTutorialTemplate from "./PythonTutorialTemplate";
import { useEffect } from "react";
import { P, TutorialH4 as H4 } from "@/components/UI/typography/Typography";
import CodeSnippet from "@/components/UI/code_snippets/CodeSnippet";
import { Image } from "expo-image";
import TutorialImage from "@/components/tutorials/TutorialImage";
import Section from "@/components/tutorials/Section";

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
        <P>
          בפייתון יש 4 סוגי נתונים בסיסיים, או בלשון פורמלי יותר, 4 טיפוסי
          נתונים פרימיטבים.
        </P>
      </Section>

      <P style={{ marginBottom: 16 }}></P>
    </PythonTutorialTemplate>
  );
}
