import { StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "@/theme/provider";
import type { DailyRevisionCount } from "@/utils/surah-stats";

interface RevisionBarChartProps {
  data: DailyRevisionCount[];
}

export function RevisionBarChart({ data }: RevisionBarChartProps) {
  const theme = useAppTheme();

  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <View style={styles.container}>
      <View style={styles.barsRow}>
        {data.map((item, index) => {
          const heightPercent = item.count / maxCount;
          const isToday = index === data.length - 1;

          return (
            <View key={item.label + index} style={styles.barColumn}>
              <Text
                style={[styles.countLabel, { color: theme.colors.textMuted }]}
              >
                {item.count > 0 ? item.count : ""}
              </Text>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    {
                      height: `${Math.max(heightPercent * 100, item.count > 0 ? 8 : 0)}%`,
                      backgroundColor: isToday
                        ? theme.colors.primary
                        : theme.colors.primarySoft,
                    },
                  ]}
                />
              </View>
              <Text
                style={[
                  styles.dayLabel,
                  {
                    color: isToday
                      ? theme.colors.primary
                      : theme.colors.textMuted,
                    fontWeight: isToday ? "700" : "400",
                  },
                ]}
              >
                {item.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
  },
  barsRow: {
    alignItems: "flex-end",
    flexDirection: "row",
    gap: 6,
    height: 120,
    justifyContent: "space-between",
  },
  barColumn: {
    alignItems: "center",
    flex: 1,
    height: "100%",
    justifyContent: "flex-end",
  },
  countLabel: {
    fontSize: 11,
    marginBottom: 4,
  },
  barTrack: {
    borderRadius: 6,
    flex: 1,
    justifyContent: "flex-end",
    overflow: "hidden",
    width: "100%",
  },
  barFill: {
    borderRadius: 6,
    width: "100%",
  },
  dayLabel: {
    fontSize: 11,
    marginTop: 6,
  },
});
