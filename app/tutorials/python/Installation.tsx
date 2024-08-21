import { router, useNavigation } from "expo-router";
import PythonTutorialTemplate from "./PythonTutorialTemplate";
import { useEffect } from "react";
import { P } from "@/components/UI/typography/Typography";

export default function Installation() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <PythonTutorialTemplate
      title={"פייתון - התקנה"}
      onNextPage={function (): void {
        router.navigate("/tutorials/python/Intro");
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
    </PythonTutorialTemplate>
  );
}
