import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { radius, shadow, spacing } from "../consts/spacing";
import { colors, semanticColors } from "../consts/Colors";
import { typography } from "../consts/Typography";

type Props = {
  icon: string;
  title: string;
  subtitle: string;
  loading?: boolean;
  onPress: () => void;
};

export function ActionCard({
  icon,
  title,
  subtitle,
  loading = false,
  onPress,
}: Props) {
  return (
    <Pressable
      disabled={loading}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.iconContainer}>
        {loading ? (
          <ActivityIndicator color={semanticColors.onPrimary} />
        ) : (
          <Text style={styles.icon}>{icon}</Text>
        )}
      </View>

      <View style={styles.text}>
        <Text style={[typography.bodyStrong, styles.title]}>{title}</Text>
        <Text style={[typography.caption, styles.subtitle]}>{subtitle}</Text>
      </View>

      <Text style={styles.arrow}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: semanticColors.primary,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    marginBottom: spacing.xl,
    ...shadow.raised,
  },
  pressed: {
    backgroundColor: semanticColors.primaryPressed,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    backgroundColor: "rgba(255,255,255,0.14)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  icon: {
    color: semanticColors.onPrimary,
    fontSize: 16,
    fontWeight: "700",
  },
  text: {
    flex: 1,
  },
  title: {
    color: semanticColors.onPrimary,
  },
  subtitle: {
    color: colors.olive[100],
    marginTop: 2,
  },
  arrow: {
    color: semanticColors.onPrimary,
    fontSize: 28,
    fontWeight: "300",
    marginLeft: spacing.md,
  },
});