import { H5, P } from "@/components/UI/typography/Typography";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

type NextPageProps = {
  onNextPage: () => void;
  nextPageTitle: string;
  style?: StyleProp<ViewStyle>;
};

export default function NextPage(props: NextPageProps) {
  return (
    <Pressable
      style={[styles.container, props.style]}
      onPress={props.onNextPage}
    >
      <LinearGradient
        // Colors for the gradient
        colors={["#1C2027", "#243144"]}
        // Optionally control the gradient start and end points
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View>
            <Image
              source={require("@/assets/images/icons/next.svg")}
              style={{ width: 32, height: 32 }}
            />
          </View>
          <View style={styles.details}>
            <P>עבור לפרק הבא</P>
            <H5>{props.nextPageTitle}</H5>
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "75%",
    maxWidth: 300,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#00ADB5",
    alignSelf: "flex-end",
  },
  gradient: {
    width: "100%",
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 16,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  details: {
    gap: 8,
  },
});
