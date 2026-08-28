import OnboardingPage from "@/components/page_templates/OnboardingPage";
import CustomTextInput from "@/components/UI/input/CustomTextInput";
import { H1, P } from "@/components/UI/typography/Typography";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { View } from "react-native";
import { useAuth } from "@/context/AuthContext";

export default function EnterYourName() {
  const navigation = useNavigation();
  const { user, updateProfile } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName ?? "");

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const finishOnboardingScreens = async () => {
    if (displayName.trim() && displayName.trim() !== user?.displayName) {
      await updateProfile({ displayName: displayName.trim() });
    }
    await AsyncStorage.setItem("Completed_Onboarding", "true");
    router.replace("/(tabs)/");
  };
  return (
    <OnboardingPage
      illustration={require("@/assets/images/illustrations/userIllustration.png")}
      index={4}
      numOfPages={4}
      moveToNextPage={finishOnboardingScreens}
    >
      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <H1 style={{ textAlign: "center" }}>ברוכים הבאים!</H1>
          <P style={{ textAlign: "center" }}>איך אתה רוצה שנקרא לך?</P>
        </View>
        <CustomTextInput
          accessibilityLabel="שם תצוגה"
          value={displayName}
          onChangeText={setDisplayName}
          maxLength={80}
          style={styles.input}
        />
      </View>
    </OnboardingPage>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    gap: 16,
  },
  textContainer: {
    gap: 8,
  },
  input: {
    minHeight: 52,
    paddingHorizontal: 14,
    textAlign: "right",
    writingDirection: "rtl",
  },
});
