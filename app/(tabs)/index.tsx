import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useDeferredValue, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { EmptyState } from "@/components/common/EmptyState";
import { Screen } from "@/components/common/Screen";
import { SearchInput } from "@/components/common/SearchInput";
import { SortSelector } from "@/components/common/SortSelector";
import { ProgressSummary } from "@/components/dashboard/ProgressSummary";
import { SurahCard } from "@/components/surah/SurahCard";
import { SurahStatsModal } from "@/components/surah/SurahStatsModal";
import { useSurahStore } from "@/store/use-surah-store";
import { useAppTheme } from "@/theme/provider";
import type { SortOption, TrackedSurah } from "@/types/surah";
import { filterSurahs } from "@/utils/surah-filter";
import { sortSurahs } from "@/utils/surah-sort";
import { getProgressSummary } from "@/utils/surah-status";

export default function DashboardScreen() {
  const theme = useAppTheme();
  const trackedSurahs = useSurahStore((state) => state.trackedSurahs);
  const markAsRevised = useSurahStore((state) => state.markAsRevised);
  const [query, setQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("days-desc");
  const [selectedSurah, setSelectedSurah] = useState<TrackedSurah | null>(null);
  const [statsSurah, setStatsSurah] = useState<TrackedSurah | null>(null);
  const deferredQuery = useDeferredValue(query);
  const visibleSurahs = sortSurahs(
    filterSurahs(trackedSurahs, deferredQuery),
    sortOption,
  );
  const summary = getProgressSummary(trackedSurahs);

  return (
    <Screen>
      <View style={styles.headerRow}>
        <View style={styles.headerCopy}>
          <Text style={[styles.eyebrow, { color: theme.colors.primary }]}>
            Quran Revision
          </Text>
          <Text style={[styles.heroTitle, { color: theme.colors.text }]}>
            The Sanctuary
          </Text>
          <Text style={[styles.heroBody, { color: theme.colors.textMuted }]}>
            Maintain the light of the Quran in your heart through steady,
            intentional revision.
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
          <View style={styles.sortWrap}>
            <SortSelector onChange={setSortOption} value={sortOption} />
          </View>
          <Pressable
            onPress={() => router.push("/add-surah")}
            style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
          >
            <LinearGradient
              colors={[theme.colors.primary, theme.colors.primaryDim]}
              end={{ x: 1, y: 1 }}
              start={{ x: 0, y: 0 }}
              style={styles.addPill}
            >
              <Ionicons
                color={theme.colors.textOnPrimary}
                name="add"
                size={18}
              />
              <Text
                style={[
                  styles.addPillLabel,
                  { color: theme.colors.textOnPrimary },
                ]}
              >
                Add Surah
              </Text>
            </LinearGradient>
          </Pressable>
        </View>
      </View>

      <View style={styles.listHeader}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          Tracked Surahs
        </Text>
        <Text style={[styles.sectionMeta, { color: theme.colors.textMuted }]}>
          {visibleSurahs.length} shown
        </Text>
      </View>

      {trackedSurahs.length === 0 ? (
        <EmptyState onPrimaryAction={() => router.push("/add-surah")} />
      ) : visibleSurahs.length === 0 ? (
        <View
          style={[styles.noResultsCard, { backgroundColor: theme.colors.card }]}
        >
          <Text style={[styles.noResultsTitle, { color: theme.colors.text }]}>
            No matching Surahs
          </Text>
          <Text
            style={[styles.noResultsBody, { color: theme.colors.textMuted }]}
          >
            Try a shorter or broader search term.
          </Text>
        </View>
      ) : (
        <View style={styles.cardList}>
          {visibleSurahs.map((surah) => (
            <SurahCard
              key={surah.id}
              onMarkRevised={setSelectedSurah}
              onOpenStats={setStatsSurah}
              surah={surah}
            />
          ))}
        </View>
      )}

      <SurahStatsModal
        onClose={() => setStatsSurah(null)}
        surah={statsSurah}
        visible={statsSurah !== null}
      />

      <ConfirmDialog
        confirmLabel="Confirm"
        message="Are you sure you revised this Surah?"
        onCancel={() => setSelectedSurah(null)}
        onConfirm={() => {
          if (selectedSurah) {
            markAsRevised(selectedSurah.id);
          }

          setSelectedSurah(null);
        }}
        title="Confirm Revision"
        visible={selectedSurah !== null}
      />
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
  addPill: {
    alignItems: "center",
    borderRadius: 999,
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  addPillLabel: {
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 0.6,
  },
  listHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    marginTop: 28,
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
