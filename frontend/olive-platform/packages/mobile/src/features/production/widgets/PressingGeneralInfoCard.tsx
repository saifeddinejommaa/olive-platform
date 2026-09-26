import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

import { usePressingOperationDetailsStore } from "@olive-platform/core/features/production/stores/PressingOperationDetailsStore";
import { ProductionStatus } from "@olive-platform/core/features/production/domain/entities/ProductionStatus";

import { colors, semanticColors } from "../../../consts/Colors";
import { typography } from "../../../consts/Typography";
import { radius, shadow, spacing } from "../../../consts/spacing";
import { formatDate } from "@olive-platform/core/features/shared/utils/DatesUtils";
import { DatePickerField, safeParseDate } from "../../../widgets/DatePickerField";

type PressingParameters = {
  id: number;
  processTypeId: number | null;
  malaxingTemperatureC: number | null;
  malaxingDurationMinutes: number | null;
  malaxingSpeedRpm: number | null;
  feedRateKgH: number | null;
  decanterSpeedRpm: number | null;
  decanterDifferentialRpm: number | null;
  centrifugeSpeedRpm: number | null;
  addedWaterLiters: number | null;
  waterTemperatureC: number | null;
  waitingTimeBeforeExtractionMinutes: number | null;
  notes: string | null;
};

type Props = {
  operation: {
    id: number;
    operationNumber: string;
    status: ProductionStatus;
    plannedDate: string;
    oliveQuantityKg: number;
    oilQuantityLiters: number | null;
    expectedOilLiters: number | null;
    notes: string | null;
    parameters: PressingParameters | null;
  };
};

function numToStr(value: number | null) {
  return value != null ? String(value) : "";
}

