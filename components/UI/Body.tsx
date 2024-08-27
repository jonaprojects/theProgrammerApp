import React from "react";
import type { PropsWithChildren } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { GestureHandlerRootView } from "react-native-gesture-handler";

type BodyProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
}>;

export default function Body(props: BodyProps) {
  return (
    <ThemedView
      lightColor={Colors.light.background}
      darkColor={Colors.dark.background}
      style={[styles.container, props.style]}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.innerContainer}>{props.children}</View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
  safeArea: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
  },
});
