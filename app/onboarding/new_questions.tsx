import React from "react";
import { Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import Body from "@/components/UI/Body";
import PrimaryButton from "@/components/UI/buttons/PrimaryButton";

export default function NewQuestions() {
  return (
    <Body>
      <PrimaryButton>המשך</PrimaryButton>
    </Body>
  );
}

const styles = StyleSheet.create({});
