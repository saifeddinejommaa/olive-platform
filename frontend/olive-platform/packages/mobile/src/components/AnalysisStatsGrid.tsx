import type { ComponentType } from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "../consts/Colors";
import { radius, spacing } from "../consts/spacing";
import { typography } from "../consts/Typography";

export type AnalysisStat = {
  icon: ComponentType<{ size?: number; color?: string }>;
  label: string;
  // Valeur déjà formatée ; « — » si absente.
  value: string | null;
  color: string;
};

// Grille des résultats d'une analyse (même rendu pour l'olive et l'huile).
export function AnalysisStatsGrid({ stats }: { stats: AnalysisStat[] }) {
  return (
    <View style={styles.grid}>
      {stats.map(({ icon: Icon, label, value, color }) => (
        <View key={label} style={styles.cell}>
          <Icon size={16} color={color} />
          <View>
            <Text style={styles.label}>{label}</Text>
            <Text style={[styles.value, { color }]}>{value ?? "—"}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    gap: spacing.md,
  },
  cell: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    minWidth: "45%",
  },
  label: {
    ...typography.caption,
    color: colors.textMuted,
  },
  value: {
    ...typography.label,
    fontWeight: "600",
  },
});
