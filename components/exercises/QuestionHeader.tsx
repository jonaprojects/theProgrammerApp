import { View, ImageBackground, StyleSheet } from "react-native";
import { H4, SecondaryText } from "../UI/typography/Typography";
import CodeSnippet from "../UI/code_snippets/CodeSnippet";
import Container from "../UI/Container";

type QuestionHeaderProps = {
  question: string;
  codeSnippet?: {
    language: string;
    code: string;
  };
  progressLabel?: string;
};
export default function QuestionHeader(props: QuestionHeaderProps) {
  return (
    <ImageBackground
      source={require("@/assets/images/questionHeaderBackground.png")}
      resizeMode="cover"
      style={styles.backgroundImage}
    >
      <Container style={styles.container}>
        <View style={styles.content}>
          {props.progressLabel ? (
            <SecondaryText style={styles.progressLabel}>
              {props.progressLabel}
            </SecondaryText>
          ) : null}
          <H4 style={styles.title}>{props.question}</H4>
          {props.codeSnippet && (
            <CodeSnippet
              code={props.codeSnippet.code}
              language={props.codeSnippet.language}
              showLanguage
              compact
              style={styles.codeSnippet}
            />
          )}
        </View>
      </Container>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  progressLabel: {
    textAlign: "center",
    fontFamily: "Heebo_500Medium",
  },
  title: {
    textAlign: "center",
    maxWidth: 760,
  },
  container: {
    maxWidth: 840,
    alignSelf: "center",
    paddingHorizontal: 16,
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingVertical: 28,
    gap: 20,
  },
  codeSnippet: {
    maxWidth: 720,
  },
  backgroundImage: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    minHeight: 220,
    overflow: "hidden",
  },
});
