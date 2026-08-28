import Ionicons from "@expo/vector-icons/Ionicons";
import { Href, router } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

import { H6 } from "@/components/UI/typography/Typography";
import { Colors } from "@/constants/Colors";

type CourseNavigationBarProps = {
  backFallbackPath: string;
  tableOfContentsPath?: string;
  myCoursesPath?: string;
};

export default function CourseNavigationBar({
  backFallbackPath,
  tableOfContentsPath,
  myCoursesPath = "/my_courses",
}: CourseNavigationBarProps) {
  const navigateTo = (path: string) => {
    router.navigate(path as Href<string | object>);
  };

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    navigateTo(backFallbackPath);
  };

  return (
    <View style={styles.navigationBar}>
      <NavigationButton
        accessibilityLabel="חזרה למסך הקודם"
        icon="arrow-forward"
        label="חזרה"
        onPress={goBack}
      />

      <View style={styles.quickLinks}>
        {tableOfContentsPath ? (
          <NavigationButton
            accessibilityLabel="חזרה לתוכן הקורס"
            icon="list"
            label="תוכן"
            link
            onPress={() => navigateTo(tableOfContentsPath)}
          />
        ) : null}

        <NavigationButton
          accessibilityLabel="חזרה לקורסים שלי"
          icon="library-outline"
          label="קורסים"
          link
          onPress={() => navigateTo(myCoursesPath)}
        />
      </View>
    </View>
  );
}

type NavigationButtonProps = {
  accessibilityLabel: string;
  icon: "arrow-forward" | "list" | "library-outline";
  label: string;
  link?: boolean;
  onPress: () => void;
};

function NavigationButton({
  accessibilityLabel,
  icon,
  label,
  link = false,
  onPress,
}: NavigationButtonProps) {
  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={link ? "link" : "button"}
      hitSlop={4}
      onPress={onPress}
      style={({ pressed }) => [
        styles.navigationButton,
        pressed && styles.navigationButtonPressed,
      ]}
    >
      <Ionicons name={icon} size={20} color={Colors.dark.text} />
      <H6 style={styles.navigationLabel}>{label}</H6>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  navigationBar: {
    width: "100%",
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
});
