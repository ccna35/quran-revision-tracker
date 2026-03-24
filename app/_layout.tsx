import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { localBackupService } from "@/services/backup/local-backup-service";
import { useAppPreferencesStore } from "@/store/use-app-preferences-store";
import { useSurahStore } from "@/store/use-surah-store";
import { AppThemeProvider, useAppTheme } from "@/theme/provider";
import { buildBackupPayload } from "@/utils/build-backup-payload";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <AutoBackupBridge />
      <RootLayoutNav />
    </AppThemeProvider>
  );
}

function RootLayoutNav() {
  const theme = useAppTheme();

  return (
    <>
      <StatusBar style={theme.isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="add-surah"
          options={{
            headerShown: false,
            presentation: "modal",
            contentStyle: { backgroundColor: theme.colors.background },
          }}
        />
        <Stack.Screen name="+not-found" options={{ title: "Not found" }} />
      </Stack>
    </>
  );
}

function AutoBackupBridge() {
  const trackedSurahs = useSurahStore((state) => state.trackedSurahs);
  const backup = useAppPreferencesStore((state) => state.backup);
  const setBackupRunning = useAppPreferencesStore(
    (state) => state.setBackupRunning,
  );
  const recordBackupSuccess = useAppPreferencesStore(
    (state) => state.recordBackupSuccess,
  );
  const recordBackupFailure = useAppPreferencesStore(
    (state) => state.recordBackupFailure,
  );

  useEffect(() => {
    if (!backup.autoBackupEnabled || trackedSurahs.length === 0) {
      return;
    }

    if (!localBackupService.isBackupDue(backup.lastBackup?.savedAt ?? null)) {
      return;
    }

    let active = true;

    const run = async () => {
      try {
        setBackupRunning();
        const record = await localBackupService.runBackup(
          buildBackupPayload(trackedSurahs),
          "auto",
        );

        if (active) {
          recordBackupSuccess(record);
        }
      } catch (error) {
        if (active) {
          recordBackupFailure(
            error instanceof Error ? error.message : "Backup failed.",
          );
        }
      }
    };

    void run();

    return () => {
      active = false;
    };
  }, [
    backup.autoBackupEnabled,
    backup.lastBackup?.savedAt,
    recordBackupFailure,
    recordBackupSuccess,
    setBackupRunning,
    trackedSurahs,
  ]);

  return null;
}
