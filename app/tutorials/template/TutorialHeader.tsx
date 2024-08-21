import { H2 } from "@/components/UI/typography/Typography";
import { Image } from "expo-image";
import type { ImageStyle, StyleProp, ViewStyle } from "react-native";
import { View, ImageBackground, StyleSheet, Pressable } from "react-native";
import { Href, router } from "expo-router";
import CourseHeader from "./CourseHeader";

type TutorialHeaderProps = {
  backgroundImg: number;
  title: string;
  style?: StyleProp<ImageStyle>;
  tableOfContentsPath: string;
};

export default function TutorialHeader(props: TutorialHeaderProps) {
  return (
    <CourseHeader backgroundImg={props.backgroundImg}>
      <View style={styles.headerItems}>
        <View style={styles.toolkit}>
          <Image
            source={require("@/assets/images/icons/favorite.svg")}
            style={styles.icon}
          />
          <Pressable
            onPress={() => {
              router.navigate(
                props.tableOfContentsPath as Href<string | object>
              );
            }}
          >
            <Image
              source={require("@/assets/images/icons/items.svg")}
              style={styles.icon}
            />
          </Pressable>
        </View>
        <H2>{props.title} </H2>
      </View>
    </CourseHeader>
  );
}

const styles = StyleSheet.create({
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
