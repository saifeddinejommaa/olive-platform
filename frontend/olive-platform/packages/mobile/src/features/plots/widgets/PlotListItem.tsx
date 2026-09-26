import { StyleSheet, Text, View } from 'react-native';
import {
  IconTree,
  IconChecklist,
  IconTargetArrow,
} from '@tabler/icons-react-native';

import { PlotForList } from '@olive-platform/core/features/plots/domain/entities/PlotForList';
import { colors } from '../../../consts/Colors';
import { radius, spacing } from '../../../consts/spacing';
import { typography } from '../../../consts/Typography';
import { ListItemCard } from '../../../components/ListItemCard';
import { ListItemHeader } from '../../../components/ListItemHeader';

type PlotListItemProps = {
  plot: PlotForList;
  onPress?: (plot: PlotForList) => void;
};

export function PlotListItem({ plot, onPress }: PlotListItemProps) {
  return (
    <ListItemCard onPress={() => onPress?.(plot)}>
      <ListItemHeader title={plot.name} subtitle={plot.reference} />

      {/* Nombre d'arbres + éligibilité récolte */}
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <IconTree size={14} color={colors.textMuted} />
          <Text style={styles.metaText}>
            {plot.numberOfTrees} arbre{plot.numberOfTrees > 1 ? 's' : ''}
          </Text>
        </View>

        {plot.canLaunchHarvest && (
          <>
            <View style={styles.metaDot} />
            <View style={styles.metaItem}>
              <IconTargetArrow size={14} color={colors.olive[700]} />
              <Text style={[styles.metaText, { color: colors.olive[700] }]}>
                Récolte possible
              </Text>
            </View>
          </>
        )}
      </View>

      {/* Progression récolte / planification */}
      <View style={styles.progressBlock}>
        <ProgressRow
          icon={IconChecklist}
          label="Récoltés"
          percentage={plot.harvestedTreesPercentage}
          color={colors.teal[700]}
        />
        <ProgressRow
          icon={IconTargetArrow}
          label="Planifiés"
          percentage={plot.plannedTreesPercentage}
          color={colors.gold[700]}
        />
      </View>
    </ListItemCard>
  );
}

type ProgressRowProps = {
  icon: React.ComponentType<{ size?: number; color?: string }>;
  label: string;
  percentage: number;
  color: string;
};

function ProgressRow({ icon: Icon, label, percentage, color }: ProgressRowProps) {
  const clamped = Math.min(100, Math.max(0, percentage));

  return (
    <View style={styles.progressRow}>
      <Icon size={16} color={color} />

      <View style={styles.progressTextBlock}>
        <View style={styles.progressLabelRow}>
          <Text style={styles.progressLabel}>{label}</Text>
          <Text style={[styles.progressPercentage, { color }]}>
            {clamped.toFixed(0)}%
          </Text>
        </View>

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${clamped}%`, backgroundColor: color },
            ]}
          />
        </View>
      </View>
    </View>
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
  progressBlock: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  progressTextBlock: {
    flex: 1,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  progressPercentage: {
    ...typography.caption,
    fontWeight: '600',
  },
  progressTrack: {
    height: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.background,
    marginTop: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: radius.pill,
  },
});