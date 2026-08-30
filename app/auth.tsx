import { useEffect, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useNavigation } from "expo-router";
import Body from "@/components/UI/Body";
import Container from "@/components/UI/Container";
import CustomTextInput from "@/components/UI/input/CustomTextInput";
import PrimaryButton from "@/components/UI/buttons/PrimaryButton";
import { H1, P, SecondaryText } from "@/components/UI/typography/Typography";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/context/AuthContext";
import { ApiRequestError } from "@/services/api/client";

export default function AuthScreen() {
  const navigation = useNavigation();
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => navigation.setOptions({ headerShown: false }), [navigation]);

  const submit = async () => {
    if (!email.trim() || password.length < 8 || (mode === "register" && !displayName.trim())) {
      setError("יש למלא את כל השדות. הסיסמה חייבת להכיל לפחות 8 תווים.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      if (mode === "register") {
        await register({ email, password, displayName });
      } else {
        await login({ email, password });
      }
    } catch (reason) {
      if (reason instanceof ApiRequestError && reason.code === "EMAIL_ALREADY_REGISTERED") {
        setError("כבר קיים חשבון עם כתובת האימייל הזו.");
      } else if (reason instanceof ApiRequestError && reason.status === 401) {
        setError("כתובת האימייל או הסיסמה אינם נכונים.");
      } else {
        setError("לא הצלחנו להתחבר לשרת. נסו שוב בעוד רגע.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const switchMode = () => {
    setMode((current) => current === "login" ? "register" : "login");
    setError(null);
  };

  return (
    <Body>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <Container style={styles.container}>
            <View style={styles.heading}>
              <H1 style={styles.centered}>{mode === "login" ? "טוב לראות אותך" : "יצירת חשבון"}</H1>
              <SecondaryText style={styles.centered}>
                {mode === "login" ? "התחברו כדי להמשיך בדיוק מהמקום שבו עצרתם" : "שמרו קורסים, תשובות והתקדמות בכל המכשירים"}
              </SecondaryText>
            </View>

            <View style={styles.form}>
              {mode === "register" && (
                <CustomTextInput
                  accessibilityLabel="שם תצוגה"
                  placeholder="שם תצוגה"
                  placeholderTextColor="#9BA1A6"
                  value={displayName}
                  onChangeText={setDisplayName}
                  autoComplete="name"
                  textContentType="name"
                  style={styles.rtlInput}
                />
              )}
              <CustomTextInput
                accessibilityLabel="אימייל"
                placeholder="name@example.com"
                placeholderTextColor="#9BA1A6"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                autoComplete="email"
                textContentType="emailAddress"
                style={styles.ltrInput}
              />
              <CustomTextInput
                accessibilityLabel="סיסמה"
                placeholder="סיסמה (לפחות 8 תווים)"
                placeholderTextColor="#9BA1A6"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                textContentType={mode === "login" ? "password" : "newPassword"}
                style={styles.ltrInput}
                onSubmitEditing={submit}
              />
              {error && <P accessibilityRole="alert" style={styles.error}>{error}</P>}
              <PrimaryButton fill onPress={submit} disabled={submitting}>
                {submitting ? <ActivityIndicator color="#071A1D" /> : mode === "login" ? "התחברות" : "הרשמה"}
              </PrimaryButton>
            </View>

            <Pressable
              onPress={switchMode}
              accessibilityRole="button"
              hitSlop={8}
              style={styles.switchButton}
            >
              <P style={styles.switchText}>
                {mode === "login" ? "אין לכם חשבון? הירשמו" : "כבר יש לכם חשבון? התחברו"}
              </P>
            </Pressable>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>
    </Body>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: "center", paddingVertical: 32 },
  container: { width: "100%", maxWidth: 480, alignSelf: "center", paddingHorizontal: 20, gap: 32 },
  heading: { gap: 10 },
  centered: { textAlign: "center" },
  form: { gap: 16 },
  rtlInput: { minHeight: 52, paddingHorizontal: 14, textAlign: "right", writingDirection: "rtl" },
  ltrInput: { minHeight: 52, paddingHorizontal: 14, textAlign: "left", writingDirection: "ltr" },
  error: { color: "#FF8A8A", fontSize: 15, lineHeight: 22, textAlign: "right" },
  switchButton: { minHeight: 44, justifyContent: "center" },
  switchText: { color: Colors.dark.primary, textAlign: "center", fontFamily: "Heebo_700Bold" },
});
