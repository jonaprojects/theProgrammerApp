import { router, useNavigation } from "expo-router";
import PythonTutorialTemplate from "./PythonTutorialTemplate";
import { useEffect } from "react";
import { P } from "@/components/UI/typography/Typography";

export default function FirstPythonProgram() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <PythonTutorialTemplate
      title={"תוכנית ראשונה בפייתון"}
      onNextPage={function (): void {
        router.navigate("/tutorials/python/Intro");
      }}
      nextPageTitle=""
    >
      <P style={{ marginBottom: 16 }}>
        סוף סוף לאחר ההתקנה ,נתחיל באמת לכתוב קוד ולהתנסות בעצמנו בתכנות - מכאן
        והלאה נתחיל ״ללכלך את הידיים״ שלנו וללמוד את הדברים המעניינים באמת.
      </P>
      <P style={{ marginBottom: 16 }}>
        נפתח את עורך הקוד שלנו וניצור קובץ חדש בשם first.py. הסיומת py מסמלת
        שזהו אכן קובץ פייתון.
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
