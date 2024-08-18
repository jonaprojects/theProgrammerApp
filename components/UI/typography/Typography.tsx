import React from "react";
import { type TextProps, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";

export function H1(props: TextProps) {
  return (
    <ThemedText
      style={[styles.h1, props.style]}
      lightColor={Colors.light.text}
      darkColor={Colors.dark.text}
    >
      {props.children}
    </ThemedText>
  );
}

export function H2(props: TextProps) {
  return (
    <ThemedText
      style={[styles.h2, props.style]}
      lightColor={Colors.light.text}
      darkColor={Colors.dark.text}
    >
      {props.children}
    </ThemedText>
  );
}

export function H3(props: TextProps) {
  return (
    <ThemedText
      style={[styles.h3, props.style]}
      lightColor={Colors.light.text}
      darkColor={Colors.dark.text}
    >
      {props.children}
    </ThemedText>
  );
}

export function H4(props: TextProps) {
  return (
    <ThemedText
      style={[styles.h4, props.style]}
      lightColor={Colors.light.text}
      darkColor={Colors.dark.text}
    >
      {props.children}
    </ThemedText>
  );
}

export function H5(props: TextProps) {
  return (
    <ThemedText
      style={[styles.h5, props.style]}
      lightColor={Colors.light.text}
      darkColor={Colors.dark.text}
    >
      {props.children}
    </ThemedText>
  );
}

export function H6(props: TextProps) {
  return (
    <ThemedText
      style={[styles.h6, props.style]}
      lightColor={Colors.light.text}
      darkColor={Colors.dark.text}
    >
      {props.children}
    </ThemedText>
  );
}

export function P(props: TextProps) {
  return (
    <ThemedText
      style={[styles.p, props.style]}
      lightColor={Colors.light.text}
      darkColor={Colors.dark.text}
    >
      {props.children}
    </ThemedText>
  );
}

export function Label(props: TextProps) {
  return (
    <ThemedText
      style={[styles.label, props.style]}
      lightColor={Colors.light.text}
      darkColor={Colors.dark.text}
    >
      {props.children}
    </ThemedText>
  );
}

export function SecondaryText(props: TextProps) {
  return (
    <ThemedText
      style={[styles.secondary, props.style]}
      lightColor={Colors.light.secondaryText}
      darkColor={Colors.dark.secondaryText}
    >
      {props.children}
    </ThemedText>
  );
}

const styles = StyleSheet.create({
  h1: {
    fontFamily: "Inter_700Bold",
    fontSize: 36,
    lineHeight: 40,
  },
  h2: {
    fontFamily: "Inter_700Bold",
    fontSize: 32,
    lineHeight: 36,
  },
  h3: {
    fontFamily: "Inter_700Bold",
    fontSize: 28,
    lineHeight: 32,
  },
  h4: {
    fontFamily: "Inter_700Bold",
    fontSize: 24,
    lineHeight: 28,
  },
  h5: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
    lineHeight: 24,
  },
  h6: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    lineHeight: 20,
  },
  p: {
    fontFamily: "Heebo_400Regular",
    fontSize: 16,
    lineHeight: 24

  },
  label: {
    fontFamily: "Heebo_400Regular",
    fontSize: 16,
  },
  secondary: {
    fontFamily: "Heebo_400Regular",
    fontSize: 16,
  },
});
