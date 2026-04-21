import { StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "@/theme/provider";
import type { ProgressSummary as ProgressSummaryData } from "@/types/surah";

interface ProgressSummaryProps {
  summary: ProgressSummaryData;
}

export function ProgressSummary({ summary }: ProgressSummaryProps) {
  const theme = useAppTheme();

  return (
    <View style={styles.root}>
      <View style={[styles.heroCard, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.eyebrow, { color: theme.colors.primary }]}>
          نسبة إنجاز الأرباع
        </Text>
        <Text style={[styles.heroValue, { color: theme.colors.text }]}>
          {summary.progressPercentage}%
        </Text>
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
                width: `${Math.max(summary.progressPercentage, summary.totalRubCount ? 8 : 0)}%`,
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: 14,
  },
  heroCard: {
    borderRadius: 16,
    padding: 24,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  heroValue: {
    fontSize: 52,
    fontWeight: "700",
    letterSpacing: -3,
    marginBottom: 18,
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
