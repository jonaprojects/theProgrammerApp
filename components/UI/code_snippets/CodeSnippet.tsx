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
import { StyleSheet } from "react-native";
import CodeHighlighter from "react-native-code-highlighter";
import { atomOneDarkReasonable } from "react-syntax-highlighter/dist/esm/styles/hljs";

type CodeSnippetProps = {
  code: string;
  language: string;
};

export default function CodeSnippet(props: CodeSnippetProps) {
  return (
    <CodeHighlighter
      hljsStyle={atomOneDarkReasonable}
      textStyle={styles.text}
      scrollViewProps={{ contentContainerStyle: styles.codeContainer }}
      language={props.language}
    >
      {props.code}
    </CodeHighlighter>
  );
}

const styles = StyleSheet.create({
  codeContainer: {
    padding: 16,
    minWidth: "100%",
  },
  text: {
    fontSize: 16,
    fontFamily: "JetBrainsMono_400Regular",
  },
});
