import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useDeferredValue, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { EmptyState } from "@/components/common/EmptyState";
import { Screen } from "@/components/common/Screen";
import { SearchInput } from "@/components/common/SearchInput";
import { SortSelector } from "@/components/common/SortSelector";
import { ProgressSummary } from "@/components/dashboard/ProgressSummary";
import { SurahCard } from "@/components/surah/SurahCard";
import { useSurahStore } from "@/store/use-surah-store";
import { useAppTheme } from "@/theme/provider";
import type { SortOption } from "@/types/surah";
import { filterSurahs } from "@/utils/surah-filter";
import { sortSurahs } from "@/utils/surah-sort";
import {
  getProgressSummary,
  getSurahComputedState,
} from "@/utils/surah-status";

type DashboardTab = "revised" | "never";

export default function DashboardScreen() {
  const theme = useAppTheme();
  const trackedSurahs = useSurahStore((state) => state.trackedSurahs);
  const [query, setQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("days-desc");
  const [activeTab, setActiveTab] = useState<DashboardTab>("revised");
  const deferredQuery = useDeferredValue(query);
  const revisedSurahs = trackedSurahs.filter(
    (surah) => !getSurahComputedState(surah).neverRevised,
  );
  const neverRevisedSurahs = trackedSurahs.filter(
    (surah) => getSurahComputedState(surah).neverRevised,
  );
  const activeSource =
    activeTab === "revised" ? revisedSurahs : neverRevisedSurahs;
  const visibleSurahs = sortSurahs(
    filterSurahs(activeSource, deferredQuery),
    sortOption,
  );
  const summary = getProgressSummary(trackedSurahs);

  return (
    <Screen>
      <View style={styles.headerRow}>
        <View style={styles.headerCopy}>
          <Text style={[styles.eyebrow, { color: theme.colors.primary }]}>
            متابعة المراجعة
          </Text>
          <Text style={[styles.heroTitle, { color: theme.colors.text }]}>
            رفيق المراجعة
          </Text>
          <Text style={[styles.heroBody, { color: theme.colors.textMuted }]}>
            ثبّت حفظك للقرآن بالمراجعة المنتظمة، وامشِ بخطة واضحة لكل ربع.
          </Text>
        </View>
        <Pressable
          onPress={() => router.push("/(tabs)/settings")}
          style={[
            styles.settingsButton,
            { backgroundColor: theme.colors.card },
          ]}
        >
          <Ionicons
            color={theme.colors.textMuted}
            name="settings-outline"
            size={20}
          />
        </Pressable>
      </View>

      <ProgressSummary summary={summary} />

      <View style={styles.controls}>
        <SearchInput onChangeText={setQuery} value={query} />
        <View style={styles.controlsRow}>
          <View style={styles.sortWrapFull}>
            <SortSelector onChange={setSortOption} value={sortOption} />
          </View>
        </View>
      </View>

      <View style={styles.listHeader}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          {activeTab === "revised" ? "السور المراجعة" : "السور غير المراجعة"}
        </Text>
        <View style={styles.listHeaderActions}>
          <Text style={[styles.sectionMeta, { color: theme.colors.textMuted }]}>
            المعروض: {visibleSurahs.length}
          </Text>
          <Pressable
            onPress={() => router.push("/add-surah")}
            style={({ pressed }) => [
              styles.addIconButton,
              {
                backgroundColor: theme.colors.primary,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Ionicons color={theme.colors.textOnPrimary} name="add" size={18} />
          </Pressable>
        </View>
      </View>

      {trackedSurahs.length > 0 ? (
        <View
          style={[
            styles.segmentedTabs,
            { backgroundColor: theme.colors.cardElevated },
          ]}
        >
          {[
            { key: "revised", label: "مراجعة", count: revisedSurahs.length },
            {
              key: "never",
              label: "غير مراجعة",
              count: neverRevisedSurahs.length,
            },
          ].map((tab) => {
            const isActive = activeTab === tab.key;

            return (
              <Pressable
                key={tab.key}
                onPress={() => setActiveTab(tab.key as DashboardTab)}
                style={[
                  styles.segmentTab,
                  {
                    backgroundColor: isActive
                      ? theme.colors.card
                      : "transparent",
                  },
                ]}
              >
                <View style={styles.segmentTabContent}>
                  <Text
                    style={[
                      styles.segmentLabel,
                      {
                        color: isActive
                          ? theme.colors.text
                          : theme.colors.textMuted,
                      },
                    ]}
                  >
                    {tab.label}
                  </Text>
                  <Text
                    style={[
                      styles.segmentCount,
                      {
                        color: isActive
                          ? theme.colors.primary
                          : theme.colors.textMuted,
                      },
                    ]}
                  >
                    {tab.count}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      ) : null}

      {trackedSurahs.length === 0 ? (
        <EmptyState onPrimaryAction={() => router.push("/add-surah")} />
      ) : visibleSurahs.length === 0 ? (
        <View
          style={[styles.noResultsCard, { backgroundColor: theme.colors.card }]}
        >
          <Text style={[styles.noResultsTitle, { color: theme.colors.text }]}>
            {deferredQuery
              ? "لا توجد سور مطابقة"
              : activeTab === "revised"
                ? "لا توجد سور مراجعة بعد"
                : "لا توجد سور غير مراجعة"}
          </Text>
          <Text
            style={[styles.noResultsBody, { color: theme.colors.textMuted }]}
          >
            {deferredQuery
              ? "جرّب كلمة بحث أقصر أو أوسع."
              : activeTab === "revised"
                ? "افتح سورة وحدد ربعًا تمت مراجعته لينتقل إلى تبويب المراجعة."
                : "كل سورة مضافة لديها ربع واحد على الأقل تمت مراجعته."}
          </Text>
        </View>
      ) : (
        <View style={styles.cardList}>
          {visibleSurahs.map((surah) => (
            <SurahCard
              key={surah.id}
              onPress={(selectedSurah) =>
                router.push({
                  pathname: "/surah/[surahId]",
                  params: { surahId: selectedSurah.id },
                })
              }
              surah={surah}
            />
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  headerCopy: {
    flex: 1,
    paddingRight: 12,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  heroTitle: {
    fontSize: 42,
    fontWeight: "700",
    letterSpacing: -2.6,
  },
  heroBody: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
  },
  settingsButton: {
    alignItems: "center",
    borderRadius: 999,
    height: 46,
    justifyContent: "center",
    width: 46,
  },
  controls: {
    gap: 14,
    marginTop: 28,
  },
  controlsRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  sortWrap: {
    flex: 1,
  },
  sortWrapFull: {
    flex: 1,
  },
  listHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    marginTop: 28,
  },
  listHeaderActions: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  addIconButton: {
    alignItems: "center",
    borderRadius: 999,
    height: 34,
    justifyContent: "center",
    width: 34,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    letterSpacing: -1,
  },
  sectionMeta: {
    fontSize: 13,
    fontWeight: "600",
  },
  cardList: {
    gap: 16,
  },
  segmentedTabs: {
    borderRadius: 14,
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
    padding: 4,
  },
  segmentTab: {
    borderRadius: 10,
    flex: 1,
    minHeight: 38,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  segmentTabContent: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  segmentLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  segmentCount: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  noResultsCard: {
    borderRadius: 24,
    padding: 20,
  },
  noResultsTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  noResultsBody: {
    fontSize: 15,
    lineHeight: 22,
  },
});
