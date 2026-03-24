import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { getArabicSurahNameByNormalizedName } from "@/constants/surah-arabic-catalog";
import { useAppTheme } from "@/theme/provider";
import type { TrackedSurah } from "@/types/surah";
import { getSurahComputedState } from "@/utils/surah-status";

interface SurahCardProps {
  onMarkRevised: (surah: TrackedSurah) => void;
  onOpenStats: (surah: TrackedSurah) => void;
  surah: TrackedSurah;
}

export function SurahCard({
  onMarkRevised,
  onOpenStats,
  surah,
}: SurahCardProps) {
  const theme = useAppTheme();
  const computed = getSurahComputedState(surah);
  const arabicName = getArabicSurahNameByNormalizedName(surah.normalizedName);

  const toneColors = {
    critical: {
      backgroundColor: theme.colors.criticalSoft,
      color: theme.colors.critical,
    },
    fresh: {
      backgroundColor: theme.colors.primarySoft,
      color: theme.colors.primary,
    },
    neutral: {
      backgroundColor: theme.colors.neutralSoft,
      color: theme.colors.neutral,
    },
    steady: {
      backgroundColor: theme.colors.steadySoft,
      color: theme.colors.steady,
    },
    urgent: {
      backgroundColor: theme.colors.urgentSoft,
      color: theme.colors.urgent,
    },
    watch: {
      backgroundColor: theme.colors.watchSoft,
      color: theme.colors.watch,
    },
  }[computed.statusTone];

  return (
    <Pressable
      onPress={() => onOpenStats(surah)}
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.card,
          shadowColor: theme.colors.shadow,
        },
      ]}
    >
      <View style={styles.row}>
        <View style={styles.titleBlock}>
          <Text style={[styles.name, { color: theme.colors.text }]}>
            {surah.name}
          </Text>
          {arabicName ? (
            <Text
              style={[styles.arabicName, { color: theme.colors.textMuted }]}
            >
              {arabicName}
            </Text>
          ) : null}
        </View>
        <View
          style={[
            styles.badge,
            { backgroundColor: toneColors.backgroundColor },
          ]}
        >
          <Text style={[styles.badgeLabel, { color: toneColors.color }]}>
            {computed.statusLabel}
          </Text>
        </View>
      </View>
      <View style={styles.metaRow}>
        <Ionicons
          color={theme.colors.textMuted}
          name="calendar-outline"
          size={16}
        />
        <Text style={[styles.metaText, { color: theme.colors.textMuted }]}>
          {computed.lastRevisedLabel}
        </Text>
      </View>
      <Pressable
        onPress={(event) => {
          event.stopPropagation();
          onMarkRevised(surah);
        }}
        style={({ pressed }) => [
          styles.resolveButton,
          {
            borderColor: theme.colors.border,
            backgroundColor: pressed ? theme.colors.primarySoft : "transparent",
          },
        ]}
      >
        <Ionicons
          color={theme.colors.primary}
          name="checkmark-circle"
          size={18}
        />
        <Text style={[styles.resolveLabel, { color: theme.colors.primary }]}>
          Mark as Revised
        </Text>
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    gap: 14,
    padding: 16,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.06,
    shadowRadius: 40,
  },
  row: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  titleBlock: {
    flex: 1,
    paddingRight: 12,
  },
  name: {
    fontSize: 19,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  arabicName: {
    fontSize: 15,
    marginTop: 3,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  metaRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  metaText: {
    fontSize: 14,
  },
  resolveButton: {
    alignItems: "center",
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    minHeight: 44,
    paddingHorizontal: 16,
  },
  resolveLabel: {
    fontSize: 14,
    fontWeight: "700",
  },
});
