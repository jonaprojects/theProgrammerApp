import React from "react";
import { H3 } from "../typography/Typography";
import { Pressable, StyleSheet } from "react-native";

type YesNoButtonProps = {
  label: string;
  selected: boolean;
  revealed: boolean;
  disabled: boolean;
  correct: boolean;
  onClick?: () => void;
};
export default function YesNoButton(props: YesNoButtonProps) {
  const resultLabel = props.revealed
    ? props.correct
      ? ", תשובה נכונה"
      : props.selected
        ? ", התשובה שבחרתם שגויה"
        : ""
    : "";
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={`${props.label}${resultLabel}`}
      accessibilityState={{ checked: props.selected, disabled: props.revealed || props.disabled }}
      disabled={props.revealed || props.disabled}
      style={({ pressed }) => [
        styles.button,
        props.selected && !props.revealed && styles.selected,
        props.revealed && props.correct && styles.correct,
        props.revealed && props.selected && !props.correct && styles.incorrect,
        props.revealed && !props.correct && !props.selected && styles.dimmed,
        pressed && !props.revealed && !props.disabled && styles.pressed,
      ]}
      onPress={props.onClick}
    >
      <H3>{props.label}</H3>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    minHeight: 120,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#29374B",
    borderWidth: 2,
    borderColor: "transparent",
    borderRadius: 10,
  },
  selected: { borderColor: "#19D3DC", backgroundColor: "#31465C" },
  correct: { borderColor: "#4ADE80", backgroundColor: "#176534" },
  incorrect: { borderColor: "#FB7185", backgroundColor: "#881F36" },
  dimmed: { opacity: 0.58 },
  pressed: { opacity: 0.82 },
});
