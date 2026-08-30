import { CourseCardTitle } from "@/components/UI/typography/Typography";
import React, { PropsWithChildren } from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  StyleProp,
  ViewStyle,
} from "react-native";
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
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.toolkit}>
            <Image
              source={require("@/assets/images/icons/favorite.svg")}
              style={styles.icon}
              accessible={false}
            />
            <Image
              source={require("@/assets/images/icons/info.svg")}
              style={styles.icon}
              accessible={false}
            />
          </View>
          <CourseCardTitle>{props.courseName}</CourseCardTitle>
        </View>
        <View>{props.children}</View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    gap: 16,
    borderRadius: 8,
  },

  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  backgroundImage: {
    width: "100%",
    maxHeight: 500,
    borderRadius: 8,
    overflow: "hidden",
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
