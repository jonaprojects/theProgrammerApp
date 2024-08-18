import React from "react";
import { View, StyleSheet } from "react-native";
import Body from "@/components/UI/Body";
import { Image } from "expo-image";
import PrimaryButton from "@/components/UI/buttons/PrimaryButton";
import Container from "@/components/UI/Container";
import { H1, SecondaryText } from "@/components/UI/typography/Typography";
import Progress from "@/components/UI/page_progress/Progress";
export default function NewQuestions() {
  return (
    <Body>
      <Container style={styles.container}>
        <View style={styles.progressContainer}>
          <Progress numOfSteps={3} currentStep={1} />
        </View>
        <View style={styles.contentContainer}>
          <View style={styles.illustrationContainer}>
            <Image
              style={styles.illustration}
              source={require("@/assets/images/illustrations/spaceIllustration.png")}
              // placeholder={{ blurhash }}
              contentFit="cover"
              transition={500}
            />
          </View>
          <View style={styles.bottomContainer}>
            <View style={styles.textContainer}>
              <H1 style={{ textAlign: "center" }}>מאות שאלות חדשות!</H1>
              <SecondaryText style={{ textAlign: "center" }}>
                למדו תכנות עם מאות שאלות בנושאים שונים כגון פיתוח אתרים, תכנות
                מונחה עצמים, סייבר, תקשורת ועוד...
              </SecondaryText>
            </View>

            <PrimaryButton>המשך</PrimaryButton>
          </View>
        </View>
      </Container>
    </Body>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
  },
  contentContainer: {
    gap: 48,
  },
  bottomContainer: {
    justifyContent: "space-between",
    gap: 48,
  },
  textContainer: {
    gap: 16,
  },
  illustrationContainer: {
    width: "100%",
    height: 350,
  },
  illustration: {
    flex: 1,
    width: "100%",
  },
  progressContainer: {
    position: "absolute",
    top: 48,
    left: 16,
    right: 16,
  },
});
