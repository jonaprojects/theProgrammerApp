import ProgressLine from "./ProgressLine";
import { View, StyleSheet } from "react-native";
type ProgressProps = {
  numOfSteps: number;
  currentStep: number;
};

export default function Progress(props: ProgressProps) {
  const stepsArray = Array.from({ length: props.numOfSteps }, (_, i) => i + 1);

  return (
    <View style={styles.progress}>
      {stepsArray.map((number) => {
        return (
          <View key={number} style={styles.progressLineContainer}>
            <ProgressLine active={number <= props.currentStep} />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  progress: {
    width: "100%",
    gap: 4,
    flexDirection: "row",
    justifyContent: "space-between", // Distributes ProgressLine components evenly
    alignItems: "center", // Centers them vertically
  },
  progressLineContainer: {
    flex: 1,
  },
});
