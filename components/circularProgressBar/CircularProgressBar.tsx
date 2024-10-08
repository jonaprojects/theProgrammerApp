import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
} from "react-native-reanimated";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const STROKE_COLOR = "#00ADB5";
const BACKGROUND_COLOR = "#151A21";
const CIRCLE_LENGTH = 450; // 2 * PI * R
const R = CIRCLE_LENGTH / (2 * Math.PI);

function decimalToPercentage(decimal: number) {
  return (decimal * 100).toFixed(0);
}

type CircularProgressBarProps = {
  completionRatio: number;
};

export default function CircularProgressBar({
  completionRatio,
}: CircularProgressBarProps) {
  const percent = decimalToPercentage(completionRatio);

  // Shared value for animation
  const animatedProgress = useSharedValue(0);

  // Animated props for the circle
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCLE_LENGTH * (1 - animatedProgress.value),
  }));

  // Trigger animation when the component mounts
  useEffect(() => {
    animatedProgress.value = withTiming(completionRatio, { duration: 1000 });
  }, [completionRatio]);

  return (
    <View style={styles.progressBarContainer}>
      <Svg width={200} height={200} style={styles.svg}>
        <Circle
          cx="100"
          cy="100"
          r={R}
          stroke={BACKGROUND_COLOR}
          strokeWidth={15}
          strokeDasharray={CIRCLE_LENGTH}
          fill="transparent"
        />
        <AnimatedCircle
          cx="100"
          cy="100"
          r={R}
          stroke={STROKE_COLOR}
          strokeWidth={15}
          strokeDasharray={CIRCLE_LENGTH}
          strokeLinecap="round"
          fill="transparent"
          transform={`rotate(-90, 100, 100)`} // Rotate the circle to start from the top
          animatedProps={animatedProps}
        />
      </Svg>
      <Text style={styles.progressText}>{percent}%</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  progressBarContainer: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start", // Make sure the container only takes the space it needs
  },
  progressText: {
    fontSize: 40,
    color: "rgba(256,256,256,0.7)",
    position: "absolute",
  },
  svg: {
    position: "relative",
  },
});
