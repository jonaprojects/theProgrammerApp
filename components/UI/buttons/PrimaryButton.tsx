import React from "react";
import type { PropsWithChildren } from "react";
import {
  StyleProp,
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

export default function PrimaryButton(props: PrimaryButtonProps) {
  return (
    <ThemedPressable
      lightColor={Colors.light.primary}
      darkColor={Colors.dark.primary}
      android_ripple={{}}
      onPress={props.onPress}
      disabled={props.disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: props.disabled }}
      style={[
        {
          minHeight: props.height ?? 64,
          width: props.fill ? "100%" : "auto",
          paddingHorizontal: props.paddingHorizontal ?? 16,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 4,
        },
        props.style,
        props.disabled && { opacity: 0.45 },
      ]}
    >
      <ThemedText
        lightColor="#071A1D"
        darkColor="#071A1D"
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

export function SmallPrimaryButton(props: PrimaryButtonProps) {
  return (
    <PrimaryButton
      style={[props.style, { minHeight: 44 }]}
      onPress={props.onPress}
      textStyle={{
        fontSize: 16,
      }}
    >
      {props.children}
    </PrimaryButton>
  );
}
