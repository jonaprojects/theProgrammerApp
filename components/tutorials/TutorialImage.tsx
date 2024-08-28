import { Image, ImageProps } from "expo-image";

export default function TutorialImage(props: ImageProps) {
  return (
    <Image
      style={[
        {
          width: "100%",
          aspectRatio: 1.5,
          resizeMode: "cover",
          marginVertical: 8,
        },
        props.style,
      ]}
      {...props}
    />
  );
}
