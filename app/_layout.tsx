import {
  Cairo_400Regular,
  Cairo_600SemiBold,
  Cairo_700Bold,
  useFonts,
} from "@expo-google-fonts/cairo";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { I18nManager, Text, TextInput } from "react-native";
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

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Cairo_400Regular,
    Cairo_600SemiBold,
    Cairo_700Bold,
  });

  useEffect(() => {
    if (!fontsLoaded) {
      return;
    }

    I18nManager.allowRTL(true);
    I18nManager.forceRTL(true);

    const TextBase = Text as unknown as {
      defaultProps?: Record<string, unknown>;
    };
    const TextInputBase = TextInput as unknown as {
      defaultProps?: Record<string, unknown>;
    };

    TextBase.defaultProps = {
      ...(TextBase.defaultProps ?? {}),
      style: [{ fontFamily: "Cairo_400Regular", writingDirection: "rtl" }],
    };
    TextInputBase.defaultProps = {
      ...(TextInputBase.defaultProps ?? {}),
      style: [{ fontFamily: "Cairo_400Regular", writingDirection: "rtl" }],
      textAlign: "right",
    };

    void SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

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
          contentStyle: {
            backgroundColor: theme.colors.background,
            direction: "rtl",
          },
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
        <Stack.Screen
          name="surah/[surahId]"
          options={{
            headerShown: false,
            contentStyle: { backgroundColor: theme.colors.background },
          }}
        />
        <Stack.Screen name="+not-found" options={{ title: "غير موجود" }} />
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
            error instanceof Error
              ? error.message
              : "فشلت عملية النسخ الاحتياطي.",
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
