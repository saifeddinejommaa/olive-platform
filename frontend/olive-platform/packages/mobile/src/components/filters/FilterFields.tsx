import { useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { IconCalendarEvent, IconX } from "@tabler/icons-react-native";

import { toDateOnlyString } from "@olive-platform/core/features/shared/utils/DatesUtils";
import { colors, semanticColors } from "../../consts/Colors";
import { typography } from "../../consts/Typography";
import { radius, spacing } from "../../consts/spacing";

// ============================================================
// TEXTE
// ============================================================

type TextFieldProps = {
  label: string;
  value?: string | null;
  placeholder?: string;
  onChangeText: (value: string) => void;
};

export function FilterTextField({
  label,
  value,
  placeholder,
  onChangeText,
}: TextFieldProps) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value ?? ""}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        onChangeText={onChangeText}
        autoCapitalize="characters"
        autoCorrect={false}
      />
    </View>
  );
}

// ============================================================
// DATE (optionnelle, "" = pas de filtre)
// ============================================================

type DateFieldProps = {
  label: string;
  // Format "YYYY-MM-DD" ou "".
  value?: string | null;
  onChange: (value: string) => void;
};

const parseDateOnly = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export function FilterDateField({ label, value, onChange }: DateFieldProps) {
  const [showPicker, setShowPicker] = useState(false);

  const date = value ? parseDateOnly(value) : null;

  const handleChange = (_event: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === "ios");

    if (selectedDate) {
      onChange(toDateOnlyString(selectedDate));
    }
  };

  return (
    <View>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.dateRow}>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowPicker(true)}
        >
          <IconCalendarEvent size={18} color={semanticColors.primary} />
          <Text style={[typography.body, !date && styles.placeholder]}>
            {date ? date.toLocaleDateString("fr-FR") : "Toutes les dates"}
          </Text>
        </TouchableOpacity>

        {date && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => onChange("")}
            accessibilityLabel={`Effacer ${label}`}
            hitSlop={8}
          >
            <IconX size={16} color={semanticColors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {showPicker && (
        <DateTimePicker
          value={date ?? new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleChange}
        />
      )}
    </View>
  );
}

// ============================================================
// CHOIX UNIQUE (puces), null = "Tous"
// ============================================================

type ChoiceOption<T> = { value: T; label: string };

type ChoiceFieldProps<T> = {
  label: string;
  options: ChoiceOption<T>[];
  value?: T | null;
  allLabel?: string;
  onChange: (value: T | null) => void;
};

export function FilterChoiceField<T extends string | number>({
  label,
  options,
  value,
  allLabel = "Tous",
  onChange,
}: ChoiceFieldProps<T>) {
  const chips: ChoiceOption<T | null>[] = [
    { value: null, label: allLabel },
    ...options,
  ];

  return (
    <View>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.chips}>
        {chips.map((option) => {
          const selected = (value ?? null) === option.value;

          return (
            <Pressable
              key={String(option.value)}
              onPress={() => onChange(option.value)}
              style={[styles.chip, selected && styles.chipSelected]}
            >
              <Text
                style={[styles.chipText, selected && styles.chipTextSelected]}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

// Nombre de filtres renseignés (pour le badge du bouton Filtrer).
export function countActiveFilters(values: unknown[]) {
  return values.filter(
    (value) => value !== undefined && value !== null && value !== "",
  ).length;
}

const styles = StyleSheet.create({
  label: {
    ...typography.label,
    color: semanticColors.textSecondary,
    marginBottom: spacing.xs,
  },

  input: {
    ...typography.body,
    minHeight: 46,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    color: semanticColors.textPrimary,
  },

  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },

  dateButton: {
    flex: 1,
    minHeight: 46,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
  },

  placeholder: {
    color: semanticColors.textMuted,
  },

  clearButton: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },

  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },

  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },

  chipSelected: {
    borderColor: colors.olive[500],
    backgroundColor: colors.olive[100],
  },

  chipText: {
    ...typography.caption,
    color: semanticColors.textSecondary,
  },

  chipTextSelected: {
    color: colors.olive[800],
  },
});
