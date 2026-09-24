import { ComponentType } from 'react';
import { StyleSheet, View } from 'react-native';
import { IconChevronRight } from '@tabler/icons-react-native';
import { colors, semanticColors } from '../consts/Colors';
import { radius, spacing } from '../consts/spacing';

export type StepIndicator = {
  key: string;
  visible: boolean;
  icon: ComponentType<{ size?: number; color?: string }>;
  color: string;
};

type StepIndicatorRowProps = {
  steps: StepIndicator[];
  showChevron?: boolean;
};

export function StepIndicatorRow({
  steps,
  showChevron = true,
}: StepIndicatorRowProps) {
  return (
    <View style={styles.footer}>
      <View style={styles.footerRight}>
        {steps
          .filter((step) => step.visible)
          .map(({ key, icon: Icon, color }) => (
            <View key={key} style={styles.stepIcon}>
              <Icon size={14} color={color} />
            </View>
          ))}

        {showChevron && (
          <IconChevronRight size={18} color={semanticColors.textMuted} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  stepIcon: {
    width: 24,
    height: 24,
    borderRadius: radius.pill,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});