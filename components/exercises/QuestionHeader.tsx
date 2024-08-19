import {
  useColorScheme,
  View,
  ImageBackground,
  StyleSheet,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { H4 } from "../UI/typography/Typography";

type QuestionHeaderProps = {
  question: string;
};
export default function QuestionHeader(props: QuestionHeaderProps) {
  const theme = "dark"; //TODO: later update it

  return (
    <ImageBackground
      source={require("@/assets/images/questionHeaderBackground.png")}
      resizeMode="cover"
      style={styles.backgroundImage}
    >
      <View style={styles.content}>
        <H4 style={styles.title}>{props.question}</H4>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  title: {
    textAlign: "center",
  },

  content: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },

  backgroundImage: {
    justifyContent: "center", // Centers content vertically
    alignItems: "center", // Centers content horizontally
    width: "100%",
    height: "100%",
  },
});
