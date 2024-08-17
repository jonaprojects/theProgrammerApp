import React from "react";
import type { PropsWithChildren } from "react";
import { PressableAndroidRippleConfig, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { ThemedPressable } from "@/components/ThemedPressable";

type TextSettings = {
    fontSize?: number;
    fontFamily?: string;
  };
type PrimaryButtonProps = PropsWithChildren<{
  height?: number;
  textSettings?: TextSettings
  fill?: boolean;
  paddingHorizontal?: number;
  onPress?: () => void;
}>;



export default function PrimaryButton(props: PrimaryButtonProps) {
  return (
    <ThemedPressable
      lightColor={Colors.light.primary}
      darkColor={Colors.dark.primary}
      android_ripple={{}}
      style={{
        height: props.height ?? 64,
        width: props.fill ? "100%" : "auto",
        paddingHorizontal: props.paddingHorizontal ?? 16,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ThemedText
        lightColor={Colors.light.text}
        darkColor={Colors.dark.text}
        style={{
          fontFamily: props.textSettings?.fontFamily ?? "Heebo_700Bold",
          fontSize: props.textSettings?.fontSize ?? 20,
        }}
      >
        {props.children}
      </ThemedText>
    </ThemedPressable>
  );
}
