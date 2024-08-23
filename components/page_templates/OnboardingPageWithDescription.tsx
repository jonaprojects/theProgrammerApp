import React from "react";
import { View, StyleSheet } from "react-native";
import PrimaryButton from "@/components/UI/buttons/PrimaryButton";
import { H1, SecondaryText } from "@/components/UI/typography/Typography";
import { router } from "expo-router";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";

import type { ImageSourcePropType } from "react-native";
import OnboardingPage from "./OnboardingPage";

type onboardingProps = {
  illustration: ImageSourcePropType;
  title: string;
  description: string;
  index: number;
  numOfPages: number;
  moveToNextPage: () => void;
};

export default function OnboardingPageWithDescription(props: onboardingProps) {
  return (
    <OnboardingPage
      illustration={props.illustration}
      index={props.index}
      numOfPages={props.numOfPages}
      moveToNextPage={props.moveToNextPage}
    >
      <View style={styles.textContainer}>
        <H1 style={{ textAlign: "center" }}>{props.title}</H1>
        <SecondaryText style={{ textAlign: "center" }}>
          {props.description}
        </SecondaryText>
      </View>
    </OnboardingPage>
  );
}

const styles = StyleSheet.create({
  textContainer: {
    gap: 16,
  },
});
