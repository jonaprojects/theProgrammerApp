import { router, useNavigation } from "expo-router";
import PythonTutorialTemplate from "./PythonTutorialTemplate";
import { useEffect } from "react";
import { P } from "@/components/UI/typography/Typography";
import CodeSnippet from "@/components/UI/code_snippets/CodeSnippet";

export default function Installation() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <PythonTutorialTemplate
      title={"פייתון - התקנה"}
      onNextPage={function (): void {
        router.navigate("/tutorials/python/FirstPythonProgram");
      }}
      nextPageTitle="תוכנית ראשונה בפייתון"
    >
      <P style={{ marginBottom: 16 }}>
        ניתן להתקין את פייתון באתר הרשמי של פייתון. מומלץ להתקין את גרסה 3 של
        פייתון והלאה, שכן גרסה 2 כבר אינה בשימוש נרחב. בנוסף, קוד שנכתב ב
        python2 לא יהיה בהכרח תקין בpython3 ולהפך.
      </P>
      <P style={{ marginBottom: 16 }}>
        לאחר הורדת קובץ ההתקנה, תצטרכו לפתוח אותו ולאשר את שלבי ההתקנה. אם
        מופיעה האופציה, יש לבחור להוסיף את python למשתני הסביבה של המערכת (ב
        windows, למשתנה PATH).
      </P>
      <P style={{ marginBottom: 16 }}>
        משתני הסביבה הם משתנים גלובליים אשר זמינים במערכת ההפעלה ובשורת הפקודה
        בפרט. לעתים קרובות נרצה לגשת לפייתון באמצעות שורת הפקודה ולפיכך זה הכרחי
        להוסיף אותו למשתני הסביבה.
      </P>
      <P style={{ marginBottom: 16 }}>
        אם פספסתם את האופציה הזו , אתם יכולים להוסיף את הכתובת של קובץ ההרצה של
        פייתון למשתנה הסביבה PATH באופן ידני, או להסיר את התוכנית ולהתקינה מחדש
        באופן מבוקר והדרגתי.
      </P>
      <P style={{ marginBottom: 16 }}>
        יש לציין שכאשר מתקינים את פייתון, מקבלים גם אוטומטית את עורך הקוד IDLE
        ואת מנהל החבילות pip (נדון בו בהמשך).
      </P>
      <P style={{ marginBottom: 16 }}>
        לאחר ההתקנה של פייתון, יש להתקין סביבת עבודה (IDE). בסביבת העבודה נוכל
        לכתוב קוד בפייתון, להריץ אותו, לנפות שגיאות ועוד. יש אופציות רבות לבחירת
        IDE, אך הנוחות והפופולריות ביותר נכון לזמן הכתיבה הן Pycharm (מבית
        JetBrains) ו- Visual Studio Code (מבית מייקרוסופט).
      </P>
      <P style={{ marginBottom: 16 }}>
        בעוד ש-Pycharm היא תוכנה כבדה יותר ומותאמת באופן ספציפי לפייתון, VS Code
        תופסת פחות זיכרון וכוח מעבד ותומכת בשפות תכנות רבות. בנוסף, היא מכילה
        חנות של תוספים שמתוחזקים בתכיפות.
      </P>
      <P style={{ marginBottom: 16 }}>
        אם בחרתם להשתמש ב-VS Code, מומלץ להתקין את התוסף של Python מבית
        Microsoft על מנת לאפשר פיצ׳רים כגון הדגשת מילים שמורות של השפה
      </P>
      <P style={{ marginBottom: 16 }}>
        אם לא הצלחתם מאיזושהי סיבה להתקין את פייתון או להתקין סביבת עבודה
        מתאימה, תוכלו גם לכתוב ולהריץ קוד בפייתון אונליין. למשל, באמצעות Google
        Colab ו-Repl.it או כלים בסיסיים יותר כגון עורך הקוד של Programiz. בנוסף,
        ניתן להתקין אפליקציות עם שירותים דומים בסמארטפון. כלומר, גם אם ההתקנה
        כשלה, עדיין תוכלו ללמוד ולתרגל את השפה !
      </P>
    </PythonTutorialTemplate>
  );
}
