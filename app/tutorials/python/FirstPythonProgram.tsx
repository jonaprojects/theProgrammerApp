import { router, useNavigation } from "expo-router";
import PythonTutorialTemplate from "./PythonTutorialTemplate";
import { useEffect } from "react";
import { P } from "@/components/UI/typography/Typography";
import CodeSnippet from "@/components/UI/code_snippets/CodeSnippet";

export default function FirstPythonProgram() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <PythonTutorialTemplate
      title={"תוכנית ראשונה"}
      onNextPage={function (): void {
        router.navigate("/tutorials/python/Datatypes");
      }}
      nextPageTitle="סוגי נתונים"
    >
      <P style={{ marginBottom: 16 }}>
        סוף סוף לאחר ההתקנה ,נתחיל באמת לכתוב קוד ולהתנסות בעצמנו בתכנות - מכאן
        והלאה נתחיל ״ללכלך את הידיים״ שלנו וללמוד את הדברים המעניינים באמת.
      </P>
      <P style={{ marginBottom: 16 }}>
        נפתח את עורך הקוד שלנו וניצור קובץ חדש בשם first.py. הסיומת py מסמלת
        שזהו אכן קובץ פייתון.
      </P>
      <P style={{ marginBottom: 16 }}>כתבו את שורת הקוד הבאה:</P>
      <CodeSnippet language="python" code="print('hello world')" />
      <P style={{ marginBottom: 16, marginTop: 8 }}>
        והריצו את הקובץ. אם הכל הלך כשורה, אתם אמורים לראות שהודפסה ההודעה
        ״hello world״. מזל טוב, כתבתם הרגע את התוכנית הראשונה שלכם בפייתון!
      </P>
      <P style={{ marginBottom: 16 }}>
        הפקודה print אחראית על הדפסה של טקסט על המסך. היא מקבלת בתור פרמטר את
        הטקסט ״hello world”. אנחנו מסמנים טקסט באמצעות גרשיים או גרשיים כפולות.
        נדון על כך בפרקים הבאים.
      </P>
    </PythonTutorialTemplate>
  );
}
