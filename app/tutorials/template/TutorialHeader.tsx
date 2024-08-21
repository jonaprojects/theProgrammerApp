import { H2 } from "@/components/UI/typography/Typography";
import { Image } from "expo-image";
import type { ImageStyle, StyleProp, ViewStyle } from "react-native";
import { View, ImageBackground, StyleSheet } from "react-native";

type TutorialHeaderProps = {
  backgroundImg: number;
  title: string;
  style?: StyleProp<ImageStyle>;
};

export default function TutorialHeader(props: TutorialHeaderProps) {
  return (
    <ImageBackground
      source={props.backgroundImg}
      resizeMode="cover"
      style={[styles.backgroundImg, props.style]}
    >
      <View style={styles.content}>
        <View style={styles.headerItems}>
          <View style={styles.toolkit}>
            <Image
              source={require("@/assets/images/icons/favorite.svg")}
              style={styles.icon}
            />
            <Image
              source={require("@/assets/images/icons/items.svg")}
              style={styles.icon}
            />
          </View>
          <H2>{props.title} </H2>
        </View>
      </View>
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
  headerItems: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
