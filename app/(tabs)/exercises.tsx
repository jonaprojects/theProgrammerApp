import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect, router, useRootNavigationState } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "expo-router";
import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";

import Body from "@/components/UI/Body";
import Navbar from "@/components/UI/Navbar";
import TopicProgress from "@/components/UI/topic_progress/TopicProgress";
import { H2, P } from "@/components/UI/typography/Typography";
import { Colors } from "@/constants/Colors";
import { useProgress } from "@/context/ProgressContext";

export default function ExerciseScreen() {
  const [completedOnboarding, setCompletedOnboarding] = useState<string | null>(null);
  const { progress: userProgress, loading, error, refresh } = useProgress();
  const topics = userProgress?.topics ?? [];
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    AsyncStorage.getItem("Completed_Onboarding").then(setCompletedOnboarding);
  }, []);

  useFocusEffect(useCallback(() => { void refresh(); }, [refresh]));

  if (!rootNavigationState?.key) return null;
  if (completedOnboarding === "false") {
    return <Redirect href="/onboarding/new_questions" />;
  }

  return (
    <Body>
      <Navbar />
      {loading && !userProgress ? (
        <View style={styles.centeredState}>
          <ActivityIndicator size="large" color={Colors.dark.primary} />
        </View>
      ) : (
        <FlatList
          data={topics}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.header}>
              <H2 style={styles.heading}>תרגלת כבר היום?</H2>
              {error ? (
                <P style={styles.errorText}>לא הצלחנו לטעון את הנושאים מהשרת.</P>
              ) : null}
            </View>
          }
          ListEmptyComponent={
            <P style={styles.emptyText}>אין כרגע נושאי תרגול זמינים.</P>
          }
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <TopicProgress
              topic={item.topicTitle}
              totalNumOfQuestions={item.questionCount}
              questionsAnswered={item.answeredCount}
              accuracyPercentage={item.accuracyPercentage}
              masteryPercentage={item.masteryPercentage}
              onPress={() => router.navigate(`/exercise?topic=${item.topicSlug}`)}
            />
          )}
          keyExtractor={({ topicId }) => topicId}
        />
      )}
    </Body>
  );
}

const styles = StyleSheet.create({
  listContent: {
    width: "100%",
    maxWidth: 840,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 32,
  },
  header: { gap: 12, marginBottom: 20 },
  heading: { textAlign: "center" },
  separator: { height: 12 },
  centeredState: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { color: "#FB7185", textAlign: "center" },
  emptyText: { textAlign: "center", marginTop: 32 },
});
