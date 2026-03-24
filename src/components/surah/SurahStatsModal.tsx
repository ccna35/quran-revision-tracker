import { format, parseISO } from "date-fns";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { getArabicSurahNameByNormalizedName } from "@/constants/surah-arabic-catalog";
import { useAppTheme } from "@/theme/provider";
import type { TrackedSurah } from "@/types/surah";
import {
  getAverageRevisionIntervalDays,
  getDaysTracked,
  getLongestRevisionGapDays,
  getRevisionCount,
} from "@/utils/surah-stats";
import { getSurahComputedState } from "@/utils/surah-status";

interface SurahStatsModalProps {
  onClose: () => void;
  surah: TrackedSurah | null;
  visible: boolean;
}

function formatDateLabel(value: string | null) {
  if (!value) {
    return "Never";
  }

  try {
    return format(parseISO(value), "MMM d, yyyy");
  } catch {
    return "Unknown";
  }
}

function formatDaysLabel(value: number | null, fallback: string) {
  if (value === null) {
    return fallback;
  }

  if (value === 0) {
    return "Today";
  }

  return `${value} day${value === 1 ? "" : "s"}`;
}

function formatIntervalLabel(value: number | null) {
  if (value === null) {
    return "Needs 2+ revisions";
  }

  if (Number.isInteger(value)) {
    return `${value} days`;
  }

  return `${value.toFixed(1)} days`;
}

export function SurahStatsModal({
  onClose,
  surah,
  visible,
}: SurahStatsModalProps) {
  const theme = useAppTheme();

  if (!surah) {
    return null;
  }

  const arabicName = getArabicSurahNameByNormalizedName(surah.normalizedName);
  const computed = getSurahComputedState(surah);
  const revisionCount = getRevisionCount(surah);
  const daysTracked = getDaysTracked(surah);
  const averageGap = getAverageRevisionIntervalDays(surah);
  const longestGap = getLongestRevisionGapDays(surah);

  const statsRows = [
    {
      label: "Times revised",
      value: String(revisionCount),
    },
    {
      label: "Last revised",
      value: formatDateLabel(surah.lastRevisedAt),
    },
    {
      label: "Days since last revision",
      value: formatDaysLabel(computed.daysSinceLastRevision, "Never revised"),
    },
    {
      label: "Added on",
      value: formatDateLabel(surah.createdAt),
    },
    {
      label: "Days being tracked",
      value: formatDaysLabel(daysTracked, "Unknown"),
    },
    {
      label: "Current status",
      value: computed.statusLabel,
    },
    {
      label: "Average interval",
      value: formatIntervalLabel(averageGap),
    },
    {
      label: "Longest gap",
      value: longestGap === null ? "Needs 2+ revisions" : `${longestGap} days`,
    },
  ];

  return (
    <Modal animationType="fade" transparent visible={visible}>
      <View style={styles.overlay}>
        <Pressable
          onPress={onClose}
          style={[styles.backdrop, { backgroundColor: theme.colors.overlay }]}
        />
        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.card,
              shadowColor: theme.colors.shadow,
            },
          ]}
        >
          <View style={styles.header}>
            <View>
              <Text
                style={[styles.headerMeta, { color: theme.colors.textMuted }]}
              >
                {arabicName ?? "Surah"}
              </Text>
              <Text style={[styles.title, { color: theme.colors.text }]}>
                {surah.name}
              </Text>
            </View>
            <Pressable
              onPress={onClose}
              style={[
                styles.closeButton,
                { backgroundColor: theme.colors.cardElevated },
              ]}
            >
              <Text
                style={[
                  styles.closeButtonLabel,
                  { color: theme.colors.textMuted },
                ]}
              >
                Close
              </Text>
            </Pressable>
          </View>

          <View style={styles.grid}>
            {statsRows.map((row) => (
              <View
                key={row.label}
                style={[
                  styles.statItem,
                  { backgroundColor: theme.colors.cardElevated },
                ]}
              >
                <Text
                  style={[styles.statLabel, { color: theme.colors.textMuted }]}
                >
                  {row.label}
                </Text>
                <Text style={[styles.statValue, { color: theme.colors.text }]}>
                  {row.value}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  card: {
    borderRadius: 22,
    padding: 18,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.2,
    shadowRadius: 26,
    width: "100%",
  },
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  headerMeta: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    letterSpacing: -1,
  },
  closeButton: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  closeButtonLabel: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  grid: {
    gap: 10,
  },
  statItem: {
    borderRadius: 14,
    gap: 4,
    padding: 12,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.7,
    textTransform: "uppercase",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "600",
  },
});
