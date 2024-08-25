import { StyleSheet, View } from "react-native";
import { Colors } from "@/constants/Colors";
import { ThemedView } from "../ThemedView";
import Container from "./Container";
import { H6 } from "./typography/Typography";
import { Image } from "expo-image";
import UserIconsMap, {
  letterMapper as letterToIndexMapper,
} from "./UserIconMap";

export default function Navbar() {
  return (
    <ThemedView
      darkColor={Colors.dark.navbarBg}
      lightColor={Colors.light.navbarBg}
    >
      <Container style={styles.contentContainer}>
        <Image
          source={require("@/assets/images/icons/logo.svg")}
          style={{
            width: 32,
            height: 32,
          }}
        />
        <View style={styles.navbarRightPanel}>
          <View style={styles.pointsContainer}>
            <Image
              source={require("@/assets/images/icons/trophy.svg")}
              style={{
                width: 32,
                height: 32,
              }}
            />
            <H6>0</H6>
          </View>
          <View style={styles.profileDataContainer}>
            <Image
              source={UserIconsMap[letterToIndexMapper["י"]]}
              style={{
                width: 32,
                height: 32,
              }}
            />
            <H6>יהונתן</H6>
          </View>
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
  },
  profileDataContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  navbarRightPanel: {
    flexDirection: "row",
    gap: 32,
  },
  pointsContainer: {
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
  },
});
