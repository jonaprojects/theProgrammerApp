import React from "react";
import type { PropsWithChildren } from "react";
import {
  PressableAndroidRippleConfig,
  StyleProp,
  StyleSheet,
  useColorScheme,
  ViewStyle,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
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
      style={[{
        height: props.height ?? 64,
        width: props.fill ? "100%" : "auto",
        paddingHorizontal: props.paddingHorizontal ?? 16,
        justifyContent: "center",
        alignItems: "center",
        borderColor: Colors[colorScheme ?? "dark"].primary,
        borderWidth: 1,
        borderRadius: 4,
      }, props.style]}
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
