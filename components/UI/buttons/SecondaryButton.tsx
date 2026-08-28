import React from "react";
import type { PropsWithChildren } from "react";
import {
  StyleProp,
  useColorScheme,
  ViewStyle,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import { ThemedPressable } from "@/components/ThemedPressable";

type TextStyle = {
  fontSize?: number;
  fontFamily?: string;
};
type PrimaryButtonProps = PropsWithChildren<{
  height?: number;
  textStyle?: TextStyle;
  fill?: boolean;
  paddingHorizontal?: number;
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}>;

export default function SecondaryButton(props: PrimaryButtonProps) {
  const colorScheme = useColorScheme();

  return (
    <ThemedPressable
      lightColor="transparent"
      darkColor="transparent"
      android_ripple={{}}
      onPress={props.onPress}
      disabled={props.disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: props.disabled }}
      style={[{
        height: props.height ?? 64,
        width: props.fill ? "100%" : "auto",
        paddingHorizontal: props.paddingHorizontal ?? 16,
        justifyContent: "center",
        alignItems: "center",
        borderColor: Colors[colorScheme ?? "dark"].primary,
        borderWidth: 1,
        borderRadius: 4,
      }, props.style, props.disabled && { opacity: 0.45 }]}
    >
      <ThemedText
        lightColor={Colors.light.text}
        darkColor={Colors.dark.text}
        style={{
          fontFamily: props.textStyle?.fontFamily ?? "Heebo_700Bold",
          fontSize: props.textStyle?.fontSize ?? 20,
        }}
      >
        {props.children}
      </ThemedText>
    </ThemedPressable>
  );
}
