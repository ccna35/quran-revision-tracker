import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "@/theme/provider";

type ButtonVariant = "primary" | "secondary" | "ghost" | "soft";

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  iconName?: React.ComponentProps<typeof Ionicons>["name"];
  disabled?: boolean;
  fullWidth?: boolean;
}

export function Button({
  label,
  onPress,
  variant = "primary",
  iconName,
  disabled = false,
  fullWidth = true,
}: ButtonProps) {
  const theme = useAppTheme();

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.buttonBase,
        fullWidth && styles.fullWidth,
        { opacity: disabled ? 0.45 : pressed ? 0.9 : 1 },
      ]}
    >
      {variant === "primary" ? (
        <LinearGradient
          colors={[theme.colors.primary, theme.colors.primaryDim]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.surface,
            {
              borderRadius: theme.radius.pill,
              shadowColor: theme.colors.primary,
            },
          ]}
        >
          <View style={styles.content}>
            {iconName ? (
              <Ionicons
                color={theme.colors.textOnPrimary}
                name={iconName}
                size={18}
              />
            ) : null}
            <Text style={[styles.label, { color: theme.colors.textOnPrimary }]}>
              {label}
            </Text>
          </View>
        </LinearGradient>
      ) : (
        <View
          style={[
            styles.surface,
            {
              backgroundColor:
                variant === "secondary"
                  ? theme.colors.cardElevated
                  : variant === "soft"
                    ? theme.colors.primarySoft
                    : "transparent",
              borderColor:
                variant === "ghost" ? theme.colors.border : "transparent",
              borderRadius: theme.radius.pill,
            },
          ]}
        >
          <View style={styles.content}>
            {iconName ? (
              <Ionicons
                color={
                  variant === "ghost" ? theme.colors.primary : theme.colors.text
                }
                name={iconName}
                size={18}
              />
            ) : null}
            <Text
              style={[
                styles.label,
                {
                  color:
                    variant === "ghost"
                      ? theme.colors.primary
                      : theme.colors.text,
                },
              ]}
            >
              {label}
            </Text>
          </View>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonBase: {
    minHeight: 56,
  },
  fullWidth: {
    alignSelf: "stretch",
  },
  surface: {
    minHeight: 56,
    justifyContent: "center",
    paddingHorizontal: 20,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
  },
  content: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },
});
