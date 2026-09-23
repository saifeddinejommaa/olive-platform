import { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";

// TODO: remplace par le vrai type une fois confirmé.
import type { HarvestCostSummary } from "@olive-platform/core/features/harvests/domain/entities/HarvestCostSummary";
import { AddHarvestCostSheet } from "../components/AddHarvestCostSheet";



type Props = {
  harvestId: number;
  costs: HarvestCostSummary[];
  // TODO: brancher sur la vraie action d'ajout (ex: useHarvestDetailsStore().addCost)
  onAddCost: (params: { label: string; amount: number; date: string }) => Promise<void> | void;
  savingCost?: boolean;
};

export function HarvestCostsSection({
  costs,
  onAddCost,
  savingCost,
}: Props) {
  const [addOpen, setAddOpen] = useState(false);

  // TODO: "amount" à ajuster selon le nom réel du champ dans HarvestCostSummary
  const total = costs?.reduce((sum, c: any) => sum + c.amount, 0) ?? 0;

  return (
    <View style={styles.container}>
      <View style={styles.summary}>
        <Text style={styles.totalLabel}>Total des coûts</Text>
        <Text style={styles.totalValue}>{total.toLocaleString("fr-FR")} DT</Text>
      </View>

      <FlatList
        data={costs}
        keyExtractor={(item: any) => String(item.id)}
        scrollEnabled={false}
        ListEmptyComponent={
          <Text style={styles.empty}>Aucun coût enregistré pour l'instant.</Text>
        }
        renderItem={({ item }: any) => (
          <View style={styles.costRow}>
            <View>
              {/* TODO: ajuster les noms de champs à HarvestCostSummary réel */}
              <Text style={styles.costLabel}>{item.label}</Text>
              <Text style={styles.costDate}>
                {new Date(item.date).toLocaleDateString("fr-FR")}
              </Text>
            </View>
            <Text style={styles.costAmount}>
              {item.amount.toLocaleString("fr-FR")} DT
            </Text>
          </View>
        )}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => setAddOpen(true)}>
        <Text style={styles.addLabel}>+ Ajouter un coût</Text>
      </TouchableOpacity>

      <AddHarvestCostSheet
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
  costDate: { color: "#999", fontSize: 12, marginTop: 2 },
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
});
