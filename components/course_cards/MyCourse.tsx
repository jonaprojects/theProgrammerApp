import type { StyleProp, ViewStyle } from "react-native";
import { View } from "react-native";
import { SmallPrimaryButton } from "../UI/buttons/PrimaryButton";
import { P, SecondaryText } from "../UI/typography/Typography";
import CourseCard from "./CourseCard";
import HorizontalProgressBar from "../UI/horizontal_progress_bar/HorizontalProgressBar";

type MyCourseProps = {
  courseID: string;
  courseName: string;
  backgroundImg: number;
  completedLessons: number;
  numOfLessons: number;
  completionPercentage: number;
  status: "not_started" | "in_progress" | "completed";
  resumeLessonTitle?: string | undefined;
  style?: StyleProp<ViewStyle>;
  navigateFn: () => void;
};

export default function MyCourse(props: MyCourseProps) {
  const statusLabel = props.status === "completed"
    ? "הקורס הושלם"
    : props.resumeLessonTitle
      ? `השיעור הבא: ${props.resumeLessonTitle}`
      : "מוכנים להתחיל";

  return (
    <CourseCard courseName={props.courseName} backgroundImage={props.backgroundImg} style={props.style}>
      <View style={{ gap: 14 }}>
        <P>השלמת {props.completedLessons}/{props.numOfLessons} שיעורים</P>
        <SecondaryText>{statusLabel}</SecondaryText>
        <SmallPrimaryButton
          onPress={props.navigateFn}
          style={{ width: 200, alignSelf: "flex-end" }}
        >
          {props.status === "completed"
            ? "לצפייה מחדש"
            : props.status === "not_started"
              ? "התחלת הקורס"
              : "המשך למידה"}
        </SmallPrimaryButton>
        <HorizontalProgressBar percentage={props.completionPercentage} />
      </View>
    </CourseCard>
  );
}
