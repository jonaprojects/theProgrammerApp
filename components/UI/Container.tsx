import React from "react";
import type { PropsWithChildren } from "react";
import type { ViewProps } from "react-native";
import { View, StyleSheet } from "react-native";

export default function Container(props: ViewProps) {
  return <View style={[styles.container, props.style]}>{props.children}</View>;
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 8,
  },
});
