import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, semanticColors } from "../consts/Colors";
import { typography } from "../consts/Typography";
import { radius } from "../consts/spacing";

type Option<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
};

// Choix entre quelques vues (ex. analyses d'olive / d'huile).
export function SegmentedControl<T extends string>({ options, value, onChange }: Props<T>) {
  return (
    <View style={styles.container}>
      {options.map((option) => {
        const selected = option.value === value;

        return (
          <Pressable
            key={option.value}
            style={[styles.segment, selected && styles.segmentSelected]}
            onPress={() => onChange(option.value)}
          >
            <Text style={[typography.bodyStrong, selected ? styles.labelSelected : styles.label]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 4,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    gap: 4,
  },
  segment: {
    flex: 1,
    minHeight: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.sm,
  },
  segmentSelected: {
    backgroundColor: semanticColors.primary,
  },
  label: { color: semanticColors.textSecondary },
  labelSelected: { color: semanticColors.onPrimary },
});