export function PressingGeneralInfoCard({ operation }: Props) {
  const [isEditing, setIsEditing] = useState(false);

  const [plannedDate, setPlannedDate] = useState(
    safeParseDate(operation.plannedDate),
  );

  const [notes, setNotes] = useState(operation.notes ?? "");

  const { updateOperation, saving } = usePressingOperationDetailsStore();

  const isPlanned = operation.status === ProductionStatus.Planned;
  const isInProgress = operation.status === ProductionStatus.InProgress;

  const canEditDate = isPlanned;
  const canEdit = isPlanned || isInProgress;

  const resetFromOperation = () => {
    setPlannedDate(safeParseDate(operation.plannedDate));
    setNotes(operation.notes ?? "");
  };

  const handleEdit = () => {
    resetFromOperation();
    setIsEditing(true);
  };

  const handleCancel = () => {
    resetFromOperation();
    setIsEditing(false);
  };

  const handleSave = async () => {
    try {
      await updateOperation({
        id: operation.id,
        plannedDate: canEditDate
          ? plannedDate.toISOString()
          : operation.plannedDate,
        notes,
      });

      setIsEditing(false);
    } catch {
      Alert.alert("Erreur", "Impossible de mettre à jour les informations.");
    }
  };

  return (
    <View style={styles.card}>
      {/* N° d'opération */}
      <View style={styles.row}>
        <Text style={[typography.caption, styles.field]}>N° d'opération</Text>
        <Text style={[typography.bodyStrong, styles.value]}>
          {operation.operationNumber}
        </Text>
      </View>

      {/* Date de pressurage */}
      <View style={styles.row}>
        <Text style={[typography.caption, styles.field]}>
          Date de pressurage
        </Text>

        <DatePickerField
          value={plannedDate}
          editable={isEditing && canEditDate}
          onChange={setPlannedDate}
        />
      </View>

      {/* Quantité d'olives — dérivée des intrants, lecture seule */}
      <View style={styles.row}>
        <Text style={[typography.caption, styles.field]}>
          Quantité d'olives (kg)
        </Text>
        <Text style={[typography.bodyStrong, styles.value]}>
          {operation.oliveQuantityKg}
        </Text>
      </View>

      {/* Champs figés à la clôture */}
      {operation.oilQuantityLiters != null && (
        <View style={styles.row}>
          <Text style={[typography.caption, styles.field]}>
            Huile produite (L)
          </Text>
          <Text style={[typography.bodyStrong, styles.value]}>
            {operation.oilQuantityLiters}
          </Text>
        </View>
      )}

      {operation.expectedOilLiters != null && (
        <View style={styles.row}>
          <Text style={[typography.caption, styles.field]}>
            Rendement attendu (L)
          </Text>
          <Text style={[typography.bodyStrong, styles.value]}>
            {operation.expectedOilLiters}
          </Text>
        </View>
      )}

      {/* Notes */}
      <View style={styles.column}>
        <Text style={[typography.caption, styles.field]}>Notes</Text>

        {isEditing && canEdit ? (
          <TextInput
            style={[typography.body, styles.input, styles.multiline]}
            multiline
            value={notes}
            onChangeText={setNotes}
            placeholder="Ajouter une note..."
            placeholderTextColor={semanticColors.textMuted}
          />
        ) : (
          <Text style={[typography.body, styles.notesValue]}>
            {operation.notes || "—"}
          </Text>
        )}
      </View>

      {/* Paramètres de pressurage — lecture seule pour l'instant */}
      {operation.parameters && (
        <>
          <Text style={[typography.bodyStrong, styles.sectionTitle]}>
            Paramètres de pressurage
          </Text>

          <ParamReadOnlyRow label="Température malaxage (°C)" value={numToStr(operation.parameters.malaxingTemperatureC)} />
          <ParamReadOnlyRow label="Durée malaxage (min)" value={numToStr(operation.parameters.malaxingDurationMinutes)} />
          <ParamReadOnlyRow label="Vitesse malaxage (rpm)" value={numToStr(operation.parameters.malaxingSpeedRpm)} />
          <ParamReadOnlyRow label="Débit d'alimentation (kg/h)" value={numToStr(operation.parameters.feedRateKgH)} />
          <ParamReadOnlyRow label="Vitesse décanteur (rpm)" value={numToStr(operation.parameters.decanterSpeedRpm)} />
          <ParamReadOnlyRow label="Différentiel décanteur (rpm)" value={numToStr(operation.parameters.decanterDifferentialRpm)} />
          <ParamReadOnlyRow label="Vitesse centrifugeuse (rpm)" value={numToStr(operation.parameters.centrifugeSpeedRpm)} />
          <ParamReadOnlyRow label="Eau ajoutée (L)" value={numToStr(operation.parameters.addedWaterLiters)} />
          <ParamReadOnlyRow label="Température de l'eau (°C)" value={numToStr(operation.parameters.waterTemperatureC)} />
          <ParamReadOnlyRow
            label="Attente avant extraction (min)"
            value={numToStr(operation.parameters.waitingTimeBeforeExtractionMinutes)}
          />

          <View style={styles.column}>
            <Text style={[typography.caption, styles.field]}>Notes paramètres</Text>
            <Text style={[typography.body, styles.notesValue]}>
              {operation.parameters.notes || "—"}
            </Text>
          </View>
        </>
      )}

      {/* Actions */}
      {canEdit && (
        <View style={styles.actions}>
          {isEditing && (
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel} disabled={saving}>
              <Text style={[typography.bodyStrong, styles.cancelLabel]}>Annuler</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.editButton}
            onPress={isEditing ? handleSave : handleEdit}
            disabled={saving}
          >
            <Text style={[typography.bodyStrong, styles.editLabel]}>
              {saving ? "Enregistrement..." : isEditing ? "Enregistrer" : "Modifier"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

function ParamReadOnlyRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={[typography.caption, styles.field]}>{label}</Text>
      <Text style={[typography.bodyStrong, styles.value]}>{value || "—"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    gap: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.md,
  },
  column: { gap: spacing.sm },
  sectionTitle: {
    color: semanticColors.textPrimary,
    marginTop: spacing.xs,
  },
  field: {
    color: semanticColors.textSecondary,
    flexShrink: 1,
  },
  value: {
    color: semanticColors.textPrimary,
    textAlign: "right",
    flexShrink: 1,
  },
  input: {
    minWidth: 110,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: semanticColors.textPrimary,
    backgroundColor: colors.surface,
    textAlign: "right",
  },
  multiline: {
    minHeight: 80,
    textAlign: "left",
    textAlignVertical: "top",
  },
  notesValue: { color: semanticColors.textPrimary },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  cancelButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  cancelLabel: { color: semanticColors.textSecondary },
  editButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.sm,
    backgroundColor: semanticColors.primary,
  },
  editLabel: { color: semanticColors.onPrimary },
});