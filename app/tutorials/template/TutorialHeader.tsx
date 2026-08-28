import { H2 } from "@/components/UI/typography/Typography";
import type { ImageStyle, StyleProp } from "react-native";
import { View, StyleSheet } from "react-native";
import CourseHeader from "./CourseHeader";
import CourseNavigationBar from "./CourseNavigationBar";


type TutorialHeaderProps = {
  backgroundImg: number;
  title: string;
  style?: StyleProp<ImageStyle>;
  tableOfContentsPath: string;
  myCoursesPath: string;
};

export default function TutorialHeader(props: TutorialHeaderProps) {
  return (
    <CourseHeader backgroundImg={props.backgroundImg} style={props.style}>
      <View style={styles.headerItems}>
        <CourseNavigationBar
          backFallbackPath={props.tableOfContentsPath}
          tableOfContentsPath={props.tableOfContentsPath}
          myCoursesPath={props.myCoursesPath}
        />
        <H2 style={styles.title}>{props.title}</H2>
      </View>
    </CourseHeader>
  );
}

const styles = StyleSheet.create({
  headerItems: {
    gap: 20,
  },
  title: {
    width: "100%",
  },
});
