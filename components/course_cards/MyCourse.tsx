import { StyleProp, View, ViewStyle } from "react-native";
import PrimaryButton, { SmallPrimaryButton } from "../UI/buttons/PrimaryButton";
import { P } from "../UI/typography/Typography";
import CourseCard from "./CourseCard";
import HorizontalProgressBar from "../UI/horizontal_progress_bar/HorizontalProgressBar";
import { calculatePercentage } from "./auxiliary";

type MyCourseProps = {
  courseID: number;
  courseName: string;
  backgroundImg: number;
  info?: string;
  currentLesson: number;
  numOfLessons: number;
  style?: StyleProp<ViewStyle>;
  navigateFn: () => void;
};
export default function MyCourse(props: MyCourseProps) {
  return (
    <CourseCard
      courseName={props.courseName}
      backgroundImage={props.backgroundImg}
      style={props.style}
    >
      <View style={{ gap: 16 }}>
        <P>
          השלמת {props.currentLesson - 1}/{props.numOfLessons} שיעורים
        </P>
        <SmallPrimaryButton
          onPress={props.navigateFn}
          style={{
            width: 200,
            alignSelf: "flex-end",
          }}
        >
          המשך מאיפה שעצרת
        </SmallPrimaryButton>
        <HorizontalProgressBar
          percentage={calculatePercentage(
            props.currentLesson - 1,
            props.numOfLessons
          )}
        />
      </View>
    </CourseCard>
  );
}
