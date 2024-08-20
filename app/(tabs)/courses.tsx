import Ionicons from "@expo/vector-icons/Ionicons";
import {
  StyleSheet,
  Image,
  Platform,
  View,
  ScrollView,
  FlatList,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Body from "@/components/UI/Body";
import Container from "@/components/UI/Container";
import { H1, H4 } from "@/components/UI/typography/Typography";
import Chip from "@/components/UI/Chip";
import CourseCard from "@/components/course_cards/CourseCard";
import Course from "@/components/course_cards/Course";
import Navbar from "@/components/UI/Navbar";

type course = {
  id: number;
  name: string;
  description: string;
  info: string;
  backgroundImg: number;
};

const COURSES: course[] = [
  {
    id: 0,
    name: "קורס תכנות בפייתון",
    description:
      "פייתון היא אחת משפות התכנות הפופולריות והמבוקשות כיום. הקורס תוכנן עבור מתחילים מוחלטים. נו - למה אתם מחכים?",
    info: "",
    backgroundImg: require("@/assets/images/courses/pythonCourseCard.png"),
  },
  {
    id: 1,
    name: "קורס HTML",
    description:
      "למדו כיצד ניתן לפתח אתרים בסיסיים עם HTML. הקורס מותאם הן למתחילים שמעוניינים להיכנס לעולם ה-web וכן לאלו שרוצים לשפר ולרענן.",
    info: "",
    backgroundImg: require("@/assets/images/courses/htmlCourseCard.png"),
  },
  {
    id: 3,
    name: "קורס תכנות בפייתון",
    description:
      "פייתון היא אחת משפות התכנות הפופולריות והמבוקשות כיום. הקורס תוכנן עבור מתחילים מוחלטים. נו - למה אתם מחכים?",
    info: "",
    backgroundImg: require("@/assets/images/courses/pythonCourseCard.png"),
  },
];
export default function Courses() {
  return (
    <Body style={{ flex: 1 }}>
      <Navbar />
      <Container
        style={{ flex: 1, paddingHorizontal: 8, paddingTop: 48, gap: 32 }}
      >
        <View style={{ gap: 16 }}>
          <H1>קורסים</H1>
          <ScrollView
            style={{ flexDirection: "row" }}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          >
            <Chip text="תכנות מונחה עצמים" style={{ marginRight: 4 }} />
            <Chip text="אבטחת מידע" style={{ marginRight: 4 }} />
            <Chip text="פייתון" style={{ marginRight: 4 }} />
            <Chip text="פיתוח אתרים" />
          </ScrollView>
        </View>
        <View style={{ flex: 1, gap: 16 }}>
          <H4>בשבילך</H4>
          <FlatList
            data={COURSES}
            horizontal={false} // Ensures vertical scrolling
            showsVerticalScrollIndicator={false} // Shows the vertical scroll indicator
            renderItem={({ item }) => {
              return (
                <Course
                  courseName={item.name}
                  courseBgImage={item.backgroundImg}
                  courseDescription={item.description}
                  courseID={item.id}
                  style={{
                    marginBottom: 8,
                  }}
                />
              );
            }}
            keyExtractor={(course) => `${course.id}`}
          />
        </View>
      </Container>
    </Body>
  );
}
