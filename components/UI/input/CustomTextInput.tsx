import { Colors } from "@/constants/Colors";
import { TextInput, useColorScheme, type TextInputProps } from "react-native";

export default function CustomTextInput(props: TextInputProps) {
  const colorScheme = useColorScheme();

  return (
    <TextInput
      style={[
        {
          borderWidth: 1,
          borderRadius: 4,
          borderColor: Colors[colorScheme ?? "dark"].inputBorder,
          fontSize: 16,
          padding: 8,
          color: Colors[colorScheme ?? "dark"].text,
        },
        props.style,
      ]}
      {...props}
    />
  );
}
