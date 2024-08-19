import { StyleSheet } from "react-native";
import { ThemedPressable } from "../ThemedPressable";
import { H5 } from "../UI/typography/Typography";
import { Colors } from "@/constants/Colors";

type OptionProps = {
  index: number;
  text: string;
};

const hebrewLetters = ["א", "ב", "ג", "ד"];

export default function Option(props: OptionProps) {
  return (
    <ThemedPressable
      darkColor={Colors.dark.optionBackgroundColor}
      lightColor={Colors.light.optionBackgroundColor}
      style={styles.container}
    >
      <H5 style={styles.letter}>{hebrewLetters[props.index]}.</H5>
      <H5>{props.text}</H5>
    </ThemedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  letter: {
    position: "absolute",
    right: 8
  },
});
