import { Pressable, StyleSheet, Text, View } from "react-native";
import { IconChevronLeft } from "@tabler/icons-react-native";
import { typography } from "../consts/Typography";
import { radius, shadow, spacing } from "../consts/spacing";
import { colors, semanticColors } from "../consts/Colors";

type Props = {
  title: string;
  onBack?: () => void;
};

export function DetailsHeader({ title, onBack }: Props) {
  return (
    <View style={styles.container}>
      <Pressable
        onPress={onBack}
        style={({ pressed }) => [
          styles.backButton,
          pressed && styles.backButtonPressed,
        ]}
      >
        <IconChevronLeft size={22} color={semanticColors.textPrimary} />
      </Pressable>

      <Text style={[typography.h2, styles.title]}>{title}</Text>
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

  title: {
    color: semanticColors.textPrimary,
  },
});