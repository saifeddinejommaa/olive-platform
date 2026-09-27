import { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import type { HarvestCostSummary } from "@olive-platform/core/features/harvests/domain/entities/HarvestCostSummary";
import type { AddHarvestCostLineParams } from "@olive-platform/core/features/harvests/domain/params/AddHarvestCostLineParams";
import { useConstantsStore } from "../../../stores/ConstantsStore";
import { AddHarvestCostSheet } from "../components/AddHarvestCostSheet";

type Props = {
  harvestId: number;
  costs: HarvestCostSummary[];
  onAddCost: (params: AddHarvestCostLineParams) => Promise<void> | void;
  savingCost?: boolean;
  canAddCost?: boolean;
  // Affiché à la place du bouton quand l'ajout n'est pas possible.
  addCostDisabledMessage?: string;
};

const formatAmount = (value: number) =>
  value.toLocaleString("fr-FR", { maximumFractionDigits: 3 });

export function HarvestCostsSection({
  costs,
  onAddCost,
  savingCost,
  canAddCost = true,
  addCostDisabledMessage,
}: Props) {
  const [addOpen, setAddOpen] = useState(false);
  // Nouvelle clé à chaque ouverture : la feuille repart d'un formulaire vide.
  const [sheetKey, setSheetKey] = useState(0);

  const openSheet = () => {
    setSheetKey((key) => key + 1);
    setAddOpen(true);
  };
  const { Appconstants } = useConstantsStore();

  const total = costs?.reduce((sum, cost) => sum + cost.totalAmount, 0) ?? 0;

  const typeLabel = (typeId: number) =>
    Appconstants.costLineTypes.find((type) => type.id === typeId)?.label ??
    "Autre";

  return (
    <View style={styles.container}>
      <View style={styles.summary}>
        <Text style={styles.totalLabel}>Total des coûts</Text>
        <Text style={styles.totalValue}>{formatAmount(total)} DT</Text>
      </View>

      {!costs?.length ? (
        <Text style={styles.empty}>{"Aucun coût enregistré pour l'instant."}</Text>
      ) : (
        costs.map((cost) => (
          <View key={cost.costLineTypeId} style={styles.costRow}>
            <Text style={styles.costLabel}>{typeLabel(cost.costLineTypeId)}</Text>
            <Text style={styles.costAmount}>
              {formatAmount(cost.totalAmount)} DT
            </Text>
          </View>
        ))
      )}

      {canAddCost ? (
        <TouchableOpacity style={styles.addButton} onPress={openSheet}>
          <Text style={styles.addLabel}>+ Ajouter un coût</Text>
        </TouchableOpacity>
      ) : (
        addCostDisabledMessage && (
          <Text style={styles.disabledHint}>{addCostDisabledMessage}</Text>
        )
      )}

      <AddHarvestCostSheet
        key={sheetKey}
        visible={addOpen}
        saving={savingCost}
        onClose={() => setAddOpen(false)}
        onConfirm={async (params) => {
          await onAddCost(params);
          setAddOpen(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  summary: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#F7F7F7",
    padding: 12,
    borderRadius: 8,
  },
  totalLabel: { color: "#666" },
  totalValue: { fontWeight: "700", fontSize: 16 },
  costRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  costLabel: { fontWeight: "500" },
  costAmount: { fontWeight: "600" },
  empty: { color: "#999", textAlign: "center", paddingVertical: 20 },
  addButton: {
    borderWidth: 1,
    borderColor: "#2E7D32",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  addLabel: { color: "#2E7D32", fontWeight: "600" },
  disabledHint: {
    color: "#777",
    textAlign: "center",
    paddingVertical: 10,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#DDD",
    borderRadius: 8,
  },
});
