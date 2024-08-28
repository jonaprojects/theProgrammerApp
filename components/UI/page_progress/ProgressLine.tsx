import React from "react";
import { StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";

type ProgressLineProps = {
  active: boolean;
};
export default function ProgressLine(props: ProgressLineProps) {
  const darkColor = props.active
    ? Colors.dark.lineProgressActive
    : Colors.dark.lineProgressInactive;

  const lightColor = props.active
    ? Colors.light.lineProgressActive
    : Colors.light.lineProgressInactive;

  return (
    <ThemedView
      style={{
        width: "100%",
        height: 4,
        borderRadius: 4,
      }}
      lightColor={lightColor}
      darkColor={darkColor}
    ></ThemedView>
  );
}
