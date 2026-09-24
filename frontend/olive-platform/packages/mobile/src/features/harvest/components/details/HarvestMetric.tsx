import { StyleSheet, Text, View } from "react-native";
import { radius, shadow, spacing } from "../../../../consts/spacing";
import { colors, semanticColors } from "../../../../consts/Colors";
import { typography } from "../../../../consts/Typography";

type Props = {
  label: string;
  value: string;
};

export function HarvestMetric({ label, value }: Props) {
  return (
    <View style={styles.container}>
      <Text style={[typography.caption, styles.label]}>{label}</Text>
      <Text style={[typography.h2, styles.value]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    color: semanticColors.textSecondary,
    marginBottom: spacing.xs,
  },
  value: {
    color: semanticColors.textPrimary,
  },
});