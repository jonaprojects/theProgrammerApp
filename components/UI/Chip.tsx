import React, { useState } from "react";
import { Pressable, StyleProp, useColorScheme, ViewStyle } from "react-native";
import { ChipLabel } from "./typography/Typography";
import { Colors } from "@/constants/Colors";

type ChipProps = {
  text: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export default function Chip(props: ChipProps) {
  const [active, setActive] = useState(false);
  const colorScheme = useColorScheme() ?? "dark";
  const onPressHandler = () => {
    if (props.onPress) {
      props.onPress();
    }
    setActive((prevState) => !prevState); // toggle the active state
  };

  const chipBackgroundColor = active
    ? Colors[colorScheme].chipActive
    : Colors[colorScheme].chipInactive;

  return (
    <Pressable
      onPress={onPressHandler}
      accessibilityRole="button"
      accessibilityLabel={props.text}
      accessibilityState={{ selected: active }}
      style={[
        {
          backgroundColor: chipBackgroundColor,
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 16,
          alignSelf: "flex-start",
          minHeight: 44,
          justifyContent: "center",
        },
        props.style,
      ]}
    >
      <ChipLabel>{props.text}</ChipLabel>
    </Pressable>
  );
}
