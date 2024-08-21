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
import NextPage from "@/assets/tutorials/NextPage";

type TutorialTemplateProps = PropsWithChildren<{
  headerBackgroundImg: number;
  headerTitle: string;
  onNextPage: () => void;
  nextPageTitle: string;
  style?: StyleProp<ViewStyle>;
}>;
export default function TutorialTemplate(props: TutorialTemplateProps) {
  return (
    <Body>
      <Navbar />

      <TutorialHeader
        backgroundImg={props.headerBackgroundImg}
        title={props.headerTitle}
        style={styles.header}
      />
      <Container style={styles.pageContent}>
        <ScrollView style={{ flex: 1 }}>
          {props.children}

          <NextPage
            style={{ marginTop: 32 }}
            onNextPage={props.onNextPage}
            nextPageTitle={props.nextPageTitle}
          />
        </ScrollView>
      </Container>
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
