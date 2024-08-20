import MyCourse from "@/components/course_cards/MyCourse";
import Body from "@/components/UI/Body";
import Container from "@/components/UI/Container";
import Navbar from "@/components/UI/Navbar";
import { H1 } from "@/components/UI/typography/Typography";
import { FlatList, StyleSheet, View } from "react-native";

// TODO: this data will be taken from different APIs in the future
type Course = {
  id: number;
  name: string;
  currentLesson: number;
  numOfLessons: number;
  backgroundImg: number;
  info?: string;
};

const MY_COURSES: Course[] = [
  {
    id: 0,
    name: "קורס תכנות בפייתון",
    currentLesson: 21,
    numOfLessons: 36,
    backgroundImg: require("@/assets/images/courses/pythonCourseCard.png"),
    info: "",
  },
  {
    id: 1,
    name: "קורס HTML",
    currentLesson: 11,
    numOfLessons: 24,
    backgroundImg: require("@/assets/images/courses/htmlCourseCard.png"),
    info: "",
  },
  {
    id: 2,
    name: "קורס תכנות בפייתון",
    currentLesson: 21,
    numOfLessons: 36,
    backgroundImg: require("@/assets/images/courses/pythonCourseCard.png"),
    info: "",
  },
];
export default function MyCourses() {
  return (
    <Body style={styles.body}>
      <Navbar />
      <Container style={styles.container}>
        <H1 style={{ marginTop: 48, marginBottom: 24 }}>הקורסים שלי</H1>
        <View style={{ flex: 1 }}>
          <FlatList
            data={MY_COURSES}
            scrollEnabled
            horizontal={false} // Ensures vertical scrolling
            showsVerticalScrollIndicator={false} // Shows the vertical scroll indicator
            renderItem={({ item }) => {
              return (
                <MyCourse
                  courseID={item.id}
                  courseName={item.name}
                  backgroundImg={item.backgroundImg}
                  currentLesson={item.currentLesson}
                  numOfLessons={item.numOfLessons}
                  style={{ marginBottom: 8 }}
                />
              );
            }}
          />
        </View>
      </Container>
    </Body>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  container: { flex: 1 },
});
