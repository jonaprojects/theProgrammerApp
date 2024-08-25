import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { StyleProp, Text, View, ViewStyle } from "react-native";
import { H6 } from "../typography/Typography";

type HorizontalProgressBarProps = {
  percentage: number;
  style?: StyleProp<ViewStyle>;
};

export default function HorizontalProgressBar(
  props: HorizontalProgressBarProps
) {
  const progressWidth = props.percentage; // Assuming percentage is in the range of 0-100

  return (
    <ThemedView
      darkColor={Colors.dark.HorizontalprogressBg}
      lightColor={Colors.light.HorizontalprogressBg}
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
        style={{
          height: "100%",
          alignSelf: "flex-start",
          width: `${props.percentage}%`,
          borderRadius: 16,
          justifyContent: "center",
          alignItems: "flex-end",
          paddingHorizontal: 8,
        }}
      >
        <H6>{props.percentage}%</H6>
      </ThemedView>
    </ThemedView>
  );
}
