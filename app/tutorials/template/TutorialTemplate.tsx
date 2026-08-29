import { ScrollView, StyleProp, StyleSheet, ViewStyle } from "react-native";
import TutorialHeader from "./TutorialHeader";
import Body from "@/components/UI/Body";
import Navbar from "@/components/UI/Navbar";
import { PropsWithChildren } from "react";
import Container from "@/components/UI/Container";
import NextPage from "@/components/tutorials/NextPage";
import PrimaryButton from "@/components/UI/buttons/PrimaryButton";
import { P } from "@/components/UI/typography/Typography";

type TutorialTemplateProps = PropsWithChildren<{
  headerBackgroundImg?: number;
  headerTitle: string;
  onNextPage?: () => void;
  nextPageTitle?: string;
  onComplete?: () => void;
  completionLabel?: string;
  completionPending?: boolean;
  progressError?: string | null;
  tableOfContentsPath: string;
  myCoursesPath?: string;
  style?: StyleProp<ViewStyle>;
}>;
export default function TutorialTemplate(props: TutorialTemplateProps) {
  return (
    <Body>
      <Navbar />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <TutorialHeader
          backgroundImg={props.headerBackgroundImg}
          title={props.headerTitle}
          style={styles.header}
          tableOfContentsPath={props.tableOfContentsPath}
          myCoursesPath={props.myCoursesPath ?? "/my_courses"}
        />
        <Container style={styles.pageContent}>
          {props.children}

          {props.progressError ? <P style={styles.progressError}>{props.progressError}</P> : null}

          {props.onNextPage && props.nextPageTitle && (
            <NextPage
              style={{ marginTop: 16 }}
              onNextPage={props.onNextPage}
              nextPageTitle={props.nextPageTitle}
            />
          )}
          {props.onComplete ? (
            <PrimaryButton
              fill
              onPress={props.onComplete}
              disabled={props.completionPending}
              style={styles.completeButton}
            >
              {props.completionPending ? "שומר התקדמות..." : props.completionLabel ?? "סיום השיעור"}
            </PrimaryButton>
          ) : null}
        </Container>
      </ScrollView>
    </Body>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    marginBottom: 32,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  pageContent: {
    flex: 1,
    marginTop: 0,
    width: "100%",
    maxWidth: 840,
    alignSelf: "center",
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  header: {
    minHeight: 240,
  },
  progressError: {
    marginTop: 16,
    color: "#FB7185",
    textAlign: "right",
  },
  completeButton: {
    marginTop: 24,
  },
});
