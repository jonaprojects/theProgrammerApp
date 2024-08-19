import { ThemedPressable } from "@/components/ThemedPressable";
import React, { useEffect, useState } from "react";
import { H3 } from "../typography/Typography";
import { Pressable } from "react-native";
// import CustomButton from "./CustomButton";
// import useSoundEffect, { SOUNDS } from "../../hooks/useSoundEffect";

type YesNoButtonProps = {
  type: "yes" | "no";
  userAnswered: boolean;
  correctAnswer: "yes" | "no";
  questionId: number;
  onClick?: () => void;
};
export default function YesNoButton(props: YesNoButtonProps) {
  const [userClicked, setUserClicked] = useState(false);
  //   const [sound, playSound] = useSoundEffect();

  const onClickHandler = () => {
    if (props.userAnswered) {
      return;
      // if the user has already answered, then do nothing and exit
    }
    setUserClicked(true);
    if (props.correctAnswer === props.type) {
      //   playSound(SOUNDS["correct"]);
    } else {
      //   playSound(SOUNDS["mistake"]);
    }
    if (props.onClick) {
      props.onClick();
    }
  };

  let backgroundColor = props.type === "yes" ? "#00ADB5" : "#1E2B3E";
  if (props.userAnswered) {
    if (props.correctAnswer === props.type) {
      backgroundColor = "#17bd2d";
    } else if (userClicked) {
      backgroundColor = "#cc143f";
    }
  }

  useEffect(() => {
    // when moving to another question, set the clicked property to false.
    setUserClicked(false);
  }, [props.questionId]);

  return (
    <Pressable
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        backgroundColor: backgroundColor,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}
      onPress={onClickHandler}
    >
      <H3>{props.type === "yes" ? "נכון" : "לא נכון"}</H3>
    </Pressable>
  );
}
