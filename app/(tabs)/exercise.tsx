import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Image, Platform } from "react-native";

import { Collapsible } from "@/components/Collapsible";
import { ExternalLink } from "@/components/ExternalLink";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Body from "@/components/UI/Body";
import { Colors } from "@/constants/Colors";
import { H4 } from "@/components/UI/typography/Typography";
import PrimaryButton from "@/components/UI/buttons/PrimaryButton";
import SecondaryButton from "@/components/UI/buttons/SecondaryButton";
import { View } from "react-native";
import Container from "@/components/UI/Container";
import YesNoButton from "@/components/UI/buttons/YesNoButton";

import { I18nManager } from "react-native";
import YesNoExercise from "@/components/exercises/YesNoExercise";
import MultipleOptionExercise from "@/components/exercises/MultipleOptionExercise";
import Navbar from "@/components/UI/Navbar";

I18nManager.forceRTL(false); // Forces LTR layout

export default function Exercise() {
  return (
    <Body>
      <Navbar />
      <View
        style={{
          flex: 1,
        }}
      >
        <MultipleOptionExercise
          question="מתי פותחה שפת פייתון?"
          questionID={0}
          options={["1991", "1974", "1979", "2004"]}
        />
      </View>

      {/* <YesNoExercise
          correctAnswer="yes"
          question="פייתון פותחה בשנות ה-50 של המאה ה-20 על ידי מדען המחשב דניס ריצ'י."
          questionID={0}
          userAnswered={false}
        /> */}
    </Body>
  );
}

const styles = StyleSheet.create({});
