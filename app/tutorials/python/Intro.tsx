import { router, useNavigation } from "expo-router";
import PythonTutorialTemplate from "./PythonTutorialTemplate";
import { useEffect } from "react";
import { P } from "@/components/UI/typography/Typography";

export default function Intro() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <PythonTutorialTemplate
      title={"פייתון - הקדמה"}
      onNextPage={function (): void {
        router.navigate("/tutorials/python/Installation");
      }}
      nextPageTitle="פייתון- התקנה"
    >
      <P style={{ marginBottom: 16 }}>
        פייתון פותחה בשנות ה-90 על ידי גואידו ואן רוסום ומאז עברה עוד ועוד
        שדרוגים והפכה בהדרגה לאהובה יותר ויותר. בשנים האחרונות, היא חוותה עלייה
        מאסיבית בפופולריות וצברה קהל של מיליוני מפתחים ברחבי העולם.
      </P>
      
      <P style={{ marginBottom: 16 }}>
        פייתון נחשבת לשפה מאוד פשוטה להבנה ואינטואיטיבית. בנוסף היא מגיעה גם עם
        סט רחב של ספריות קוד מובנות וחיצוניות וכלים שהופכים את הפיתוח בה לתהליך
        מהיר ותמציתי יותר.
      </P>
      <P style={{ marginBottom: 16 }}>
        בשל סיבות אלו, פייתון הפכה לשפה מבוקשת ביותר בתעשיית ההייטק והטכנולוגיה,
        כאשר אפילו חברות טק גדולות כגון Google ו-Microsoft קיבלו את השפה בזרועות
        פתוחות והחלו לשלב אותה בפיתוח המוצרים שלהן.
      </P>
    </PythonTutorialTemplate>
  );
}
