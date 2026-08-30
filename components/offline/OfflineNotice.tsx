import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, View } from "react-native";
import { P, SecondaryText } from "@/components/UI/typography/Typography";
import { useProgress } from "@/context/ProgressContext";

export default function OfflineNotice() {
  const { isOffline, pendingChanges } = useProgress();
  if (!isOffline && pendingChanges === 0) return null;
  return (
    <View accessibilityLiveRegion="polite" style={styles.notice}>
      <Ionicons name={isOffline ? "cloud-offline-outline" : "sync-outline"} size={22} color="#FDE68A" />
      <View style={styles.copy}>
        <P style={styles.title}>{isOffline ? "מצב Offline" : "מסנכרנים התקדמות"}</P>
        <SecondaryText style={styles.description}>
          {pendingChanges > 0
            ? `${pendingChanges} ${pendingChanges === 1 ? "שינוי יישמר" : "שינויים יישמרו"} אוטומטית כשהחיבור יחזור.`
            : "אפשר להמשיך לקרוא. הנתונים המוצגים נשמרו במכשיר."}
        </SecondaryText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  notice: {
    width: "100%",
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#8A723B",
    backgroundColor: "#3A3426",
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 10,
  },
  copy: { flex: 1, alignItems: "flex-end", gap: 2 },
  title: { color: "#FDE68A", fontFamily: "Heebo_700Bold", textAlign: "right" },
  description: { textAlign: "right", fontSize: 14, lineHeight: 20 },
});
