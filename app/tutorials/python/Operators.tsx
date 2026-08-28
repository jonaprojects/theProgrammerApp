import { router, useNavigation } from "expo-router";
import PythonTutorialTemplate from "./PythonTutorialTemplate";
import { useEffect } from "react";
import { P, TutorialH4 as H4 } from "@/components/UI/typography/Typography";
import CodeSnippet from "@/components/UI/code_snippets/CodeSnippet";
import Section from "@/components/tutorials/Section";
import InteractiveExercise from "@/components/tutorials/exercises/InteractiveExercise";

export default function Operators() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <PythonTutorialTemplate
      title={"אופרטורים"}
      onNextPage={function (): void {
        router.navigate("/tutorials/python/InputOutput");
      }}
      nextPageTitle="קלט ופלט"
    >
      <P style={{ marginBottom: 16 }}>
        אופרטורים הם סימנים ומילים שמבצעים פעולה על ערכים. חלקם מחשבים תוצאה,
        חלקם משווים בין ערכים, ואחרים מחברים כמה תנאים יחד.
      </P>
      <Section>
        <H4>אופרטורים אריתמטיים</H4>
        <P style={{ marginBottom: 16 }}>
          הסימנים +, -, * ו־/ מבצעים חיבור, חיסור, כפל וחילוק. בנוסף, // מחזיר
          חילוק שלם, % מחזיר את השארית ו־** מבצע חזקה.
        </P>
        <CodeSnippet
          language="python"
          code={`print(7 + 3)   # 10
print(7 / 2)   # 3.5
print(7 // 2)  # 3
print(7 % 2)   # 1
print(2 ** 3)  # 8`}
        />
      </Section>
      <Section>
        <H4>אופרטורים השוואתיים</H4>
        <P style={{ marginBottom: 16 }}>
          אופרטורים השוואתיים מאפשרים לנו להשוות בין ערכים שונים. האופרטורים
          ההשוואתיים מחזירים ערך בוליאני: True או False. שימו לב להבדל בין =,
          ששומר ערך במשתנה, לבין ==, שבודק שוויון.
        </P>
        <CodeSnippet
          language="python"
          code={`print(5 > 2)    # True
print(5 <= 2)   # False
print(5 == 5)   # True
print(5 != 3)   # True`}
        />
      </Section>

      <Section>
        <H4>חיבור תנאים</H4>
        <P style={{ marginBottom: 12 }}>
          and מחזיר True רק כששני התנאים נכונים. or דורש שלפחות תנאי אחד יהיה
          נכון, ו־not הופך True ל־False ולהפך.
        </P>
        <CodeSnippet
          language="python"
          code={`age = 20
has_ticket = True

print(age >= 18 and has_ticket)  # True
print(age < 18 or not has_ticket) # False`}
        />
      </Section>

      <InteractiveExercise
        exercise={{
          id: "python-operators-predict-output-1",
          type: "predict_output",
          prompt: "מה יודפס?",
          code: `number = 10
print(number % 3 == 1)`,
          options: [
            { id: "true", label: "True" },
            { id: "false", label: "False" },
            { id: "one", label: "1" },
          ],
          correctOptionId: "true",
          hint: "% מחזיר את השארית, ואז == משווה אותה ל־1.",
          explanation: "השארית של 10 בחלוקה ל־3 היא 1, ולכן ההשוואה 1 == 1 מחזירה True.",
        }}
      />
    </PythonTutorialTemplate>
  );
}
