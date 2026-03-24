import { Pressable, ScrollView, StyleSheet, Text } from "react-native";

import { sortOptions } from "@/constants/sort-options";
import { useAppTheme } from "@/theme/provider";
import type { SortOption } from "@/types/surah";

interface SortSelectorProps {
  onChange: (value: SortOption) => void;
  value: SortOption;
}

export function SortSelector({ onChange, value }: SortSelectorProps) {
  const theme = useAppTheme();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {sortOptions.map((option) => {
        const active = option.value === value;

        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={({ pressed }) => [
              styles.chip,
              {
                backgroundColor: active
                  ? theme.colors.card
                  : theme.colors.cardElevated,
                borderColor: active
                  ? theme.colors.primary
                  : theme.colors.border,
                marginRight: theme.spacing.sm,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Text
              style={[
                styles.label,
                {
                  color: active ? theme.colors.primary : theme.colors.textMuted,
                },
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
});
