import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { Button } from "@/components/common/Button";
import { Screen } from "@/components/common/Screen";
import { getArabicSurahNameByNormalizedName } from "@/constants/surah-arabic-catalog";
import { surahCatalog } from "@/constants/surah-catalog";
import { useSurahStore } from "@/store/use-surah-store";
import { useAppTheme } from "@/theme/provider";
import { normalizeSurahName } from "@/utils/normalize-surah-name";

export default function AddSurahScreen() {
  const theme = useAppTheme();
  const trackedSurahs = useSurahStore((state) => state.trackedSurahs);
  const addSurah = useSurahStore((state) => state.addSurah);
  const [queryValue, setQueryValue] = useState("");
  const [inlineError, setInlineError] = useState<string | null>(null);
  const trackedNameSet = useMemo(
    () => new Set(trackedSurahs.map((surah) => surah.normalizedName)),
    [trackedSurahs],
  );
  const catalogNameSet = useMemo(
    () =>
      new Set(surahCatalog.map((surahName) => normalizeSurahName(surahName))),
    [],
  );

  const availableSurahs = useMemo(
    () =>
      surahCatalog.filter(
        (name) => !trackedNameSet.has(normalizeSurahName(name)),
      ),
    [trackedNameSet],
  );

  const curatedMatches = useMemo(() => {
    const normalizedQuery = normalizeSurahName(queryValue ?? "");
    const filtered = normalizedQuery
      ? availableSurahs.filter((name) => {
          const normalizedEnglishName = normalizeSurahName(name);
          const arabicName = getArabicSurahNameByNormalizedName(
            normalizedEnglishName,
          );
          const normalizedArabicName = arabicName
            ? normalizeSurahName(arabicName)
            : "";

          return (
            normalizedEnglishName.includes(normalizedQuery) ||
            normalizedArabicName.includes(normalizedQuery)
          );
        })
      : availableSurahs;

    return filtered.slice(0, 14);
  }, [availableSurahs, queryValue]);

  const addByName = (name: string) => {
    const normalizedName = normalizeSurahName(name);

    if (!catalogNameSet.has(normalizedName)) {
      setInlineError("اختر سورة من القائمة المقترحة.");
      return;
    }

    const duplicate = trackedSurahs.some(
      (surah) => surah.normalizedName === normalizedName,
    );

    if (duplicate) {
      setInlineError("هذه السورة مضافة بالفعل.");
      return;
    }

    const catalogIndex = surahCatalog.findIndex(
      (n) => normalizeSurahName(n) === normalizedName,
    );
    const surahNumber = catalogIndex !== -1 ? catalogIndex + 1 : undefined;
    const result = addSurah(name, surahNumber);

    if (result.error) {
      setInlineError(result.error);
      return;
    }

    setInlineError(null);
    setQueryValue("");
  };

  return (
    <Screen scrollable={false}>
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: "padding", default: undefined })}
        style={styles.keyboard}
      >
        <View style={styles.heroSpacer} />
        <View
          style={[styles.modalCard, { backgroundColor: theme.colors.card }]}
        >
          <View style={styles.headerRow}>
            <View
              style={[
                styles.iconShell,
                { backgroundColor: theme.colors.primarySoft },
              ]}
            >
              <Ionicons
                color={theme.colors.primary}
                name="library-outline"
                size={20}
              />
            </View>
            <Text style={[styles.title, { color: theme.colors.text, flex: 1 }]}>
              إضافة سورة جديدة
            </Text>
            <Pressable
              onPress={() => router.back()}
              style={[
                styles.closeButton,
                { backgroundColor: theme.colors.cardElevated },
              ]}
            >
              <Ionicons color={theme.colors.textMuted} name="close" size={18} />
            </Pressable>
          </View>
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.colors.textMuted }]}>
              اسم السورة
            </Text>
            <TextInput
              autoCapitalize="words"
              autoFocus
              onChangeText={(value) => {
                if (inlineError) {
                  setInlineError(null);
                }

                setQueryValue(value);
              }}
              placeholder="ابحث عن اسم السورة"
              placeholderTextColor={theme.colors.textMuted}
              selectionColor={theme.colors.primary}
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.cardElevated,
                  borderColor: inlineError
                    ? theme.colors.critical
                    : theme.colors.border,
                  color: theme.colors.text,
                },
              ]}
              value={queryValue}
            />
            {inlineError ? (
              <Text style={[styles.error, { color: theme.colors.critical }]}>
                {inlineError}
              </Text>
            ) : null}
          </View>

          <View style={styles.pickerSection}>
            <Text style={[styles.label, { color: theme.colors.textMuted }]}>
              قائمة السور المتاحة
            </Text>
            <View
              style={[
                styles.pickerList,
                {
                  backgroundColor: theme.colors.cardElevated,
                  borderColor: theme.colors.border,
                },
              ]}
            >
              <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                {curatedMatches.length > 0 ? (
                  curatedMatches.map((surahName) => {
                    const arabicName = getArabicSurahNameByNormalizedName(
                      normalizeSurahName(surahName),
                    );

                    return (
                      <Pressable
                        key={surahName}
                        onPress={() => {
                          setInlineError(null);
                          setQueryValue(arabicName ?? "");
                          addByName(surahName);
                        }}
                        style={({ pressed }) => [
                          styles.pickerItem,
                          {
                            backgroundColor: pressed
                              ? theme.colors.cardMuted
                              : "transparent",
                            borderBottomColor: theme.colors.border,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.pickerItemText,
                            { color: theme.colors.text },
                          ]}
                        >
                          {arabicName ?? "سورة"}
                        </Text>
                        <Ionicons
                          color={theme.colors.primary}
                          name="add-circle-outline"
                          size={18}
                        />
                      </Pressable>
                    );
                  })
                ) : (
                  <Text
                    style={[
                      styles.pickerEmpty,
                      { color: theme.colors.textMuted },
                    ]}
                  >
                    لا توجد سور متاحة تطابق هذا البحث.
                  </Text>
                )}
              </ScrollView>
            </View>
          </View>

          <View style={styles.actions}>
            <Button
              label="إغلاق"
              onPress={() => router.back()}
              variant="secondary"
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
    justifyContent: "center",
  },
  heroSpacer: {
    flex: 1,
  },
  modalCard: {
    borderRadius: 30,
    padding: 24,
  },
  headerRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  iconShell: {
    alignItems: "center",
    borderRadius: 999,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  closeButton: {
    alignItems: "center",
    borderRadius: 999,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: -0.6,
  },
  formGroup: {
    gap: 10,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  input: {
    borderRadius: 999,
    borderWidth: 1,
    fontSize: 16,
    minHeight: 58,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  error: {
    fontSize: 13,
    fontWeight: "600",
  },
  actions: {
    gap: 12,
    marginTop: 28,
  },
  pickerSection: {
    gap: 10,
    marginTop: 16,
  },
  pickerList: {
    borderRadius: 20,
    borderWidth: 1,
    maxHeight: 250,
    overflow: "hidden",
  },
  pickerItem: {
    alignItems: "center",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    minHeight: 46,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  pickerItemText: {
    fontSize: 15,
    fontWeight: "600",
  },
  pickerEmpty: {
    fontSize: 14,
    paddingHorizontal: 14,
    paddingVertical: 16,
  },
});
