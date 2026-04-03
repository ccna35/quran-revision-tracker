import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { useAppTheme } from "@/theme/provider";

interface SearchInputProps {
  onChangeText: (value: string) => void;
  value: string;
}

export function SearchInput({ onChangeText, value }: SearchInputProps) {
  const theme = useAppTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.cardMuted,
          borderColor: theme.colors.border,
        },
      ]}
    >
      <Ionicons color={theme.colors.textMuted} name="search" size={20} />
      <TextInput
        onChangeText={onChangeText}
        placeholder="Search Surah (English or Arabic)"
        placeholderTextColor={theme.colors.textMuted}
        selectionColor={theme.colors.primary}
        style={[styles.input, { color: theme.colors.text }]}
        value={value}
      />
      {value ? (
        <Pressable
          accessibilityLabel="Clear search"
          accessibilityRole="button"
          onPress={() => onChangeText("")}
          style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
        >
          <Ionicons
            color={theme.colors.textMuted}
            name="close-circle"
            size={20}
          />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: "row",
    gap: 12,
    minHeight: 58,
    paddingHorizontal: 18,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 16,
  },
});
