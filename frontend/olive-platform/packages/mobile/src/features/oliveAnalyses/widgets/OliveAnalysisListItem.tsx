import { StyleSheet, Text, View } from 'react-native';
import {
  IconFlask2,
  IconDroplet,
  IconCalendar,
  IconWaveSquare,
} from '@tabler/icons-react-native';

import { OliveAnalysis } from '@olive-platform/core/features/analyses/oliveAnalyses/domain/entities/OliveAnalysis';
import { colors } from '../../../consts/Colors';
import { radius, spacing } from '../../../consts/spacing';
import { typography } from '../../../consts/Typography';
import { formatDateOnly } from '../../../utils/formatter';
import { ListItemCard } from '../../../components/ListItemCard';
import { ListItemHeader } from '../../../components/ListItemHeader';

type OliveAnalysisListItemProps = {
  analysis: OliveAnalysis;
  onPress?: (analysis: OliveAnalysis) => void;
};

export function OliveAnalysisListItem({
  analysis,
  onPress,
}: OliveAnalysisListItemProps) {
  return (
    <ListItemCard onPress={() => onPress?.(analysis)}>
      <ListItemHeader
        title={analysis.reference}
        subtitle={formatDateOnly(analysis.plannedDate) ?? undefined}
        status={analysis.status}
      />

      {/* Source */}
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <IconFlask2 size={14} color={colors.textMuted} />
          <Text style={styles.metaText}>Source #{analysis.sourceId}</Text>
        </View>

        {analysis.plannedDate && (
          <>
            <View style={styles.metaDot} />
            <View style={styles.metaItem}>
              <IconCalendar size={14} color={colors.textMuted} />
              <Text style={styles.metaText}>
                {formatDateOnly(analysis.plannedDate)}
              </Text>
            </View>
          </>
        )}
      </View>

      {/* Résultats */}
      <View style={styles.statsGrid}>
        <StatCell
          icon={IconDroplet}
          label="Huile"
          value={analysis.oilPercentage}
          color={colors.olive[700]}
        />
        <StatCell
          icon={IconWaveSquare}
          label="Acidité"
          value={analysis.acidityPercentage}
          color={colors.gold[700]}
        />
        <StatCell
          icon={IconDroplet}
          label="Humidité"
          value={analysis.humidityPercentage}
          color={colors.teal[700]}
        />
        <StatCell
          icon={IconDroplet}
          label="Eau"
          value={analysis.waterPercentage}
          color={colors.textMuted}
        />
      </View>
    </ListItemCard>
  );
}

type StatCellProps = {
  icon: React.ComponentType<{ size?: number; color?: string }>;
  label: string;
  value?: number;
  color: string;
};

function StatCell({ icon: Icon, label, value, color }: StatCellProps) {
  return (
    <View style={styles.statCell}>
      <Icon size={16} color={color} />
      <View>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={[styles.statValue, { color }]}>
          {value != null ? `${value.toFixed(1)}%` : '—'}
        </Text>
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    gap: spacing.md,
  },
  statCell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    minWidth: '45%',
  },
  statLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  statValue: {
    ...typography.label,
    fontWeight: '600',
  },
});