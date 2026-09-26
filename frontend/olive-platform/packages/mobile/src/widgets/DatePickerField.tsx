import { useState } from "react";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { IconCalendarEvent } from "@tabler/icons-react-native";

import { colors, semanticColors } from "../consts/Colors";
import { typography } from "../consts/Typography";
import { radius, spacing } from "../consts/spacing";
import { formatDate } from "@olive-platform/core/features/shared/utils/DatesUtils";

export function safeParseDate(value?: string | null): Date {
  if (!value) return new Date();

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

type Props = {
  value: Date;
  editable: boolean;
  onChange: (date: Date) => void;
};

export function DatePickerField({ value, editable, onChange }: Props) {
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (_event: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === "ios");

    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  if (!editable) {
    return (
      <Text style={[typography.bodyStrong, styles.readOnlyValue]}>
        {formatDate(value.toISOString())}
      </Text>
    );
  }

  return (
    <View>
      <TouchableOpacity style={styles.dateButton} onPress={() => setShowPicker(true)}>
        <IconCalendarEvent size={18} color={semanticColors.primary} />

        <Text style={[typography.bodyStrong, styles.dateValue]}>
          {formatDate(value.toISOString())}
        </Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={value}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  readOnlyValue: {
    color: semanticColors.textPrimary,
    textAlign: "right",
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  dateValue: {
    color: semanticColors.primary,
  },
});