import type { ImageStyle, StyleProp, ViewStyle } from "react-native";
import { View, ImageBackground, StyleSheet, Pressable } from "react-native";
import { PropsWithChildren } from "react";

type TutorialHeaderProps = PropsWithChildren<{
  backgroundImg: number;
  style?: StyleProp<ImageStyle>;
}>;

export default function CourseHeader(props: TutorialHeaderProps) {
  return (
    <ImageBackground
      source={props.backgroundImg}
      resizeMode="cover"
      style={[styles.backgroundImg, props.style]}
    >
      <View style={styles.content}>{props.children}</View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImg: {
    minHeight: 200,
    aspectRatio: 2,
    width: "100%",
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: 8,
  },
});
