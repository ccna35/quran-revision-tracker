import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { getArabicSurahNameByNormalizedName } from "@/constants/surah-arabic-catalog";
import { useAppTheme } from "@/theme/provider";
import type { TrackedSurah } from "@/types/surah";
import { getSurahComputedState } from "@/utils/surah-status";

interface SurahCardProps {
  onPress: (surah: TrackedSurah) => void;
  surah: TrackedSurah;
}

export function SurahCard({ onPress, surah }: SurahCardProps) {
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
      onPress={() => onPress(surah)}
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

      <View style={styles.progressBlock}>
        <View style={styles.progressHeader}>
          <Text
            style={[styles.progressLabel, { color: theme.colors.textMuted }]}
          >
            Rub' progress
          </Text>
          <Text style={[styles.progressValue, { color: theme.colors.text }]}>
            {computed.progressPercentage}%
          </Text>
        </View>
        <View
          style={[
            styles.progressTrack,
            { backgroundColor: theme.colors.cardMuted },
          ]}
        >
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: theme.colors.primary,
                width: `${Math.max(
                  computed.progressPercentage,
                  computed.totalRubCount > 0 ? 8 : 0,
                )}%`,
              },
            ]}
          />
        </View>
      </View>
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
  progressBlock: {
    gap: 8,
  },
  progressHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  progressValue: {
    fontSize: 14,
    fontWeight: "700",
  },
  progressTrack: {
    borderRadius: 999,
    height: 8,
    overflow: "hidden",
  },
  progressFill: {
    borderRadius: 999,
    height: "100%",
  },
});
