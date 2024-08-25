import MyCourse from "@/components/course_cards/MyCourse";
import Task from "@/components/tasks/Task";
import Body from "@/components/UI/Body";
import Container from "@/components/UI/Container";
import Navbar from "@/components/UI/Navbar";
import TopicProgress from "@/components/UI/topic_progress/TopicProgress";
import { H4 } from "@/components/UI/typography/Typography";
import { router } from "expo-router";
import React from "react";
import { View } from "react-native";
import { FlatList } from "react-native";

type Task = {
  id: number;
  name: string;
  status: "complete" | "incomplete";
  progress: number;
};
const DUMMY_TASKS: Task[] = [
  {
    id: 0,
    name: "פתרו 10 תרגילים נכון ברציפות",
    status: "incomplete",
    progress: 40,
  },
  {
    id: 1,
    name: "להירשם לקורס אחד לפחות",
    status: "complete",
    progress: 100,
  },
];

export default function Home() {
  return (
    <Body>
      <Navbar />
      <FlatList
        ListHeaderComponent={
          <Container>
            <View style={{ gap: 16, marginTop: 32, marginBottom: 24 }}>
              <View style={{ gap: 8 }}>
                <H4>המשך מאיפה שעצרת</H4>
              </View>
              <View style={{ gap: 8 }}>
                <MyCourse
                  courseID={0}
                  courseName={"מבוא לפייתון"}
                  backgroundImg={require("@/assets/images/courses/pythonCourseCard.png")}
                  currentLesson={5}
                  numOfLessons={24}
                  navigateFn={() => {
                    router.navigate("/(tabs)/my_courses");
                  }}
                />
                <TopicProgress
                  topic="פיתוח אתרים"
                  totalNumOfQuestions={37}
                  questionsAnswered={12}
                  style={{ marginBottom: 8 }}
                  onPress={() => {
                    router.navigate("/exercise?topic=webdev");
                  }}
                />
                
              </View>
            </View>
            <View>
              <H4 style={{ marginBottom: 16 }}>משימות</H4>
            </View>
          </Container>
        }
        data={DUMMY_TASKS}
        renderItem={({ item }) => (
          <Task
            isCompleted={item.status === "complete"}
            name={item.name}
            progress={item.progress}
            onPress={() => console.log(item.name)}
            style={{ marginBottom: 8 }}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </Body>
  );
}
