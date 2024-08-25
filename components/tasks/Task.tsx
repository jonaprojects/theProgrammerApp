import React from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { ThemedView } from "../ThemedView";
import { Colors } from "@/constants/Colors";
import { P, TaskTitle } from "../UI/typography/Typography";
import HorizontalProgressBar from "../UI/horizontal_progress_bar/HorizontalProgressBar";
import { Image } from "expo-image";

type TaskProps = {
  isCompleted: boolean;
  name: string;
  onPress: () => void;
  progress: number;
  style?: StyleProp<ViewStyle>;
};

export default function Task(props: TaskProps) {
  const darkColor = props.isCompleted
    ? Colors["dark"].completedTask
    : Colors["dark"].uncompletedTask;

  const lightColor = props.isCompleted
    ? Colors["light"].completedTask
    : Colors["light"].uncompletedTask;

  return (
    <ThemedView
      darkColor={darkColor}
      lightColor={lightColor}
      style={[styles.container, props.style]}
    >
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View>
          <Pressable>
            {props.isCompleted ? (
              <Image
                source={require("@/assets/images/icons/trophy.svg")}
                style={styles.trophyIcon}
              />
            ) : (
              <Image
                source={require("@/assets/images/icons/arrowOut.svg")}
                style={styles.arrowIcon}
              />
            )}
          </Pressable>
        </View>
        <View style={styles.contentContainer}>
          <TaskTitle>{props.name}</TaskTitle>
          <View style={styles.progressContainer}>
            <HorizontalProgressBar
              percentage={props.progress}
              style={{ height: 25 }}
            />
          </View>
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
  },
  progressContainer: {
    width: "75%",
    alignSelf: "flex-end",
  },
  contentContainer: {
    gap: 16,
    flex: 1,
  },

  trophyIcon: {
    width: 28,
    height: 28,
  },

  arrowIcon: {
    width: 24,
    height: 24,
  },
});
