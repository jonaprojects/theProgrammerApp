import React from "react";
import { type TextProps, Platform, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";

const webHeadingLevel = (level: number): Record<string, number> =>
  Platform.OS === "web" ? { "aria-level": level } : {};

export function H1(props: TextProps) {
  const { style, children, accessibilityRole = "header", ...rest } = props;
  return (
    <ThemedText
      {...rest}
      {...webHeadingLevel(1)}
      accessibilityRole={accessibilityRole}
      style={[styles.h1, style]}
      lightColor={Colors.light.text}
      darkColor={Colors.dark.text}
    >
      {children}
    </ThemedText>
  );
}

export function H2(props: TextProps) {
  const { style, children, accessibilityRole = "header", ...rest } = props;
  return (
    <ThemedText
      {...rest}
      {...webHeadingLevel(2)}
      accessibilityRole={accessibilityRole}
      style={[styles.h2, style]}
      lightColor={Colors.light.text}
      darkColor={Colors.dark.text}
    >
      {children}
    </ThemedText>
  );
}

export function H3(props: TextProps) {
  const { style, children, accessibilityRole = "header", ...rest } = props;
  return (
    <ThemedText
      {...rest}
      {...webHeadingLevel(3)}
      accessibilityRole={accessibilityRole}
      style={[styles.h3, style]}
      lightColor={Colors.light.text}
      darkColor={Colors.dark.text}
    >
      {children}
    </ThemedText>
  );
}

export function H4(props: TextProps) {
  const { style, children, accessibilityRole = "header", ...rest } = props;
  return (
    <ThemedText
      {...rest}
      {...webHeadingLevel(4)}
      accessibilityRole={accessibilityRole}
      style={[styles.h4, style]}
      lightColor={Colors.light.text}
      darkColor={Colors.dark.text}
    >
      {children}
    </ThemedText>
  );
}

export function H5(props: TextProps) {
  const { style, children, accessibilityRole = "header", ...rest } = props;
  return (
    <ThemedText
      {...rest}
      {...webHeadingLevel(5)}
      accessibilityRole={accessibilityRole}
      style={[styles.h5, style]}
      lightColor={Colors.light.text}
      darkColor={Colors.dark.text}
    >
      {children}
    </ThemedText>
  );
}

export function H6(props: TextProps) {
  const { style, children, accessibilityRole = "header", ...rest } = props;
  return (
    <ThemedText
      {...rest}
      {...webHeadingLevel(6)}
      accessibilityRole={accessibilityRole}
      style={[styles.h6, style]}
      lightColor={Colors.light.text}
      darkColor={Colors.dark.text}
    >
      {children}
    </ThemedText>
  );
}

export function P(props: TextProps) {
  const { style, children, ...rest } = props;
  return (
    <ThemedText
      {...rest}
      style={[styles.p, style]}
      lightColor={Colors.light.text}
      darkColor={Colors.dark.text}
    >
      {children}
    </ThemedText>
  );
}

export function Label(props: TextProps) {
  const { style, children, ...rest } = props;
  return (
    <ThemedText
      {...rest}
      style={[styles.label, style]}
      lightColor={Colors.light.text}
      darkColor={Colors.dark.text}
    >
      {children}
    </ThemedText>
  );
}

export function SecondaryText(props: TextProps) {
  const { style, children, ...rest } = props;
  return (
    <ThemedText
      {...rest}
      style={[styles.secondary, style]}
      lightColor={Colors.light.secondaryText}
      darkColor={Colors.dark.secondaryText}
    >
      {children}
    </ThemedText>
  );
}

export function ChipLabel(props: TextProps) {
  const { style, children, ...rest } = props;
  return (
    <ThemedText
      {...rest}
      style={[styles.chipLabel, style]}
      lightColor={Colors.light.text}
      darkColor={Colors.dark.text}
    >
      {children}
    </ThemedText>
  );
}

export function TaskTitle(props: TextProps) {
  const { style, children, ...rest } = props;
  return (
    <ThemedText
      {...rest}
      style={[styles.taskTitle, style]}
      lightColor={Colors.light.text}
      darkColor={Colors.dark.text}
    >
      {children}
    </ThemedText>
  );
}

export function CourseCardTitle(props: TextProps) {
  const { style, children, ...rest } = props;
  return (
    <ThemedText
      {...rest}
      style={[styles.courseCardTitle, style]}
      lightColor={Colors.light.text}
      darkColor={Colors.dark.text}
    >
      {children}
    </ThemedText>
  );
}

export function OptionText(props: TextProps) {
  const { style, children, ...rest } = props;
  return (
    <ThemedText
      {...rest}
      style={[styles.exerciseOption, style]}
      lightColor={Colors.light.text}
      darkColor={Colors.dark.text}
    >
      {children}
    </ThemedText>
  );
}

export function TutorialH4(props: TextProps) {
  const { style, children, ...rest } = props;
  return <H4 {...rest} style={[styles.tutorialH4, style]}>{children}</H4>;
}

const styles = StyleSheet.create({
  h1: {
    fontFamily: "Heebo_700Bold",
    fontSize: 36,
    lineHeight: 40,
    textAlign: "right",
    writingDirection: "rtl",
  },
  h2: {
    fontFamily: "Heebo_700Bold",
    fontSize: 32,
    lineHeight: 36,
    textAlign: "right",
    writingDirection: "rtl",
  },
  h3: {
    fontFamily: "Heebo_700Bold",
    fontSize: 28,
    lineHeight: 32,
    textAlign: "right",
    writingDirection: "rtl",
  },
  h4: {
    fontFamily: "Heebo_700Bold",
    fontSize: 24,
    lineHeight: 28,
    textAlign: "right",
    writingDirection: "rtl",
  },
  h5: {
    fontFamily: "Heebo_700Bold",
    fontSize: 20,
    lineHeight: 24,
    textAlign: "right",
    writingDirection: "rtl",
  },
  h6: {
    fontFamily: "Heebo_700Bold",
    fontSize: 16,
    lineHeight: 20,
    textAlign: "right",
    writingDirection: "rtl",
  },
  p: {
    fontFamily: "Heebo_400Regular",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "right",
    writingDirection: "rtl",
  },
  label: {
    fontFamily: "Heebo_400Regular",
    fontSize: 16,
    textAlign: "right",
    writingDirection: "rtl",
  },
  taskTitle: {
    fontFamily: "Heebo_500Medium",
    fontSize: 16,
    textAlign: "right",
    writingDirection: "rtl",
  },
  chipLabel: {
    fontFamily: "Heebo_500Medium",
    fontSize: 16,
    textAlign: "right",
    writingDirection: "rtl",
  },
  secondary: {
    fontFamily: "Heebo_400Regular",
    fontSize: 16,
    textAlign: "right",
    writingDirection: "rtl",
  },
  courseCardTitle: {
    fontFamily: "Heebo_700Bold",
    fontSize: 20,
    textAlign: "right",
    writingDirection: "rtl",
  },
  exerciseOption: {
    fontFamily: "Heebo_400Regular",
    fontSize: 18,
  },
  tutorialH4: {
    marginBottom: 8,
  },
});
