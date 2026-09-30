import { StyleSheet, Text, View } from "react-native";
import {
  IconBuildingWarehouse,
  IconCalendar,
  IconDroplet,
  IconFlame,
  IconSun,
  IconWaveSquare,
} from "@tabler/icons-react-native";

import type { OilAnalysisForList } from "@olive-platform/core/features/analyses/oilAnalyses/domain/entities/OilAnalysisForList";
import { colors } from "../../../consts/Colors";
import { radius, spacing } from "../../../consts/spacing";
import { typography } from "../../../consts/Typography";
import { formatDateOnly } from "../../../utils/formatter";
import { ListItemCard } from "../../../components/ListItemCard";
import { ListItemHeader } from "../../../components/ListItemHeader";
import { AnalysisStatsGrid } from "../../../components/AnalysisStatsGrid";
import { OilCategoryBadge } from "../components/OilCategoryBadge";

type Props = {
  analysis: OilAnalysisForList;
  onPress?: (analysis: OilAnalysisForList) => void;
};

const formatValue = (value: number | null, digits: number, suffix = "") =>
  value != null ? `${Number(value).toFixed(digits)}${suffix}` : null;

// Même présentation que l'analyse d'olive : source, date, puis les résultats.
export function OilAnalysisListItem({ analysis, onPress }: Props) {
  return (
    <ListItemCard onPress={() => onPress?.(analysis)}>
      <ListItemHeader
        title={analysis.reference}
        subtitle={formatDateOnly(analysis.plannedDate) ?? undefined}
        status={analysis.status}
      />

      {/* Source et position de l'huile */}
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <IconDroplet size={14} color={colors.textMuted} />
          <Text style={styles.metaText}>Pression · {analysis.sourceReference ?? "—"}</Text>
        </View>

        {analysis.plannedDate && (
          <>
            <View style={styles.metaDot} />
            <View style={styles.metaItem}>
              <IconCalendar size={14} color={colors.textMuted} />
              <Text style={styles.metaText}>{formatDateOnly(analysis.plannedDate)}</Text>
            </View>
          </>
        )}
      </View>

      <View style={[styles.metaRow, styles.metaRowTight]}>
        <View style={styles.metaItem}>
          <IconBuildingWarehouse size={14} color={colors.textMuted} />
          <Text style={styles.metaText}>{analysis.oilLocation ?? "Aucune citerne"}</Text>
        </View>

        {analysis.oilCategory != null && <OilCategoryBadge category={analysis.oilCategory} />}
      </View>

      {/* Résultats */}
      <AnalysisStatsGrid
        stats={[
          { icon: IconWaveSquare, label: "Acidité", value: formatValue(analysis.acidityPercentage, 2, "%"), color: colors.gold[700] },
          { icon: IconFlame, label: "Peroxyde", value: formatValue(analysis.peroxideIndex, 1), color: colors.rust[600] },
          { icon: IconSun, label: "K232", value: formatValue(analysis.k232, 3), color: colors.teal[700] },
          { icon: IconSun, label: "K270", value: formatValue(analysis.k270, 3), color: colors.olive[700] },
        ]}
      />
    </ListItemCard>
  );
}

const styles = StyleSheet.create({
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  metaRowTight: {
    marginTop: spacing.xs,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
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
