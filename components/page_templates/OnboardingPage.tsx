import React from "react";
import { View, StyleSheet, Image } from "react-native";
import Body from "@/components/UI/Body";
import PrimaryButton from "@/components/UI/buttons/PrimaryButton";
import Container from "@/components/UI/Container";
import { H1, SecondaryText } from "@/components/UI/typography/Typography";
import Progress from "@/components/UI/page_progress/Progress";
import { router } from "expo-router";

import {
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated from "react-native-reanimated";

import type { ImageSourcePropType } from "react-native";

type onboardingProps = {
  illustration: ImageSourcePropType;
  title: string;
  description: string;
  index: number;
  numOfPages: number;
  moveToNextPage: () => void;
};

export default function OnboardingPage(props: onboardingProps) {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Body>
        <Container style={styles.container}>
          <Animated.View style={styles.progressContainer}>
            <Progress numOfSteps={props.numOfPages} currentStep={props.index} />
          </Animated.View>

          <View style={styles.contentContainer}>
            <View style={styles.illustrationContainer}>
              <Image
                style={styles.illustration}
                source={props.illustration}
                resizeMode="contain" // Ensures the image covers the container while maintaining its aspect ratio
              />
            </View>
            <View style={styles.bottomContainer}>
              <View style={styles.textContainer}>
                <H1 style={{ textAlign: "center" }}>{props.title}</H1>
                <SecondaryText style={{ textAlign: "center" }}>
                  {props.description}
                </SecondaryText>
              </View>

              <PrimaryButton onPress={props.moveToNextPage}>המשך</PrimaryButton>
            </View>
          </View>
        </Container>
      </Body>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
  },
  contentContainer: {
    gap: 48,
  },
  bottomContainer: {
    justifyContent: "space-between",
    gap: 48,
  },
  textContainer: {
    gap: 16,
  },
  illustrationContainer: {
    width: "100%",
    height: 360,
    marginLeft: 5,
    overflow: "hidden", // Prevents the image from overflowing outside the container
  },
  illustration: {
    width: "100%",
    height: "100%", // Ensures the image covers the container while maintaining aspect ratio
  },
  progressContainer: {
    position: "absolute",
    top: 48,
    left: 16,
    right: 16,
  },
});
