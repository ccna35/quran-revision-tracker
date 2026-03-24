import { LinearGradient } from "expo-linear-gradient";
import type { PropsWithChildren } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppTheme } from "@/theme/provider";

interface ScreenProps extends PropsWithChildren {
  scrollable?: boolean;
}

export function Screen({ children, scrollable = true }: ScreenProps) {
  const theme = useAppTheme();
  const content = scrollable ? (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.content, styles.contentFlex]}>{children}</View>
  );

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.root}>
        <LinearGradient
          colors={[theme.colors.backgroundAccent, theme.colors.background]}
          end={{ x: 1, y: 1 }}
          start={{ x: 0, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
        <View
          style={[
            styles.glow,
            { backgroundColor: theme.colors.primarySoft, left: -80, top: -40 },
          ]}
        />
        <View
          style={[
            styles.glow,
            {
              backgroundColor: theme.colors.cardMuted,
              bottom: -90,
              right: -70,
            },
          ]}
        />
        {content}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  root: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 120,
  },
  contentFlex: {
    flex: 1,
  },
  glow: {
    borderRadius: 999,
    height: 220,
    opacity: 0.22,
    position: "absolute",
    width: 220,
  },
});
