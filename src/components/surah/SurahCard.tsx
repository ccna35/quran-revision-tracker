import { Ionicons } from "@expo/vector-icons";
import { format, isToday, isYesterday, parseISO } from "date-fns";
import { ar } from "date-fns/locale";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { getArabicSurahNameByNormalizedName } from "@/constants/surah-arabic-catalog";
import { useAppTheme } from "@/theme/provider";
import type { TrackedSurah } from "@/types/surah";
import { getOldestSurahRevisionAt } from "@/utils/surah-rub";
import {
  getRevisionTimingState,
  getSurahComputedState,
} from "@/utils/surah-status";

interface SurahCardProps {
  onPress: (surah: TrackedSurah) => void;
  surah: TrackedSurah;
}

export function SurahCard({ onPress, surah }: SurahCardProps) {
  const theme = useAppTheme();
  const computed = getSurahComputedState(surah);
  const arabicName = getArabicSurahNameByNormalizedName(surah.normalizedName);
  const oldestRevisedAt = getOldestSurahRevisionAt(surah);
  const oldestRubTiming = getRevisionTimingState(oldestRevisedAt);

  const oldestRevisedLabel = (() => {
    if (!oldestRevisedAt) {
      return "أقدم مراجعة: غير مراجع";
    }

    const parsed = parseISO(oldestRevisedAt);

    if (isToday(parsed)) {
      return "أقدم مراجعة: اليوم";
    }

    if (isYesterday(parsed)) {
      return "أقدم مراجعة: أمس";
    }

    return `أقدم مراجعة: ${format(parsed, "d MMM yyyy", { locale: ar })}`;
  })();

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
  }[oldestRubTiming.statusTone];

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
            {arabicName ?? "سورة"}
          </Text>
        </View>
        <View
          style={[
            styles.badge,
            { backgroundColor: toneColors.backgroundColor },
          ]}
        >
          <Text style={[styles.badgeLabel, { color: toneColors.color }]}>
            {oldestRubTiming.statusLabel}
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
          {oldestRevisedLabel}
        </Text>
      </View>

      <View style={styles.progressBlock}>
        <View style={styles.progressHeader}>
          <Text
            style={[styles.progressLabel, { color: theme.colors.textMuted }]}
          >
            تقدّم الأرباع
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
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: 0,
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
