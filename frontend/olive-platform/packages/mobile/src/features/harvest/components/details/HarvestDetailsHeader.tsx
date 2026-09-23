import { Pressable, StyleSheet, Text, View } from "react-native";
import { typography } from "../../../../consts/Typography";
import { radius, shadow, spacing } from "../../../../consts/spacing";
import { colors, semanticColors } from "../../../../consts/Colors";

type Props = {
  reference: string;
  onBack?: () => void;
};

export function HarvestDetailsHeader({ reference, onBack }: Props) {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={onBack}
        style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
      >
        <Text style={styles.backIcon}>‹</Text>
      </Pressable>

      <View style={styles.text}>
        <Text style={[typography.label, styles.eyebrow]}>DÉTAIL DE LA RÉCOLTE</Text>
        <Text style={[typography.h2, styles.title]}>{reference}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
    ...shadow.card,
  },
  backButtonPressed: {
    backgroundColor: colors.olive[100],
  },
  backIcon: {
    fontSize: 28,
    lineHeight: 30,
    color: semanticColors.textPrimary,
    marginTop: -2,
  },
  text: {
    flex: 1,
  },
  eyebrow: {
    color: semanticColors.textMuted,
    marginBottom: spacing.xs,
  },
  title: {
    color: semanticColors.textPrimary,
  },
});