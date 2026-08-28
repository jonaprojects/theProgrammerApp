import { Pressable, StyleSheet, View } from "react-native";
import { Link } from "expo-router";
import { Colors } from "@/constants/Colors";
import { ThemedView } from "../ThemedView";
import Container from "./Container";
import { H6 } from "./typography/Typography";
import { Image } from "expo-image";
import UserIconsMap, {
  letterMapper as letterToIndexMapper,
} from "./UserIconMap";
import { useProgress } from "@/context/ProgressContext";

export default function Navbar() {
  const { progress } = useProgress();
  const displayName = progress?.user.displayName ?? "משתמש";
  const iconIndex = letterToIndexMapper[displayName.trim().charAt(0)] ?? 10;
  return (
    <ThemedView
      darkColor={Colors.dark.navbarBg}
      lightColor={Colors.light.navbarBg}
    >
      <Container style={styles.contentContainer}>
        <Link href="/" asChild>
          <Pressable
            accessibilityLabel="חזרה לדף הבית"
            accessibilityRole="link"
            hitSlop={8}
            style={({ pressed }) => [
              styles.logoButton,
              pressed && styles.logoButtonPressed,
            ]}
          >
            <Image
              source={require("@/assets/images/icons/logo.svg")}
              style={styles.logo}
            />
          </Pressable>
        </Link>
        <View style={styles.navbarRightPanel}>
          <View style={styles.pointsContainer}>
            <Image
              source={require("@/assets/images/icons/trophy.svg")}
              style={{
                width: 32,
                height: 32,
              }}
            />
            <H6>{progress?.user.points ?? 0}</H6>
          </View>
          <Link href="/profile" asChild>
            <Pressable
              accessibilityLabel="פתיחת הפרופיל"
              accessibilityHint="פותח את פרטי הפרופיל"
              accessibilityRole="link"
              hitSlop={8}
              style={({ pressed }) => [styles.profileButton, pressed && styles.logoButtonPressed]}
            >
              <Image source={UserIconsMap[iconIndex]} style={styles.profileIcon} />
            </Pressable>
          </Link>
        </View>
      </Container>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  logoButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  logoButtonPressed: {
    opacity: 0.7,
  },
  logo: {
    width: 32,
    height: 32,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  profileIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  navbarRightPanel: {
    flexDirection: "row",
    gap: 20,
  },
  pointsContainer: {
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
  },
});
