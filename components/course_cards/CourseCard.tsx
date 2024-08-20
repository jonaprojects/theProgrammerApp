import { CourseCardTitle, P } from "@/components/UI/typography/Typography";
import React, { PropsWithChildren } from "react";
import {
  Pressable,
  ImageBackground,
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
} from "react-native";
import PrimaryButton from "../UI/buttons/PrimaryButton";
import { Image } from "expo-image";

type CourseCardProps = PropsWithChildren<{
  courseName: string;
  courseInfo?: string;
  backgroundImage: number;
  style?: StyleProp<ViewStyle>;
}>;

export default function CourseCard(props: CourseCardProps) {
  return (
    <ImageBackground
      source={props.backgroundImage}
      resizeMode="cover"
      style={[styles.backgroundImage, props.style]}
    >
      <Pressable style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.toolkit}>
            <Image
              source={require("@/assets/images/icons/favorite.svg")}
              style={styles.icon}
            />
            <Image
              source={require("@/assets/images/icons/info.svg")}
              style={styles.icon}
            />
          </View>
          <CourseCardTitle>{props.courseName}</CourseCardTitle>
        </View>
        <View>{props.children}</View>
      </Pressable>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  card: {
    justifyContent: "center",
    paddingVertical: 24,
    paddingHorizontal: 8,
    gap: 16,
    borderRadius: 4,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  backgroundImage: {
    justifyContent: "center", // Centers content vertically
    alignItems: "center", // Centers content horizontally
    width: "100%",
    maxHeight: 500,
    borderRadius: 4,
  },

  toolkit: {
    flexDirection: "row",
    gap: 4,
  },

  icon: {
    width: 24,
    height: 24,
    verticalAlign: "middle",
  },
});
