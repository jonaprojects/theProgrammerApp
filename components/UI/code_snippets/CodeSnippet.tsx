import React from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import CodeHighlighter from "react-native-code-highlighter";
import { atomOneDarkReasonable } from "react-syntax-highlighter/dist/esm/styles/hljs";

type CodeSnippetProps = {
  code: string;
  language: string;
  style?: StyleProp<ViewStyle>;
  showLanguage?: boolean;
  compact?: boolean;
};

export default function CodeSnippet(props: CodeSnippetProps) {
  return (
    <View
      accessibilityLabel={`קטע קוד בשפת ${props.language}`}
      style={[styles.container, props.compact && styles.compactContainer, props.style]}
    >
      {props.showLanguage !== false && (
        <View style={styles.toolbar}>
          <Text style={styles.language}>{props.language || "code"}</Text>
          <View style={styles.statusDot} />
        </View>
      )}
      <CodeHighlighter
        hljsStyle={atomOneDarkReasonable}
        textStyle={styles.text}
        scrollViewProps={{
          horizontal: true,
          showsHorizontalScrollIndicator: false,
          contentContainerStyle: [
            styles.codeContainer,
            props.compact && styles.compactCodeContainer,
          ],
        }}
        language={props.language}
      >
        {props.code}
      </CodeHighlighter>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    width: "100%",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#39485E",
    overflow: "hidden",
    backgroundColor: "#202631",
  },
  compactContainer: {
    marginVertical: 0,
  },
  toolbar: {
    height: 34,
    paddingHorizontal: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#171C24",
    borderBottomWidth: 1,
    borderBottomColor: "#303C4E",
  },
  language: {
    color: "#94A3B8",
    fontFamily: "JetBrainsMono_400Regular",
    fontSize: 12,
    letterSpacing: 0.7,
    textTransform: "uppercase",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00ADB5",
  },

  codeContainer: {
    padding: 16,
    minWidth: "100%",
  },
  compactCodeContainer: {
    paddingVertical: 14,
  },
  text: {
    fontSize: 16,
    lineHeight: 23,
    fontFamily: "JetBrainsMono_400Regular",
    writingDirection: "ltr",
  },
});
