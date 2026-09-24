import { StyleSheet, Text, View } from 'react-native';
import {
  IconClock,
  IconDroplet,
  IconFlask2,
  IconMapPin,
  IconTree,
} from '@tabler/icons-react-native';

import { HarvestForList } from '@olive-platform/core/features/harvests/domain/entities/HarvestForList';
import { colors } from '../../../consts/Colors';
import { radius, spacing } from '../../../consts/spacing';
import { typography } from '../../../consts/Typography';
import { formatDateOnly, formatTimeOnly } from '../../../utils/formatter';
import { ListItemCard } from '../../../components/ListItemCard';
import { ListItemHeader } from '../../../components/ListItemHeader';
import { StepIndicatorRow } from '../../../components/StepIndicatorRow';
import { ProductionStatus } from '@olive-platform/core/features/production/domain/entities/ProductionStatus';

type HarvestListItemProps = {
  harvest: HarvestForList;
  onPress?: (harvest: HarvestForList) => void;
};

export function HarvestListItem({ harvest, onPress }: HarvestListItemProps) {
  const startTime = formatTimeOnly(harvest.startTime);
  const endTime = formatTimeOnly(harvest.endTime);

  let period = 'Horaire non défini';

  if (startTime && endTime) {
    period = `${startTime} → ${endTime}`;
  } else if (startTime) {
    period = `Depuis ${startTime}`;
  } else if (endTime) {
    period = `Jusqu'à ${endTime}`;
  }

  return (
    <ListItemCard onPress={() => onPress?.(harvest)}>
      <ListItemHeader
        title={harvest.reference}
        subtitle={formatDateOnly(harvest.harvestDate) ?? undefined}
        status={harvest.status}
      />

      {/* Parcelle + variété */}
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <IconMapPin size={14} color={colors.textMuted} />
          <Text style={styles.metaText}>Parcelle #{harvest.plotId}</Text>
        </View>

        <View style={styles.metaDot} />

        <View style={styles.metaItem}>
          <IconTree size={14} color={colors.textMuted} />
          <Text style={styles.metaText}>{harvest.variety}</Text>
        </View>
      </View>

      {/* Horaire */}
      <View style={styles.timeBlock}>
        <IconClock size={18} color={colors.olive[700]} />

        <View>
          <Text style={styles.timeLabel}>Horaire de récolte</Text>
          <Text style={styles.timeValue}>{period}</Text>
        </View>
      </View>

      <StepIndicatorRow
        steps={[
          {
            key: 'pressed',
            visible: harvest.pressed == ProductionStatus.Completed,
            icon: IconDroplet,
            color: colors.teal[700],
          },
          {
            key: 'analysis',
            visible: harvest.analysis == ProductionStatus.Completed,
            icon: IconFlask2,
            color: colors.gold[700],
          },
        ]}
      />
    </ListItemCard>
  );
}

const styles = StyleSheet.create({
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: radius.pill,
    backgroundColor: colors.textMuted,
  },
  timeBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.background,
  },
  timeLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  timeValue: {
    ...typography.label,
    color: colors.textPrimary,
    marginTop: 2,
  },
});