import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/common/Button";
import { useAppTheme } from "@/theme/provider";

interface EmptyStateProps {
  onPrimaryAction: () => void;
}

export function EmptyState({ onPrimaryAction }: EmptyStateProps) {
  const theme = useAppTheme();

  return (
    <View style={styles.root}>
      <View
        style={[
          styles.illustrationShell,
          { backgroundColor: theme.colors.card },
        ]}
      >
        <View
          style={[
            styles.illustrationHalo,
            { backgroundColor: theme.colors.primarySoft },
          ]}
        />
        <Ionicons color={theme.colors.primary} name="book-outline" size={76} />
        <View
          style={[
            styles.addBadge,
            { backgroundColor: theme.colors.primarySoft },
          ]}
        >
          <Ionicons color={theme.colors.primary} name="add" size={22} />
        </View>
      </View>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Start tracking your Quran revision
      </Text>
      <Text style={[styles.body, { color: theme.colors.textMuted }]}>
        Add Surahs you want to revisit and mark them each time you revise.
      </Text>
      <Button
        iconName="add-circle-outline"
        label="Add your first Surah"
        onPress={onPrimaryAction}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    paddingHorizontal: 12,
    paddingTop: 28,
  },
  illustrationShell: {
    alignItems: "center",
    borderRadius: 999,
    height: 180,
    justifyContent: "center",
    marginBottom: 28,
    overflow: "hidden",
    width: 180,
  },
  illustrationHalo: {
    borderRadius: 999,
    height: 220,
    opacity: 0.35,
    position: "absolute",
    width: 220,
  },
  addBadge: {
    alignItems: "center",
    borderRadius: 999,
    height: 44,
    justifyContent: "center",
    position: "absolute",
    right: 28,
    top: 28,
    width: 44,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    letterSpacing: -1,
    marginBottom: 10,
    textAlign: "center",
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
    maxWidth: 320,
    textAlign: "center",
  },
});
