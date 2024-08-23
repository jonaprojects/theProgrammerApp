import React, { type PropsWithChildren } from "react";
import { View, StyleSheet, Image, Text } from "react-native";
import Body from "@/components/UI/Body";
import PrimaryButton from "@/components/UI/buttons/PrimaryButton";
import Container from "@/components/UI/Container";
import { H1, SecondaryText } from "@/components/UI/typography/Typography";
import Progress from "@/components/UI/page_progress/Progress";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated from "react-native-reanimated";

import type { ImageSourcePropType } from "react-native";

type onboardingProps = PropsWithChildren<{
  illustration: ImageSourcePropType;
  index: number;
  numOfPages: number;
  moveToNextPage: () => void;
}>;

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
              {props.children}
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
    flex: 1,
  },
  contentContainer: {
    alignItems: "center",
    justifyContent: "center",
    gap: 48,
    flex: 1,
  },
  bottomContainer: {
    gap: 48,
    width: "100%",
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
    paddingTop: 16,
    paddingBottom: 16,
  },
});
