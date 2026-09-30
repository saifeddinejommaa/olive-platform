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
import { AnalysisStatsGrid } from '../../../components/AnalysisStatsGrid';

type OliveAnalysisListItemProps = {
  analysis: OliveAnalysis;
  onPress?: (analysis: OliveAnalysis) => void;
};

const formatPercentage = (value?: number | null) =>
  value != null ? `${value.toFixed(1)}%` : null;

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
          <Text style={styles.metaText}>
            {analysis.sourceTypeId === 2 ? "Achat" : "Récolte"}
            {" · "}
            {analysis.sourceReference ?? "—"}
            {analysis.plotReference ? ` · ${analysis.plotReference}` : ""}
          </Text>
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
      <AnalysisStatsGrid
        stats={[
          { icon: IconDroplet, label: "Huile", value: formatPercentage(analysis.oilPercentage), color: colors.olive[700] },
          { icon: IconWaveSquare, label: "Acidité", value: formatPercentage(analysis.acidityPercentage), color: colors.gold[700] },
          { icon: IconDroplet, label: "Humidité", value: formatPercentage(analysis.humidityPercentage), color: colors.teal[700] },
          { icon: IconDroplet, label: "Eau", value: formatPercentage(analysis.waterPercentage), color: colors.textMuted },
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
});
