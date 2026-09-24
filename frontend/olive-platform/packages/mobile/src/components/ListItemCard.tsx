import { PropsWithChildren } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../consts/Colors';
import { radius, shadow, spacing } from '../consts/spacing';

type ListItemCardProps = PropsWithChildren<{
  onPress?: () => void;
}>;

export function ListItemCard({ children, onPress }: ListItemCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={onPress}
    >
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadow.card,
  },
});