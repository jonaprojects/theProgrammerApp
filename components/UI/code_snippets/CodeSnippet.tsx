// import SyntaxHighlighter from "react-syntax-highlighter";
// import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";

// type CodeSnippetProps = {
//   code: string;
//   language: string;
// };
// export default function CodeSnippet(props: CodeSnippetProps) {
//   return (
//     <SyntaxHighlighter language={props.language} style={docco}>
//       {props.code}
//     </SyntaxHighlighter>
//   );
// }

import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import CodeHighlighter from "react-native-code-highlighter";
import { atomOneDarkReasonable } from "react-syntax-highlighter/dist/esm/styles/hljs";

type CodeSnippetProps = {
  code: string;
  language: string;
  style?: StyleProp<ViewStyle>;
};

export default function CodeSnippet(props: CodeSnippetProps) {
  return (
    <View style={[styles.container, props.style]}>
      <CodeHighlighter
        hljsStyle={atomOneDarkReasonable}
        textStyle={styles.text}
        scrollViewProps={{ contentContainerStyle: styles.codeContainer }}
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
  },
  
  codeContainer: {
    padding: 16,
    minWidth: "100%",
  },
  text: {
    fontSize: 16,
    fontFamily: "JetBrainsMono_400Regular",
  },
});
