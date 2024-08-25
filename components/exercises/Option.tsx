import { StyleSheet, View, Text } from "react-native";
import { ThemedPressable } from "../ThemedPressable";
import { H5, OptionText } from "../UI/typography/Typography";
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
      <View style={styles.items}>
        <H5 style={styles.letter}>{hebrewLetters[props.index]}.</H5>
        <OptionText style={styles.text}>{props.text}</OptionText>
      </View>
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
    width: "100%", // Ensures container takes full width
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
