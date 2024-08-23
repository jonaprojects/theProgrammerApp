import React, { useEffect } from "react";
import OnboardingPageWithDescription from "@/components/page_templates/OnboardingPageWithDescription";
import { router, useNavigation } from "expo-router";

export default function NewQuestions() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <OnboardingPageWithDescription
      illustration={require("@/assets/images/illustrations/spaceIllustration.png")}
      title="מאות שאלות חדשות!"
      description="למדו תכנות עם מאות שאלות בנושאים שונים כגון פיתוח אתרים, תכנות מונחה עצמים, סייבר, תקשורת ועוד..."
      index={1}
      numOfPages={4}
      moveToNextPage={() => {
        router.navigate("/onboarding/tutorials");
      }}
    />
  );
}
