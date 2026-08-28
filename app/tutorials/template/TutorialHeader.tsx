import { H2, H6 } from "@/components/UI/typography/Typography";
import Ionicons from "@expo/vector-icons/Ionicons";
import type { ImageStyle, StyleProp } from "react-native";
import { View, StyleSheet, Pressable } from "react-native";
import { Href, router } from "expo-router";
import CourseHeader from "./CourseHeader";
import { Colors } from "@/constants/Colors";


type TutorialHeaderProps = {
  backgroundImg: number;
  title: string;
  style?: StyleProp<ImageStyle>;
  tableOfContentsPath: string;
  coursesPath: string;
};

export default function TutorialHeader(props: TutorialHeaderProps) {
  const navigateTo = (path: string) => {
    router.navigate(path as Href<string | object>);
  };

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    navigateTo(props.tableOfContentsPath);
  };

  return (
    <CourseHeader backgroundImg={props.backgroundImg} style={props.style}>
      <View style={styles.headerItems}>
        <View style={styles.navigationBar}>
          <Pressable
            accessibilityLabel="חזרה למסך הקודם"
            accessibilityHint="אם אין מסך קודם, חוזר לתוכן הקורס"
            accessibilityRole="button"
            hitSlop={4}
            onPress={goBack}
            style={({ pressed }) => [
              styles.navigationButton,
              pressed && styles.navigationButtonPressed,
            ]}
          >
            <Ionicons name="arrow-forward" size={21} color={Colors.dark.text} />
            <H6 style={styles.navigationLabel}>חזרה</H6>
          </Pressable>

          <View style={styles.quickLinks}>
            <Pressable
              accessibilityLabel="חזרה לתוכן הקורס"
              accessibilityRole="link"
              hitSlop={4}
              onPress={() => navigateTo(props.tableOfContentsPath)}
              style={({ pressed }) => [
                styles.navigationButton,
                pressed && styles.navigationButtonPressed,
              ]}
            >
              <Ionicons name="list" size={20} color={Colors.dark.text} />
              <H6 style={styles.navigationLabel}>תוכן</H6>
            </Pressable>

            <Pressable
              accessibilityLabel="חזרה לכל הקורסים"
              accessibilityRole="link"
              hitSlop={4}
              onPress={() => navigateTo(props.coursesPath)}
              style={({ pressed }) => [
                styles.navigationButton,
                pressed && styles.navigationButtonPressed,
              ]}
            >
              <Ionicons
                name="library-outline"
                size={20}
                color={Colors.dark.text}
              />
              <H6 style={styles.navigationLabel}>קורסים</H6>
            </Pressable>
          </View>
        </View>
        <H2 style={styles.title}>{props.title}</H2>
      </View>
    </CourseHeader>
  );
}

const styles = StyleSheet.create({
  headerItems: {
    gap: 20,
  },
  navigationBar: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  quickLinks: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  navigationButton: {
    minHeight: 44,
    minWidth: 44,
    paddingHorizontal: 10,
    borderRadius: 12,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "rgba(17, 24, 34, 0.82)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
  },
  navigationButtonPressed: {
    opacity: 0.72,
    transform: [{ scale: 0.98 }],
  },
  navigationLabel: {
    fontSize: 14,
    lineHeight: 18,
  },
  title: {
    width: "100%",
  },
});
