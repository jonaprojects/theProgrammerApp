import { StyleSheet, View } from "react-native";
import { ThemedPressable } from "../ThemedPressable";
import { H5, OptionText } from "../UI/typography/Typography";
import { Colors } from "@/constants/Colors";

type OptionProps = {
  index: number;
  text: string;
  selected: boolean;
  revealed: boolean;
  disabled: boolean;
  correct: boolean;
  onPress: () => void;
};

const hebrewLetters = ["א", "ב", "ג", "ד"];

export default function Option(props: OptionProps) {
  const resultLabel = props.revealed
    ? props.correct
      ? ", תשובה נכונה"
      : props.selected
        ? ", התשובה שבחרתם שגויה"
        : ""
    : "";
  return (
    <ThemedPressable
      darkColor={Colors.dark.optionBackgroundColor}
      lightColor={Colors.light.optionBackgroundColor}
      accessibilityRole="radio"
      accessibilityLabel={`${hebrewLetters[props.index]}. ${props.text}${resultLabel}`}
      accessibilityState={{ checked: props.selected, disabled: props.revealed || props.disabled }}
      disabled={props.revealed || props.disabled}
      onPress={props.onPress}
      style={({ pressed }) => [
        styles.container,
        props.selected && !props.revealed && styles.selected,
        props.revealed && props.correct && styles.correct,
        props.revealed && props.selected && !props.correct && styles.incorrect,
        props.revealed && !props.correct && !props.selected && styles.dimmed,
        pressed && !props.revealed && !props.disabled && styles.pressed,
      ]}
    >
      <View style={styles.items}>
        <H5 style={styles.letter}>{hebrewLetters[props.index]}.</H5>
        <OptionText style={styles.text}>{props.text}</OptionText>
      </View>
    </ThemedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 58,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    width: "100%", // Ensures container takes full width
  },
  selected: {
    borderColor: "#19D3DC",
    backgroundColor: "#31465C",
  },
  correct: {
    borderColor: "#4ADE80",
    backgroundColor: "#176534",
  },
  incorrect: {
    borderColor: "#FB7185",
    backgroundColor: "#881F36",
  },
  dimmed: {
    opacity: 0.58,
  },
  pressed: {
    opacity: 0.82,
  },
  letter: {
    textAlign: "center",
  },
  items: {
    flex: 1,
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center", // Align items vertically center
    gap: 12,
  },
  text: {
    flex: 1, // Allows text to take remaining space
    textAlign: "center",
    flexWrap: "wrap", // Allows text to wrap
  },
});
