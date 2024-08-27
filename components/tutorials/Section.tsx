import { StyleSheet, View, ViewProps } from "react-native";

export default function Section(props: ViewProps) {
  return (
    <View style={[styles.section, props.style]} {...props}>
      {props.children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginVertical: 16,
  },
});
