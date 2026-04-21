import { StyleSheet, Text, View } from "react-native";

import { Screen } from "@/components/common/Screen";
import { ProgressSummary } from "@/components/dashboard/ProgressSummary";
import { RevisionBarChart } from "@/components/dashboard/RevisionBarChart";
import { getArabicSurahNameByNormalizedName } from "@/constants/surah-arabic-catalog";
import { useSurahStore } from "@/store/use-surah-store";
import { useAppTheme } from "@/theme/provider";
import { sortSurahs } from "@/utils/surah-sort";
import { getRevisionsPerDay } from "@/utils/surah-stats";
import {
  getProgressSummary,
  getSurahComputedState,
} from "@/utils/surah-status";

export default function ProgressScreen() {
  const theme = useAppTheme();
  const trackedSurahs = useSurahStore((state) => state.trackedSurahs);
  const summary = getProgressSummary(trackedSurahs);
  const urgentSurahs = sortSurahs(trackedSurahs, "days-desc").slice(0, 3);
  const dailyRevisions = getRevisionsPerDay(trackedSurahs);

  return (
    <Screen>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        الإحصاءات
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
        نعرض الآن التقدم بناءً على إنجاز الأرباع في جميع السور المتابعة، حتى
        تحافظ على الاستمرارية حتى لو كانت السورة تحتاج أكثر من جلسة.
      </Text>

      <ProgressSummary summary={summary} />

      <View style={[styles.panel, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.panelTitle, { color: theme.colors.text }]}>
          المراجعات آخر ٧ أيام
        </Text>
        <RevisionBarChart data={dailyRevisions} />
      </View>

      <View style={[styles.panel, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.panelTitle, { color: theme.colors.text }]}>
          الأهم للمراجعة الآن
        </Text>
        {urgentSurahs.length === 0 ? (
          <Text style={[styles.panelBody, { color: theme.colors.textMuted }]}>
            أضف سورًا من الصفحة الرئيسية لبدء رحلة مراجعة منتظمة.
          </Text>
        ) : (
          urgentSurahs.map((surah) => {
            const computed = getSurahComputedState(surah);
            const arabicName = getArabicSurahNameByNormalizedName(
              surah.normalizedName,
            );

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
                    {arabicName ?? "سورة"}
                  </Text>
                  <Text
                    style={[styles.itemMeta, { color: theme.colors.textMuted }]}
                  >
                    {computed.lastRevisedLabel} · {computed.progressPercentage}%
                    إنجاز
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
