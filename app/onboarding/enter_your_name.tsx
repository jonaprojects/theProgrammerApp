import OnboardingPage from "@/components/page_templates/OnboardingPage";
import Body from "@/components/UI/Body";
import CustomTextInput from "@/components/UI/input/CustomTextInput";
import { H1, H2, H3, P } from "@/components/UI/typography/Typography";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useNavigation } from "expo-router";
import { useEffect } from "react";
import { ScrollView, StyleSheet, TextInput } from "react-native";
import { View } from "react-native";

const finishOnboardingScreens = async () => {
  try {
    await AsyncStorage.setItem("Completed_Onboarding", "true");
    router.navigate("/(tabs)/");
  } catch (e) {
    // error reading value
  }
};
export default function EnterYourName() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);
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
        <CustomTextInput />
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
});
