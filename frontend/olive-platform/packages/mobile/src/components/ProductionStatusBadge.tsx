import {
  IconCircleCheck,
  IconClock,
  IconPlayerPlay,
  IconX,
} from '@tabler/icons-react-native';
import type { ComponentType } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ProductionStatus } from '@olive-platform/core/features/production/domain/entities/ProductionStatus';

import { colors } from '../consts/Colors';
import { radius, spacing } from '../consts/spacing';
import { typography } from '../consts/Typography';

type StatusConfig = {
  label: string;
  icon: ComponentType<{ size?: number; color?: string }>;
  color: string;
  backgroundColor: string;
};

const STATUS_CONFIG: Record<ProductionStatus, StatusConfig> = {
  [ProductionStatus.Planned]: {
    label: 'Planifiée',
    icon: IconClock,
    color: colors.gold[700],
    backgroundColor: colors.gold[100],
  },

  [ProductionStatus.InProgress]: {
    label: 'En cours',
    icon: IconPlayerPlay,
    color: colors.teal[700],
    backgroundColor: colors.teal[100],
  },

  [ProductionStatus.Completed]: {
    label: 'Clôturée',
    icon: IconCircleCheck,
    color: colors.olive[700],
    backgroundColor: colors.olive[100],
  },

  [ProductionStatus.Cancelled]: {
    label: 'Annulée',
    icon: IconX,
    color: colors.textSecondary,
    backgroundColor: colors.background,
  },
};

type ProductionStatusBadgeProps = {
  status: ProductionStatus;
};

export function ProductionStatusBadge({
  status,
}: ProductionStatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  if (!config) {
    return null;
  }

  const Icon = config.icon;

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: config.backgroundColor,
        },
      ]}
    >
      <Icon
        size={14}
        color={config.color}
      />

      <Text
        style={[
          styles.label,
          {
            color: config.color,
          },
        ]}
      >
        {config.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },

  label: {
    ...typography.caption,
    fontWeight: '600',
  },
});
