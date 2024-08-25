import {
  ImageBackground,
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import TutorialHeader from "./TutorialHeader";
import Body from "@/components/UI/Body";
import Navbar from "@/components/UI/Navbar";
import { PropsWithChildren } from "react";
import Container from "@/components/UI/Container";
import NextPage from "@/components/tutorials/NextPage";

type TutorialTemplateProps = PropsWithChildren<{
  headerBackgroundImg: number;
  headerTitle: string;
  onNextPage: () => void;
  nextPageTitle: string;
  tableOfContentsPath: string;
  style?: StyleProp<ViewStyle>;
}>;
export default function TutorialTemplate(props: TutorialTemplateProps) {
  return (
    <Body>
      <Navbar />

      <ScrollView style={{ flex: 1, marginBottom: 32 }}>
        <TutorialHeader
          backgroundImg={props.headerBackgroundImg}
          title={props.headerTitle}
          style={styles.header}
          tableOfContentsPath={props.tableOfContentsPath}
        />
        <Container style={styles.pageContent}>
          {props.children}

          <NextPage
            style={{ marginTop: 16 }}
            onNextPage={props.onNextPage}
            nextPageTitle={props.nextPageTitle}
          />
        </Container>
      </ScrollView>
    </Body>
  );
}

const styles = StyleSheet.create({
  pageContent: {
    flex: 1,
    marginTop: -50,
    paddingLeft: 16,
  },
  header: {},
});
