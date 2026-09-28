import {
  IconCircleCheck,
  IconClock,
  IconPlayerPlay,
  IconX,
} from '@tabler/icons-react-native';
import type { ComponentType } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ProductionStatus } from '@olive-platform/core/features/production/domain/entities/ProductionStatus';

import { statusColors } from '../consts/Colors';
import { radius, spacing } from '../consts/spacing';
import { typography } from '../consts/Typography';

type StatusConfig = {
  label: string;
  icon: ComponentType<{ size?: number; color?: string }>;
  color: string;
  backgroundColor: string;
};

// Mêmes tons que le web et les pastilles du tableau de bord.
const STATUS_CONFIG: Record<ProductionStatus, StatusConfig> = {
  [ProductionStatus.Planned]: {
    label: 'Planifiée',
    icon: IconClock,
    color: statusColors.planned.color,
    backgroundColor: statusColors.planned.background,
  },

  [ProductionStatus.InProgress]: {
    label: 'En cours',
    icon: IconPlayerPlay,
    color: statusColors.inProgress.color,
    backgroundColor: statusColors.inProgress.background,
  },

  [ProductionStatus.Completed]: {
    label: 'Clôturée',
    icon: IconCircleCheck,
    color: statusColors.completed.color,
    backgroundColor: statusColors.completed.background,
  },

  [ProductionStatus.Cancelled]: {
    label: 'Annulée',
    icon: IconX,
    color: statusColors.cancelled.color,
    backgroundColor: statusColors.cancelled.background,
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
