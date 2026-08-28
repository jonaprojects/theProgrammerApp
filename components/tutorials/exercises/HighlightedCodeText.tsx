import { StyleSheet, Text } from "react-native";

const TOKEN_PATTERN = /(#.*$|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b(?:and|as|break|class|continue|def|elif|else|False|for|from|if|import|in|is|None|not|or|pass|print|range|return|True|while)\b|\b\d+(?:\.\d+)?\b)/gm;
const TOKEN_EXACT = /^(#.*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|(?:and|as|break|class|continue|def|elif|else|False|for|from|if|import|in|is|None|not|or|pass|print|range|return|True|while)|\d+(?:\.\d+)?)$/;

function tokenStyle(token: string) {
  if (token.startsWith("#")) return styles.comment;
  if (token.startsWith('"') || token.startsWith("'")) return styles.string;
  if (/^\d/.test(token)) return styles.number;
  return styles.keyword;
}

export default function HighlightedCodeText({ code }: { code: string }) {
  const parts = code.split(TOKEN_PATTERN);
  return (
    <Text style={styles.code}>
      {parts.map((part, index) =>
        TOKEN_EXACT.test(part) ? (
          <Text key={`${index}-${part}`} style={tokenStyle(part)}>
            {part}
          </Text>
        ) : (
          <Text key={`${index}-${part}`}>{part}</Text>
        ),
      )}
    </Text>
  );
}

const styles = StyleSheet.create({
  code: {
    color: "#D6DEEB",
    fontFamily: "JetBrainsMono_400Regular",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "left",
    writingDirection: "ltr",
  },
  keyword: { color: "#C792EA" },
  string: { color: "#C3E88D" },
  number: { color: "#F78C6C" },
  comment: { color: "#7F8C98" },
});
