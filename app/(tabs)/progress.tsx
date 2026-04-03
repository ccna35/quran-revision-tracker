import { StyleSheet, Text, View } from "react-native";

import { Screen } from "@/components/common/Screen";
import { ProgressSummary } from "@/components/dashboard/ProgressSummary";
import { useSurahStore } from "@/store/use-surah-store";
import { useAppTheme } from "@/theme/provider";
import { sortSurahs } from "@/utils/surah-sort";
import {
  getProgressSummary,
  getSurahComputedState,
} from "@/utils/surah-status";

export default function ProgressScreen() {
  const theme = useAppTheme();
  const trackedSurahs = useSurahStore((state) => state.trackedSurahs);
  const summary = getProgressSummary(trackedSurahs);
  const urgentSurahs = sortSurahs(trackedSurahs, "days-desc").slice(0, 3);

  return (
    <Screen>
      <Text style={[styles.title, { color: theme.colors.text }]}>Progress</Text>
      <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
        Progress now measures Rub' completion across all tracked Surahs, so you
        can build momentum even when a full Surah spans multiple sittings.
      </Text>

      <ProgressSummary summary={summary} />

      <View style={[styles.panel, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.panelTitle, { color: theme.colors.text }]}>
          Most urgent next
        </Text>
        {urgentSurahs.length === 0 ? (
          <Text style={[styles.panelBody, { color: theme.colors.textMuted }]}>
            Add Surahs on the dashboard to start building your revision rhythm.
          </Text>
        ) : (
          urgentSurahs.map((surah) => {
            const computed = getSurahComputedState(surah);

            return (
              <View
                key={surah.id}
                style={[
                  styles.listItem,
                  { borderBottomColor: theme.colors.border },
                ]}
              >
                <View>
                  <Text
                    style={[styles.itemTitle, { color: theme.colors.text }]}
                  >
                    {surah.name}
                  </Text>
                  <Text
                    style={[styles.itemMeta, { color: theme.colors.textMuted }]}
                  >
                    {computed.lastRevisedLabel} · {computed.progressPercentage}%
                    complete
                  </Text>
                </View>
                <Text
                  style={[styles.itemBadge, { color: theme.colors.primary }]}
                >
                  {computed.statusLabel}
                </Text>
              </View>
            );
          })
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 38,
    fontWeight: "700",
    letterSpacing: -2,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  panel: {
    borderRadius: 28,
    marginTop: 24,
    padding: 22,
  },
  panelTitle: {
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: -1,
    marginBottom: 16,
  },
  panelBody: {
    fontSize: 15,
    lineHeight: 22,
  },
  listItem: {
    alignItems: "center",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 14,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  itemMeta: {
    fontSize: 13,
  },
  itemBadge: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
});
