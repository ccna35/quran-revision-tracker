import { ThemeProvider as NavigationThemeProvider } from "@react-navigation/native";
import { createContext, useContext, useMemo } from "react";
import { useColorScheme } from "react-native";

import { useAppPreferencesStore } from "@/store/use-app-preferences-store";
import { darkTheme, lightTheme, type AppTheme } from "@/theme/tokens";

const AppThemeContext = createContext<AppTheme>(lightTheme);

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const themeMode = useAppPreferencesStore((state) => state.themeMode);

  const theme = useMemo(() => {
    const resolvedMode =
      themeMode === "system"
        ? systemColorScheme === "dark"
          ? "dark"
          : "light"
        : themeMode;

    return resolvedMode === "dark" ? darkTheme : lightTheme;
  }, [systemColorScheme, themeMode]);

  return (
    <AppThemeContext.Provider value={theme}>
      <NavigationThemeProvider value={theme.navigationTheme}>
        {children}
      </NavigationThemeProvider>
    </AppThemeContext.Provider>
  );
}

export function useAppTheme() {
  return useContext(AppThemeContext);
}
