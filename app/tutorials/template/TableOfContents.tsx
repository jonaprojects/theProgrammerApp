import { ScrollView, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { Href, Link } from "expo-router";
import Container from "@/components/UI/Container";
import Body from "@/components/UI/Body";
import { H4, P } from "@/components/UI/typography/Typography";
import { TableOfContentsModel } from "@/data/tutorials/models/tableOfContentsModel";
import CourseHeader from "./CourseHeader";
import Navbar from "@/components/UI/Navbar";

type TableOfContentsProps = {
  data: TableOfContentsModel;
  courseHeaderImg: number;
};

export default function TableOfContents(props: TableOfContentsProps) {
  return (
    <Body>
      <Navbar />
      <ScrollView>
        <CourseHeader backgroundImg={props.courseHeaderImg} />
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
                      return (
                        <View
                          style={{ flexDirection: "row-reverse", gap: 5 }}
                          key={`content${index}`}
                        >
                          <View>
                            {index < contentsLength - 1 && (
                              <Image
                                source={require("@/assets/images/icons/checkmarkCompleted.png")}
                                style={{
                                  width: 32,
                                  height: 52,
                                }}
                              />
                            )}
                            {index === contentsLength - 1 && (
                              <Image
                                source={require("@/assets/images/icons/checkmarkCompleted1.png")}
                                style={{
                                  width: 32,
                                  height: 32,
                                }}
                                key={index}
                              />
                            )}
                          </View>
                          <View style={{ marginTop: 5 }}>
                            <Link
                              href={value as Href<string | object>}
                              key={key}
                            >
                              <P>{key}</P>
                            </Link>
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
    marginTop: -100,
    paddingLeft: 16,
  },
});
