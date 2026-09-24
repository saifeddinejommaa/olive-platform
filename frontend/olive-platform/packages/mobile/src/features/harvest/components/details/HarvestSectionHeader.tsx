import { StyleSheet, Text, View } from "react-native";
import { radius, shadow, spacing } from "../../../../consts/spacing";
import { colors, semanticColors } from "../../../../consts/Colors";
import { typography } from "../../../../consts/Typography";

type Props = {
  title: string;
  subtitle?: string;
};

export function HarvestSectionHeader({ title, subtitle }: Props) {
  return (
    <View style={styles.container}>
      <Text style={[typography.h2, styles.title]}>{title}</Text>

      {subtitle && (
        <Text style={[typography.caption, styles.subtitle]}>{subtitle}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  title: {
    color: semanticColors.textPrimary,
  },
  subtitle: {
    color: semanticColors.textSecondary,
    marginTop: spacing.xs,
  },
});