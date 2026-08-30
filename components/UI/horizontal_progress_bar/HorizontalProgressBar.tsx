import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { StyleProp, ViewStyle } from "react-native";
import { H6 } from "../typography/Typography";

type HorizontalProgressBarProps = {
  percentage: number;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
};

export default function HorizontalProgressBar(
  props: HorizontalProgressBarProps
) {
  const percentage = Math.min(100, Math.max(0, Math.round(props.percentage)));

  return (
    <ThemedView
      darkColor={Colors.dark.HorizontalprogressBg}
      lightColor={Colors.light.HorizontalprogressBg}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={props.accessibilityLabel ?? "התקדמות"}
      accessibilityValue={{ min: 0, max: 100, now: percentage, text: `${percentage}%` }}
      style={[
        {
          width: "100%",
          height: 30,
          borderRadius: 16,
        },
        props.style,
      ]}
    >
      <ThemedView
        darkColor={Colors.dark.HorizontalProgressLine}
        lightColor={Colors.light.HorizontalProgressLine}
        accessible={false}
        importantForAccessibility="no-hide-descendants"
        style={{
          height: "100%",
          alignSelf: "flex-start",
          width: `${percentage}%`,
          borderRadius: 16,
          justifyContent: "center",
          alignItems: "flex-end",
          paddingHorizontal: 8,
        }}
      >
        <H6>{percentage}%</H6>
      </ThemedView>
    </ThemedView>
  );
}
