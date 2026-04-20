import { Ionicons } from "@expo/vector-icons";
import { format, isToday, isYesterday, parseISO } from "date-fns";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { Button } from "@/components/common/Button";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Screen } from "@/components/common/Screen";
import { getArabicSurahNameByNormalizedName } from "@/constants/surah-arabic-catalog";
import { useSurahStore } from "@/store/use-surah-store";
import { useAppTheme } from "@/theme/provider";
import {
  getLongestRubRevisionGapDays,
  getSurahRubStates,
} from "@/utils/surah-rub";
import {
  getRevisionTimingState,
  getSurahComputedState,
} from "@/utils/surah-status";

function formatAyahRangeLabel(startAyah: number, endAyah: number) {
  if (startAyah === endAyah) {
    return `آية ${startAyah}`;
  }

  return `الآيات ${startAyah}-${endAyah}`;
}

function formatRubLastRevised(value: string | null) {
  if (!value) {
    return "لم تتم المراجعة";
  }

  const parsed = parseISO(value);

  if (isToday(parsed)) {
    return "اليوم";
  }

  if (isYesterday(parsed)) {
    return "أمس";
  }

  return format(parsed, "MMM d, yyyy");
}

export default function SurahRubScreen() {
  const theme = useAppTheme();
  const { surahId } = useLocalSearchParams<{ surahId: string }>();
  const trackedSurahs = useSurahStore((state) => state.trackedSurahs);
  const markRubAsRevised = useSurahStore((state) => state.markRubAsRevised);
  const markEntireSurahAsRevised = useSurahStore(
    (state) => state.markEntireSurahAsRevised,
  );
  const surah = trackedSurahs.find((item) => item.id === surahId);
  const [confirmRubId, setConfirmRubId] = useState<string | null>(null);
  const [statsRubId, setStatsRubId] = useState<string | null>(null);
  const [confirmEntireSurah, setConfirmEntireSurah] = useState(false);

  if (!surah) {
    return (
      <Screen>
        <View style={styles.emptyState}>
          <Text style={[styles.emptyTitle, { color: theme.colors.text }]}>
            السورة غير موجودة
          </Text>
          <Text style={[styles.emptyBody, { color: theme.colors.textMuted }]}>
            هذه السورة لم تعد موجودة في قائمة المتابعة.
          </Text>
          <Button label="العودة للرئيسية" onPress={() => router.back()} />
        </View>
      </Screen>
    );
  }

  const computed = getSurahComputedState(surah);
  const rubStates = getSurahRubStates(surah);
  const selectedRub = rubStates.find((rub) => rub.id === confirmRubId) ?? null;
  const statsRub = rubStates.find((rub) => rub.id === statsRubId) ?? null;
  const arabicName = getArabicSurahNameByNormalizedName(surah.normalizedName);

  return (
    <Screen>
      <View style={styles.headerRow}>
        <Pressable
          onPress={() => router.back()}
          style={[styles.iconButton, { backgroundColor: theme.colors.card }]}
        >
          <Ionicons color={theme.colors.text} name="arrow-back" size={20} />
        </Pressable>
        <Pressable
          onPress={() => router.push("/(tabs)/settings")}
          style={[styles.iconButton, { backgroundColor: theme.colors.card }]}
        >
          <Ionicons
            color={theme.colors.text}
            name="settings-outline"
            size={20}
          />
        </Pressable>
      </View>

      <View style={styles.heroCopy}>
        <Text style={[styles.eyebrow, { color: theme.colors.primary }]}>
          {arabicName ?? "سورة"}
        </Text>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {arabicName ?? "سورة"}
        </Text>
        <Text style={[styles.body, { color: theme.colors.textMuted }]}>
          اختر الربع الذي راجعته في هذه الجلسة، أو علّم السورة كاملة إذا أنهيتها
          دفعة واحدة.
        </Text>
      </View>

      <View
        style={[styles.summaryCard, { backgroundColor: theme.colors.card }]}
      >
        <View style={styles.summaryRow}>
          <Text
            style={[styles.summaryLabel, { color: theme.colors.textMuted }]}
          >
            نسبة إنجاز الأرباع
          </Text>
          <Text style={[styles.summaryValue, { color: theme.colors.text }]}>
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
        <Text style={[styles.summaryMeta, { color: theme.colors.textMuted }]}>
          تمت مراجعة {computed.revisedRubCount} من أصل {computed.totalRubCount}
          أرباع
        </Text>
      </View>

      <Button
        iconName="checkmark-circle-outline"
        label="تعليم السورة كاملة"
        onPress={() => setConfirmEntireSurah(true)}
      />

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
          قائمة الأرباع
        </Text>
        <Text style={[styles.sectionMeta, { color: theme.colors.textMuted }]}>
          الإجمالي: {rubStates.length}
        </Text>
      </View>

      <View style={styles.cardList}>
        {rubStates.map((rub) => {
          const timing = getRevisionTimingState(rub.lastRevisedAt);
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
          }[timing.statusTone];

          return (
            <Pressable
              key={rub.id}
              onPress={() => setStatsRubId(rub.id)}
              style={[styles.rubCard, { backgroundColor: theme.colors.card }]}
            >
              <View style={styles.rubHeader}>
                <View style={styles.rubTitleBlock}>
                  <Text style={[styles.rubTitle, { color: theme.colors.text }]}>
                    الربع {rub.localRubNumber}
                  </Text>
                  <Text
                    style={[
                      styles.rubSnippet,
                      { color: theme.colors.textMuted },
                    ]}
                  >
                    {rub.snippet}
                  </Text>
                </View>
                <View
                  style={[
                    styles.rubBadge,
                    { backgroundColor: toneColors.backgroundColor },
                  ]}
                >
                  <Text
                    style={[styles.rubBadgeLabel, { color: toneColors.color }]}
                  >
                    {timing.statusLabel}
                  </Text>
                </View>
              </View>

              <View style={styles.rubMetaRow}>
                <Text
                  style={[
                    styles.rubMetaText,
                    { color: theme.colors.textMuted },
                  ]}
                >
                  {formatAyahRangeLabel(rub.startAyah, rub.endAyah)}
                </Text>
                <View style={styles.rubActionsRow}>
                  <Pressable
                    onPress={(event) => {
                      event.stopPropagation();
                      setStatsRubId(rub.id);
                    }}
                    style={[
                      styles.rubActionButton,
                      { backgroundColor: theme.colors.cardElevated },
                    ]}
                  >
                    <Ionicons
                      color={theme.colors.textMuted}
                      name="information-circle-outline"
                      size={18}
                    />
                  </Pressable>
                  <Pressable
                    onPress={(event) => {
                      event.stopPropagation();
                      setConfirmRubId(rub.id);
                    }}
                    style={[
                      styles.rubActionButton,
                      { backgroundColor: theme.colors.primarySoft },
                    ]}
                  >
                    <Ionicons
                      color={theme.colors.primary}
                      name="checkmark-circle-outline"
                      size={18}
                    />
                  </Pressable>
                </View>
              </View>
              <Text
                style={[
                  styles.rubLastRevised,
                  { color: theme.colors.textMuted },
                ]}
              >
                آخر مراجعة: {formatRubLastRevised(rub.lastRevisedAt)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Modal animationType="fade" transparent visible={statsRub !== null}>
        <View style={styles.overlay}>
          <Pressable
            onPress={() => setStatsRubId(null)}
            style={[styles.backdrop, { backgroundColor: theme.colors.overlay }]}
          />
          {statsRub ? (
            <View
              style={[
                styles.statsModalCard,
                {
                  backgroundColor: theme.colors.card,
                  shadowColor: theme.colors.shadow,
                },
              ]}
            >
              <View style={styles.statsModalHeader}>
                <Text
                  style={[styles.statsModalTitle, { color: theme.colors.text }]}
                >
                  الربع {statsRub.localRubNumber}
                </Text>
                <Pressable
                  onPress={() => setStatsRubId(null)}
                  style={[
                    styles.statsCloseButton,
                    { backgroundColor: theme.colors.cardElevated },
                  ]}
                >
                  <Text
                    style={[
                      styles.statsCloseLabel,
                      { color: theme.colors.textMuted },
                    ]}
                  >
                    إغلاق
                  </Text>
                </Pressable>
              </View>
              <Text
                style={[styles.statsSnippet, { color: theme.colors.textMuted }]}
              >
                {statsRub.snippet}
              </Text>

              <View style={styles.statsGrid}>
                <View
                  style={[
                    styles.statItem,
                    { backgroundColor: theme.colors.cardElevated },
                  ]}
                >
                  <Text
                    style={[
                      styles.statLabel,
                      { color: theme.colors.textMuted },
                    ]}
                  >
                    آخر مراجعة
                  </Text>
                  <Text
                    style={[styles.statValue, { color: theme.colors.text }]}
                  >
                    {formatRubLastRevised(statsRub.lastRevisedAt)}
                  </Text>
                </View>

                <View
                  style={[
                    styles.statItem,
                    { backgroundColor: theme.colors.cardElevated },
                  ]}
                >
                  <Text
                    style={[
                      styles.statLabel,
                      { color: theme.colors.textMuted },
                    ]}
                  >
                    عدد المراجعات
                  </Text>
                  <Text
                    style={[styles.statValue, { color: theme.colors.text }]}
                  >
                    {statsRub.revisionEvents.length}
                  </Text>
                </View>

                <View
                  style={[
                    styles.statItem,
                    { backgroundColor: theme.colors.cardElevated },
                  ]}
                >
                  <Text
                    style={[
                      styles.statLabel,
                      { color: theme.colors.textMuted },
                    ]}
                  >
                    أطول انقطاع
                  </Text>
                  <Text
                    style={[styles.statValue, { color: theme.colors.text }]}
                  >
                    {getLongestRubRevisionGapDays(statsRub.revisionEvents) ===
                    null
                      ? "يحتاج مراجعتين على الأقل"
                      : `${getLongestRubRevisionGapDays(statsRub.revisionEvents)} يوم`}
                  </Text>
                </View>
              </View>
            </View>
          ) : null}
        </View>
      </Modal>

      <ConfirmDialog
        confirmLabel="تأكيد"
        message={
          selectedRub
            ? `هل تريد تعليم الربع ${selectedRub.localRubNumber} كمُراجع في ${arabicName ?? "هذه السورة"}؟`
            : ""
        }
        onCancel={() => setConfirmRubId(null)}
        onConfirm={() => {
          if (selectedRub) {
            markRubAsRevised(surah.id, selectedRub.id);
          }

          setConfirmRubId(null);
        }}
        title="تأكيد مراجعة الربع"
        visible={confirmRubId !== null}
      />

      <ConfirmDialog
        confirmLabel="تعليم السورة كاملة"
        message={`هل تريد تعليم جميع أرباع ${arabicName ?? "هذه السورة"} كمراجعة في هذه الجلسة؟`}
        onCancel={() => setConfirmEntireSurah(false)}
        onConfirm={() => {
          markEntireSurahAsRevised(surah.id);
          setConfirmEntireSurah(false);
        }}
        title="تأكيد المراجعة الكاملة"
        visible={confirmEntireSurah}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 22,
  },
  iconButton: {
    alignItems: "center",
    borderRadius: 999,
    height: 46,
    justifyContent: "center",
    width: 46,
  },
  heroCopy: {
    marginBottom: 24,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 34,
    fontWeight: "700",
    letterSpacing: -1.8,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 10,
  },
  summaryCard: {
    borderRadius: 22,
    gap: 12,
    marginBottom: 18,
    padding: 18,
  },
  summaryRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "700",
  },
  summaryMeta: {
    fontSize: 14,
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
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
    marginTop: 28,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: -0.9,
  },
  sectionMeta: {
    fontSize: 13,
    fontWeight: "600",
  },
  cardList: {
    gap: 14,
  },
  rubCard: {
    borderRadius: 20,
    gap: 14,
    padding: 16,
  },
  rubHeader: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rubTitleBlock: {
    flex: 1,
    paddingRight: 12,
  },
  rubTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  rubSnippet: {
    fontSize: 15,
    lineHeight: 22,
  },
  rubBadge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  rubBadgeLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.7,
    textTransform: "uppercase",
  },
  rubMetaRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rubActionsRow: {
    flexDirection: "row",
    gap: 8,
  },
  rubActionButton: {
    alignItems: "center",
    borderRadius: 999,
    height: 34,
    justifyContent: "center",
    width: 34,
  },
  rubMetaText: {
    fontSize: 14,
  },
  rubLastRevised: {
    fontSize: 13,
  },
  overlay: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  statsModalCard: {
    borderRadius: 20,
    padding: 16,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    width: "100%",
  },
  statsModalHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  statsModalTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  statsCloseButton: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  statsCloseLabel: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  statsSnippet: {
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 12,
  },
  statsGrid: {
    gap: 8,
  },
  statItem: {
    borderRadius: 12,
    gap: 3,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  statValue: {
    fontSize: 14,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
  },
  emptyBody: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
    textAlign: "center",
  },
});
