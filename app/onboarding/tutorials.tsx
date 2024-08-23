import React, { useEffect } from "react";
import OnboardingPageWithDescription from "@/components/page_templates/OnboardingPageWithDescription";
import { router, useNavigation } from "expo-router";

export default function WeHaveTutorials() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <OnboardingPageWithDescription
      illustration={require("@/assets/images/illustrations/coolguyIllustration.png")}
      title="מדריכי תכנות"
      description="הוצאנו לראשונה מדריך פייתון בעברית עם תרגילים שונים. נו, למה אתה מחכים? יאללה לעבודה!"
      index={2}
      numOfPages={4}
      moveToNextPage={() => router.navigate("/onboarding/our_youtube")}
    />
  );
}
