import { useEffect } from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { spacing } from "../../../../consts/spacing";
import { semanticColors } from "../../../../consts/Colors";
import { ProductionStatus } from "@olive-platform/core/features/production/domain/entities/ProductionStatus";
import { usePressingOperationInputsStore } from "@olive-platform/core/features/production/stores/PressingOperationInputsStore";

type Props = {
  operationId: number;
  status: ProductionStatus;
};

export function PressingInputsCard({ operationId, status }: Props) {
  const { fetchInputs, loading, inputs } = usePressingOperationInputsStore();

  useEffect(() => {
    fetchInputs(operationId);
  }, [operationId, fetchInputs]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={semanticColors.primary} />
      </View>
    );
  }

  if (!inputs || inputs.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>Aucun intrant enregistré</Text>
      </View>
    );
  }

  const totalKg = inputs.reduce((sum, i) => sum + i.quantityKg, 0);

  return (
    <View>
      {inputs.map((input) => (
        <View key={input.id} style={styles.row}>
          <View style={styles.rowHeader}>
            <Text style={styles.sourceLabel}>
              {input.sourceType === "harvest" ? "Récolte" : "Achat"}
              {" · "}
              {input.sourceReference}
            </Text>
            <Text style={styles.quantity}>{input.quantityKg.toFixed(1)} kg</Text>
          </View>

          {input.analysis && (
            <Text style={styles.analysisText}>
              Analyse : {input.analysis.oilPercentage != null
                ? `Rendement ${input.analysis.oilPercentage}%`
                : "disponible"}
            </Text>
          )}
        </View>
      ))}

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>{totalKg.toFixed(1)} kg</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    paddingVertical: spacing.lg,
    alignItems: "center",
  },
  emptyText: {
    color: semanticColors.textSecondary,
  },
  row: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: semanticColors.border,
  },
  rowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sourceLabel: {
    color: semanticColors.textPrimary,
    fontWeight: "600",
  },
  quantity: {
    color: semanticColors.textPrimary,
  },
  analysisText: {
    marginTop: spacing.xs,
    fontSize: 12,
    color: semanticColors.textSecondary,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: semanticColors.border,
  },
  totalLabel: {
    fontWeight: "600",
  },
  totalValue: {
    fontWeight: "700",
  },
});