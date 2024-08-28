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

  const inputCodeSnippet = `name = input("Enter your name: ֿ")`;
  const sayHelloCodeSnippet = `name = input("Enter your name: ֿ")
print("hello, ",  name)`;

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
        למעשה, אפשר למצוא דוגמאות רבות לקלט ופלט גם בחיי היומיום שלנו. למשל,
        מכונת כביסה מקבלת כקלט בגדים מלוכלכים ומוציאה כפלט בגדים נקיים, מחשבון
        מקבל תרגיל חשבוני ומחזיר תוצאה, וכו’...
      </P>
      <TutorialImage
        source={require("@/assets/images/tutorials/comics/inputOutput.jpg")}
      />
      <Section style={{ marginTop: 32 }}>
        <H4>קלט ופלט בפייתון</H4>
        <P style={{ marginBottom: 16 }}>
          כדי לקלוט טקסט מהמשתמש בפייתון נוכל להשתמש בפעולה המובנית input. פעולה
          זו מקבלת כפרמטר טקסט שמטרתו לבקש מהמשתמש להזין את הקלט. היא מחזירה את
          הטקסט שהמשתמש הקליד - שאותו ניתן לשמור במשתנה.
        </P>
        <P style={{ marginBottom: 16 }}>
          כדי לקלוט טקסט מהמשתמש בפייתון נוכל להשתמש בפעולה המובנית input.
        </P>
        <CodeSnippet language="python" code={inputCodeSnippet} />

        <P style={{ marginBottom: 16 }}>
          למשל, קטע הקוד הזה יבקש מהמשתמש להקליד את השם שלו, וישמור את התוצאה
          במשתנה בשם name.
        </P>
        <P style={{ marginBottom: 16 }}>
          למשל, התוכנית הזו קולטת מהמשתמש את השלום שלו, ואומרת לו שלום. למשל,
          עבור הקלט "Tom" יודפס "Hello, Tom"
        </P>
        <CodeSnippet language="python" code={sayHelloCodeSnippet} />
      </Section>
    </PythonTutorialTemplate>
  );
}
