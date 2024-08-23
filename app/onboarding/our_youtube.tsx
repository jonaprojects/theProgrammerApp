import React, { useEffect } from "react";
import OnboardingPageWithDescription from "@/components/page_templates/OnboardingPageWithDescription";
import { router, useNavigation } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function OurYoutube() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <OnboardingPageWithDescription
      illustration={require("@/assets/images/illustrations/catIllustration.png")}
      title="אנחנו גם ביוטיוב"
      description="חפשו אותנו תחת השם “התוכניתן” ביוטיוב לעוד תוכן איכותי בנושאי תכנות, טכנולוגיה ומתמטיקה בעברית!"
      index={3}
      numOfPages={4}
      moveToNextPage={() => {
        router.navigate("/onboarding/enter_your_name");
      }}
    />
  );
}
