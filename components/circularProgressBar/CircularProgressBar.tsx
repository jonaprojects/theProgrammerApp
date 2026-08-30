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
function decimalToPercentage(decimal: number) {
  return (decimal * 100).toFixed(0);
}

type CircularProgressBarProps = {
  completionRatio: number;
  size?: number;
  accessibilityLabel?: string;
};

export default function CircularProgressBar({
  completionRatio,
  size = 180,
  accessibilityLabel = "התקדמות",
}: CircularProgressBarProps) {
  const clampedRatio = Math.min(1, Math.max(0, completionRatio || 0));
  const percent = decimalToPercentage(clampedRatio);
  const strokeWidth = Math.max(12, Math.round(size * 0.075));
  const radius = (size - strokeWidth) / 2;
  const circleLength = 2 * Math.PI * radius;

  // Shared value for animation
  const animatedProgress = useSharedValue(0);

  // Animated props for the circle
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circleLength * (1 - animatedProgress.value),
  }));

  // Trigger animation when the component mounts
  useEffect(() => {
    animatedProgress.value = withTiming(clampedRatio, { duration: 1000 });
  }, [clampedRatio]);

  return (
    <View
      style={[styles.progressBarContainer, { width: size, height: size }]}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: 100, now: Number(percent), text: `${percent}%` }}
    >
      <View accessible={false} importantForAccessibility="no-hide-descendants">
      <Svg width={size} height={size} style={styles.svg}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={BACKGROUND_COLOR}
          strokeWidth={strokeWidth}
          strokeDasharray={circleLength}
          fill="transparent"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={STROKE_COLOR}
          strokeWidth={strokeWidth}
          strokeDasharray={circleLength}
          strokeLinecap="round"
          fill="transparent"
          transform={`rotate(-90, ${size / 2}, ${size / 2})`}
          animatedProps={animatedProps}
        />
      </Svg>
      <Text style={styles.progressText}>{percent}%</Text>
      </View>
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
    fontFamily: "Heebo_400Regular",
    fontSize: 36,
    color: "rgba(255,255,255,0.7)",
    position: "absolute",
  },
  svg: {
    position: "relative",
  },
});
