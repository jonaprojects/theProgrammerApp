import React, { useEffect } from "react";
import OnboardingPage from "@/components/page_templates/OnboardingPage";
import { router, useNavigation } from "expo-router";

export default function NewQuestions() {

  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <OnboardingPage
      illustration={require("@/assets/images/illustrations/spaceIllustration.png")}
      title="מאות שאלות חדשות!"
      description="למדו תכנות עם מאות שאלות בנושאים שונים כגון פיתוח אתרים, תכנות מונחה עצמים, סייבר, תקשורת ועוד..."
      index={1}
      numOfPages={3}
      moveToNextPage={() => {
        router.navigate("/onboarding/tutorials");
      }}
    />
  );
}
