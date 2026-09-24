import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { IconPlus, IconTrash } from "@tabler/icons-react-native";

import { usePressingOperationDetailsStore } from "@olive-platform/core/features/production/stores/PressingOperationDetailsStore";
import { usePressingOperationInputsStore } from "@olive-platform/core/features/production/stores/PressingOperationInputsStore";
import { ProductionStatus } from "@olive-platform/core/features/production/domain/entities/ProductionStatus";

import { colors, semanticColors } from "../../../../consts/Colors";
import { typography } from "../../../../consts/Typography";
import { radius, shadow, spacing } from "../../../../consts/spacing";

type ExistingInput = {
  harvestId: number | null;
  purchaseItemId: number | null;
  quantityKg: number;
};

type Props = {
  operationId: number;
  status: ProductionStatus;
};

function inputLabel(input: ExistingInput) {
  // TODO: idéalement résoudre le vrai nom (référence récolte / achat)
  // via un lookup — pour l'instant on affiche juste la source.
  if (input.harvestId != null) return `Récolte #${input.harvestId}`;
  if (input.purchaseItemId != null) return `Achat #${input.purchaseItemId}`;
  return "Source inconnue";
}

export function PressingInputsCard({
  operationId,
  status,
}: Props) {
  const [isAdding, setIsAdding] = useState(false);
  const [newQuantityKg, setNewQuantityKg] = useState("");
  // TODO: à remplacer par un vrai sélecteur (récolte OU achat) plutôt
  // qu'un id brut, une fois qu'on sait comment les lister au clavier.
  const [newHarvestId, setNewHarvestId] = useState("");

  const { updateOperation, saving } = usePressingOperationDetailsStore();
  const { inputs,fetchInputs } = usePressingOperationInputsStore(); // ← à ajuster selon la vraie signature

  const isPlanned = status === ProductionStatus.Planned;
  const isInProgress = status === ProductionStatus.InProgress;
  const canEdit = isPlanned || isInProgress;

  const persistInputs = async (nextInputs: ExistingInput[]) => {
    try {
      await updateOperation({
        id: operationId,
        inputs: nextInputs.map((input) => ({
          harvestId: input.harvestId,
          purchaseItemId: input.purchaseItemId,
          quantityKg: input.quantityKg,
        })),
      });
    } catch {
      Alert.alert("Erreur", "Impossible de mettre à jour les intrants.");
    }
  };

  const handleAdd = async () => {
    const quantityKg = Number(newQuantityKg.replace(",", "."));
    const harvestId = Number(newHarvestId);

    if (!quantityKg || quantityKg <= 0 || !harvestId) return;

    const nextInputs = [
      ...inputs,
      { harvestId, purchaseItemId: null, quantityKg },
    ];

    await persistInputs(nextInputs);

    setNewQuantityKg("");
    setNewHarvestId("");
    setIsAdding(false);
  };

  const handleRemove = async (index: number) => {
    const nextInputs = inputs.filter((_, i) => i !== index);
    await persistInputs(nextInputs);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Intrants</Text>

      {inputs.length === 0 && (
        <Text style={styles.emptyText}>Aucun intrant enregistré.</Text>
      )}

      {inputs.map((input, index) => (
        <View
          key={`${input.harvestId ?? input.purchaseItemId}-${index}`}
          style={styles.row}
        >
          <View style={styles.rowMain}>
            <Text style={[typography.bodyStrong, styles.value]}>
              {inputLabel(input)}
            </Text>
            <Text style={[typography.caption, styles.field]}>
              {input.quantityKg.toLocaleString()} kg
            </Text>
          </View>

          {canEdit && (
            <TouchableOpacity
              onPress={() => handleRemove(index)}
              disabled={saving}
              style={styles.removeButton}
            >
              <IconTrash size={18} color={semanticColors.danger ?? "#C0392B"} />
            </TouchableOpacity>
          )}
        </View>
      ))}

      {canEdit && (
        <>
          {isAdding ? (
            <View style={styles.addForm}>
              <TextInput
                style={styles.input}
                placeholder="ID récolte"
                keyboardType="numeric"
                value={newHarvestId}
                onChangeText={setNewHarvestId}
              />
              <TextInput
                style={styles.input}
                placeholder="Quantité (kg)"
                keyboardType="numeric"
                value={newQuantityKg}
                onChangeText={setNewQuantityKg}
              />

              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setIsAdding(false)}
                  disabled={saving}
                >
                  <Text style={[typography.bodyStrong, styles.cancelLabel]}>
                    Annuler
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.editButton}
                  onPress={handleAdd}
                  disabled={saving}
                >
                  <Text style={[typography.bodyStrong, styles.editLabel]}>
                    {saving ? "Ajout..." : "Ajouter"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setIsAdding(true)}
            >
              <IconPlus size={18} color={semanticColors.primary} />
              <Text style={[typography.bodyStrong, styles.addLabel]}>
                Ajouter un intrant
              </Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  sectionTitle: {
    ...typography.bodyStrong,
    color: semanticColors.textPrimary,
  },
  emptyText: {
    ...typography.body,
    color: semanticColors.textMuted,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowMain: {
    flex: 1,
    gap: 2,
  },
  field: {
    color: semanticColors.textSecondary,
  },
  value: {
    color: semanticColors.textPrimary,
  },
  removeButton: {
    padding: spacing.xs,
  },
  addForm: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: semanticColors.textPrimary,
    backgroundColor: colors.surface,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingVertical: spacing.md,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: semanticColors.primary,
    marginTop: spacing.sm,
  },
  addLabel: {
    color: semanticColors.primary,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: spacing.sm,
  },
  cancelButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  cancelLabel: {
    color: semanticColors.textSecondary,
  },
  editButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.sm,
    backgroundColor: semanticColors.primary,
  },
  editLabel: {
    color: semanticColors.onPrimary,
  },
});