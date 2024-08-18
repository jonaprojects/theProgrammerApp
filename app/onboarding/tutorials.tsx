import React, { useEffect } from "react";
import OnboardingPage from "@/components/page_templates/OnboardingPage";
import { router, useNavigation } from "expo-router";

export default function WeHaveTutorials() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <OnboardingPage
      illustration={require("@/assets/images/illustrations/coolguyIllustration.png")}
      title="מדריכי תכנות"
      description="הוצאנו לראשונה מדריך פייתון בעברית עם תרגילים שונים. נו, למה אתה מחכים? יאללה לעבודה!"
      index={2}
      numOfPages={3}
      moveToNextPage={() => router.navigate("/onboarding/our_youtube")}
    />
  );
}
