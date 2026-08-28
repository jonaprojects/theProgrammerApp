import PythonTutorialTemplate from "@/app/tutorials/python/PythonTutorialTemplate";
import { P } from "@/components/UI/typography/Typography";
import { useNavigation } from "expo-router";
import { useEffect } from "react";

export function createPythonLessonPlaceholder(title: string) {
  return function PythonLessonPlaceholder() {
    const navigation = useNavigation();

    useEffect(() => {
      navigation.setOptions({ headerShown: false });
    }, [navigation]);

    return (
      <PythonTutorialTemplate title={title}>
        <P style={{ marginBottom: 16 }}>
          תוכן השיעור נמצא בהכנה. ניתן לחזור לתוכן העניינים באמצעות הסמל בכותרת
          או לבחור שיעור אחר מהקורס.
        </P>
      </PythonTutorialTemplate>
    );
  };
}
