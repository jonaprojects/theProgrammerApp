import { ScrollView, StyleSheet, View } from "react-native";
import { Href, Link } from "expo-router";
import Container from "@/components/UI/Container";
import Body from "@/components/UI/Body";
import { H4, P } from "@/components/UI/typography/Typography";
import { TableOfContentsModel } from "@/data/tutorials/models/tableOfContentsModel";
import CourseHeader from "./CourseHeader";
import Navbar from "@/components/UI/Navbar";
import CourseNavigationBar from "./CourseNavigationBar";

type TableOfContentsProps = {
  data: TableOfContentsModel;
  courseHeaderImg: number;
  basePath: string;
  lessonStatusByPath?: Record<string, "not_started" | "in_progress" | "completed">;
};

export default function TableOfContents(props: TableOfContentsProps) {
  return (
    <Body>
      <Navbar />
      <ScrollView>
        <CourseHeader backgroundImg={props.courseHeaderImg}>
          <CourseNavigationBar backFallbackPath="/my_courses" />
        </CourseHeader>
        <Container style={styles.pageContent}>
          <View style={{ padding: 5 }}>
            {props.data.map((section, index) => {
              return (
                <View style={{ marginBottom: 15 }} key={`section${index}`}>
                  <H4 style={{ marginVertical: 16 }}>{section.title}</H4>
                  {Object.entries(section.contents).map(
                    ([key, value], index) => {
                      const contentsLength = Object.keys(
                        section.contents
                      ).length;
                      const status = props.lessonStatusByPath?.[value] ?? "not_started";
                      return (
                        <View
                          style={styles.lessonRow}
                          key={`content${index}`}
                        >
                          <View style={styles.markerColumn}>
                            <View style={[
                              styles.marker,
                              status === "completed" && styles.completedMarker,
                              status === "in_progress" && styles.currentMarker,
                            ]}>
                              {status === "completed" ? <P style={styles.checkmark}>✓</P> : null}
                            </View>
                            {index < contentsLength - 1 ? (
                              <View style={[styles.line, status === "completed" && styles.completedLine]} />
                            ) : null}
                          </View>
                          <View style={styles.lessonDetails}>
                            <Link
                              href={`${props.basePath}/${value}` as Href<string | object>}
                              key={key}
                            >
                              <P>{key}</P>
                            </Link>
                            {status === "in_progress" ? (
                              <P style={styles.currentLabel}>השיעור הנוכחי</P>
                            ) : null}
                          </View>
                        </View>
                      );
                    }
                  )}
                </View>
              );
            })}
          </View>
        </Container>
      </ScrollView>
    </Body>
  );
}

const styles = StyleSheet.create({
  pageContent: {
    flex: 1,
    width: "100%",
    maxWidth: 840,
    alignSelf: "center",
    marginTop: -40,
    paddingHorizontal: 20,
  },
  lessonRow: {
    flexDirection: "row-reverse",
    gap: 10,
    minHeight: 52,
  },
  markerColumn: {
    width: 24,
    alignItems: "center",
  },
  marker: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#677384",
    backgroundColor: "#222831",
    alignItems: "center",
    justifyContent: "center",
  },
  completedMarker: {
    borderColor: "#00ADB5",
    backgroundColor: "#00ADB5",
  },
  currentMarker: {
    borderColor: "#52F5FD",
    backgroundColor: "#29374B",
  },
  checkmark: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: "Heebo_700Bold",
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: "#45505F",
  },
  completedLine: {
    backgroundColor: "#00ADB5",
  },
  lessonDetails: {
    flex: 1,
    minWidth: 0,
    paddingTop: 1,
    paddingBottom: 12,
    alignItems: "flex-end",
  },
  currentLabel: {
    marginTop: 2,
    color: "#52F5FD",
    fontSize: 13,
  },
});
