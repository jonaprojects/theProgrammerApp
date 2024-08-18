import React, { useEffect } from "react";
import OnboardingPage from "@/components/page_templates/OnboardingPage";
import { router, useNavigation } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function OurYoutube() {
  const navigation = useNavigation();

  const finishOnboardingScreens = async () => {
    try {
      await AsyncStorage.setItem("Completed_Onboarding", "true");
      router.navigate("/(tabs)/");
    } catch (e) {
      // error reading value
    }
  };
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <OnboardingPage
      illustration={require("@/assets/images/illustrations/catIllustration.png")}
      title="אנחנו גם ביוטיוב"
      description="חפשו אותנו תחת השם “התוכניתן” ביוטיוב לעוד תוכן איכותי בנושאי תכנות, טכנולוגיה ומתמטיקה בעברית!"
      index={3}
      numOfPages={3}
      moveToNextPage={finishOnboardingScreens}
    />
  );
}
