import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import PrimaryButton, { SmallPrimaryButton } from "../UI/buttons/PrimaryButton";
import { P } from "../UI/typography/Typography";
import CourseCard from "./CourseCard";

type CourseProps = {
  courseName: string;
  courseBgImage: number;
  courseDescription: string;
  cousreInfo?: string;
  courseID: number;
  style?: StyleProp<ViewStyle>;
};

export default function Course(props: CourseProps) {
  return (
    <CourseCard
      courseName={props.courseName}
      backgroundImage={props.courseBgImage}
      style={props.style}
    >
      <View style={styles.courseBody}>
        <P>{props.courseDescription}</P>
        <SmallPrimaryButton>הירשם לקורס</SmallPrimaryButton>
      </View>
    </CourseCard>
  );
}

const styles = StyleSheet.create({
  courseBody: {
    gap: 16,
  },
});
