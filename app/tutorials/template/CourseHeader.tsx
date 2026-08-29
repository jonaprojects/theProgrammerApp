import type { StyleProp, ViewStyle } from "react-native";
import { View, ImageBackground, StyleSheet } from "react-native";
import { PropsWithChildren } from "react";

type TutorialHeaderProps = PropsWithChildren<{
  backgroundImg?: number;
  style?: StyleProp<ViewStyle>;
}>;

export default function CourseHeader(props: TutorialHeaderProps) {
  const content = <View style={styles.content}>{props.children}</View>;

  if (!props.backgroundImg) {
    return <View style={[styles.backgroundImg, styles.solidBackground, props.style]}>{content}</View>;
  }

  return (
    <ImageBackground
      source={props.backgroundImg}
      resizeMode="cover"
      style={[styles.backgroundImg, props.style]}
    >
      {content}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImg: {
    minHeight: 200,
    aspectRatio: 2,
    width: "100%",
    justifyContent: "center",
    overflow: "hidden",
  },
  content: {
    width: "100%",
    maxWidth: 840,
    alignSelf: "center",
    paddingHorizontal: 20,
  },
  solidBackground: {
    backgroundColor: "#202631",
  },
});
