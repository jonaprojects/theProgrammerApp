import type { ImageStyle, StyleProp } from "react-native";
import { View, ImageBackground, StyleSheet } from "react-native";
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
    width: "100%",
    maxWidth: 840,
    alignSelf: "center",
    paddingHorizontal: 20,
  },
});
