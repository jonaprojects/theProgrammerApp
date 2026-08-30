import Constants from "expo-constants";
import React, { Component, type ErrorInfo, type PropsWithChildren } from "react";
import { Platform, Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { api, createIdempotencyKey } from "@/services/api/client";

interface State {
  failed: boolean;
  eventId: string | null;
}

export default class AppErrorBoundary extends Component<PropsWithChildren, State> {
  state: State = { failed: false, eventId: null };

  static getDerivedStateFromError(): State {
    return { failed: true, eventId: null };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    const clientEventId = createIdempotencyKey();
    this.setState({ eventId: clientEventId });
    void api.reportClientError({
      message: error.message || "Unknown React rendering error",
      ...(error.stack ? { stack: error.stack } : {}),
      ...(info.componentStack ? { componentStack: info.componentStack } : {}),
      route: "react-render-tree",
      platform: Platform.OS === "android" || Platform.OS === "ios" || Platform.OS === "web"
        ? Platform.OS
        : "unknown",
      appVersion: Constants.expoConfig?.version ?? "development",
      clientEventId,
    }).catch(() => undefined);
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.card}>
          <Text accessibilityRole="header" style={styles.title}>משהו השתבש</Text>
          <Text accessibilityRole="alert" style={styles.description}>התקלה דווחה בלי לשלוח סיסמאות או מידע שהזנתם.</Text>
          {this.state.eventId ? <Text style={styles.reference}>מספר פנייה: {this.state.eventId}</Text> : null}
          <Pressable
            accessibilityRole="button"
            onPress={() => this.setState({ failed: false, eventId: null })}
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          >
            <Text style={styles.buttonText}>ניסיון נוסף</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#222831", justifyContent: "center", padding: 20 },
  card: { width: "100%", maxWidth: 480, alignSelf: "center", padding: 24, borderRadius: 14, backgroundColor: "#1B2129", gap: 14 },
  title: { color: "#FFFFFF", fontFamily: "Heebo_700Bold", fontSize: 28, textAlign: "right", writingDirection: "rtl" },
  description: { color: "#DADADA", fontFamily: "Heebo_400Regular", fontSize: 16, lineHeight: 24, textAlign: "right", writingDirection: "rtl" },
  reference: { color: "#9BA1A6", fontFamily: "Inter_400Regular", fontSize: 11, textAlign: "left" },
  button: { minHeight: 52, borderRadius: 8, backgroundColor: "#00ADB5", alignItems: "center", justifyContent: "center", marginTop: 6 },
  buttonPressed: { opacity: 0.75 },
  buttonText: { color: "#071A1D", fontFamily: "Heebo_700Bold", fontSize: 18 },
});
