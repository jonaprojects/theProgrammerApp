import React from "react";
import { Text } from "react-native";
import SyntaxHighlighter from "react-syntax-highlighter/dist/esm/default-highlight";
// import { dracula } from "react-native-syntax-highlighter/dist/index";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";

type CodeSnippetProps = {
  language: string;
  code: string;
};
export default function CodeSnippet(props: CodeSnippetProps) {
  console.log("hello world");
  return (
    <SyntaxHighlighter
      language="python"
      style={docco}
      highlighter={"prism" || "hljs"}
    >
      print('hello world')
    </SyntaxHighlighter>
  );
}
