import { Alert, Pressable, StyleSheet, Switch, Text, View } from "react-native";

import { Button } from "@/components/common/Button";
import { Screen } from "@/components/common/Screen";
import { localBackupService } from "@/services/backup/local-backup-service";
import { useAppPreferencesStore } from "@/store/use-app-preferences-store";
import { useSurahStore } from "@/store/use-surah-store";
import { useAppTheme } from "@/theme/provider";
import type { ThemeMode } from "@/types/surah";
import { buildBackupPayload } from "@/utils/build-backup-payload";

const themeModes: ThemeMode[] = ["light", "dark", "system"];

const themeModeLabels: Record<ThemeMode, string> = {
  dark: "داكن",
  light: "فاتح",
  system: "حسب النظام",
};

const backupStatusLabels: Record<string, string> = {
  error: "خطأ",
  idle: "خامل",
  running: "جارٍ التنفيذ",
  success: "ناجح",
};

export default function SettingsScreen() {
  const theme = useAppTheme();
  const trackedSurahs = useSurahStore((state) => state.trackedSurahs);
  const loadSampleData = useSurahStore((state) => state.loadSampleData);
  const resetAll = useSurahStore((state) => state.resetAll);
  const themeMode = useAppPreferencesStore((state) => state.themeMode);
  const setThemeMode = useAppPreferencesStore((state) => state.setThemeMode);
  const backup = useAppPreferencesStore((state) => state.backup);
  const setAutoBackupEnabled = useAppPreferencesStore(
    (state) => state.setAutoBackupEnabled,
  );
  const setBackupRunning = useAppPreferencesStore(
    (state) => state.setBackupRunning,
  );
  const recordBackupFailure = useAppPreferencesStore(
    (state) => state.recordBackupFailure,
  );
  const recordBackupSuccess = useAppPreferencesStore(
    (state) => state.recordBackupSuccess,
  );

  const runManualBackup = async () => {
    try {
      setBackupRunning();
      const record = await localBackupService.runBackup(
        buildBackupPayload(trackedSurahs),
        "manual",
      );
      recordBackupSuccess(record);
    } catch (error) {
      recordBackupFailure(
        error instanceof Error ? error.message : "فشلت عملية النسخ الاحتياطي.",
      );
    }
  };

  return (
    <Screen>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        الإعدادات
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.textMuted }]}>
        تحكم في المظهر والنسخ الاحتياطي والبيانات التجريبية المحلية.
      </Text>

      <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
          المظهر
        </Text>
        <View style={styles.modeRow}>
          {themeModes.map((mode) => {
            const active = mode === themeMode;

            return (
              <Pressable
                key={mode}
                onPress={() => setThemeMode(mode)}
                style={[
                  styles.modeChip,
                  {
                    backgroundColor: active
                      ? theme.colors.primarySoft
                      : theme.colors.cardElevated,
                    borderColor: active
                      ? theme.colors.primary
                      : theme.colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.modeLabel,
                    {
                      color: active
                        ? theme.colors.primary
                        : theme.colors.textMuted,
                    },
                  ]}
                >
                  {themeModeLabels[mode]}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
          النسخ الاحتياطي
        </Text>
        <Text style={[styles.body, { color: theme.colors.textMuted }]}>
          ينشئ التطبيق نسخة JSON محلية مرة يوميًا لتسهيل إضافة المزامنة السحابية
          لاحقًا.
        </Text>
        <View style={styles.toggleRow}>
          <Text style={[styles.toggleLabel, { color: theme.colors.text }]}>
            نسخ احتياطي تلقائي يومي
          </Text>
          <Switch
            onValueChange={setAutoBackupEnabled}
            thumbColor={
              backup.autoBackupEnabled
                ? theme.colors.primary
                : theme.colors.cardMuted
            }
            trackColor={{
              false: theme.colors.cardMuted,
              true: theme.colors.primarySoft,
            }}
            value={backup.autoBackupEnabled}
          />
        </View>
        <Text style={[styles.meta, { color: theme.colors.textMuted }]}>
          الحالة: {backupStatusLabels[backup.status] ?? backup.status}
        </Text>
        <Text style={[styles.meta, { color: theme.colors.textMuted }]}>
          آخر نسخة: {backup.lastBackup?.savedAt ?? "لم يتم الإنشاء بعد"}
        </Text>
        {backup.lastBackup?.path ? (
          <Text style={[styles.meta, { color: theme.colors.textMuted }]}>
            تم الحفظ في: {backup.lastBackup.path}
          </Text>
        ) : null}
        {backup.lastError ? (
          <Text style={[styles.error, { color: theme.colors.critical }]}>
            {backup.lastError}
          </Text>
        ) : null}
        <View style={styles.actions}>
          <Button
            label="نسخ احتياطي الآن"
            onPress={runManualBackup}
            variant="primary"
          />
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
          أدوات المطور
        </Text>
        <View style={styles.actions}>
          <Button
            label="تحميل بيانات تجريبية"
            onPress={loadSampleData}
            variant="secondary"
          />
          <Button
            label="مسح كل السور"
            onPress={() =>
              Alert.alert(
                "مسح كل السور المتابعة",
                "سيؤدي ذلك إلى حذف القائمة المحلية بالكامل.",
                [
                  { style: "cancel", text: "إلغاء" },
                  { onPress: resetAll, style: "destructive", text: "مسح" },
                ],
              )
            }
            variant="ghost"
          />
        </View>
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
  card: {
    borderRadius: 28,
    gap: 14,
    marginBottom: 18,
    padding: 22,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: -1,
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
  },
  modeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  modeChip: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  modeLabel: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  toggleRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: "600",
  },
  meta: {
    fontSize: 13,
    lineHeight: 20,
  },
  error: {
    fontSize: 13,
    fontWeight: "600",
  },
  actions: {
    gap: 12,
    marginTop: 8,
  },
});
