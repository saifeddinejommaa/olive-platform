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

type ParamKey = Exclude<keyof PressingParameters, "id" | "processTypeId" | "notes">;

// Réglages saisis dans la configuration de pression.
const PARAM_FIELDS: { key: ParamKey; label: string }[] = [
  { key: "malaxingTemperatureC", label: "Température malaxage (°C)" },
  { key: "malaxingDurationMinutes", label: "Durée malaxage (min)" },
  { key: "malaxingSpeedRpm", label: "Vitesse malaxage (rpm)" },
  { key: "feedRateKgH", label: "Débit d'alimentation (kg/h)" },
  { key: "decanterSpeedRpm", label: "Vitesse décanteur (rpm)" },
  { key: "decanterDifferentialRpm", label: "Différentiel décanteur (rpm)" },
  { key: "centrifugeSpeedRpm", label: "Vitesse centrifugeuse (rpm)" },
  { key: "addedWaterLiters", label: "Eau ajoutée (L)" },
  { key: "waterTemperatureC", label: "Température de l'eau (°C)" },
  { key: "waitingTimeBeforeExtractionMinutes", label: "Attente avant extraction (min)" },
];

type ParamValues = Record<ParamKey, string>;

const paramsToValues = (parameters: PressingParameters | null): ParamValues =>
  Object.fromEntries(
    PARAM_FIELDS.map((field) => [field.key, numToStr(parameters?.[field.key] ?? null)]),
  ) as ParamValues;

// "12,5" -> 12.5 ; vide -> null ; invalide -> NaN.
const parseParam = (value: string) => {
  const trimmed = value.trim().replace(",", ".");
  return trimmed === "" ? null : Number(trimmed);
};

export function PressingGeneralInfoCard({ operation }: Props) {
  const [isEditing, setIsEditing] = useState(false);

  const [plannedDate, setPlannedDate] = useState(
    safeParseDate(operation.plannedDate),
  );

  const [notes, setNotes] = useState(operation.notes ?? "");

  const [paramValues, setParamValues] = useState<ParamValues>(() =>
    paramsToValues(operation.parameters),
  );
  const [paramNotes, setParamNotes] = useState(operation.parameters?.notes ?? "");

  const { updateOperation, saving } = usePressingOperationDetailsStore();

  const isPlanned = operation.status === ProductionStatus.Planned;
  const isInProgress = operation.status === ProductionStatus.InProgress;

  const canEditDate = isPlanned;
  const canEdit = isPlanned || isInProgress;
  // La configuration se saisit pendant la pression.
  const canEditParameters = isInProgress;

  const resetFromOperation = () => {
    setPlannedDate(safeParseDate(operation.plannedDate));
    setNotes(operation.notes ?? "");
    setParamValues(paramsToValues(operation.parameters));
    setParamNotes(operation.parameters?.notes ?? "");
  };

  const handleEdit = () => {
    resetFromOperation();
    setIsEditing(true);
  };

  const handleCancel = () => {
    resetFromOperation();
    setIsEditing(false);
  };

  // Réglages saisis, ou null si une valeur est invalide (négative ou non numérique).
  const buildParameters = () => {
    const values = Object.fromEntries(
      PARAM_FIELDS.map((field) => [field.key, parseParam(paramValues[field.key])]),
    ) as Record<ParamKey, number | null>;

    const invalid = PARAM_FIELDS.find((field) => {
      const value = values[field.key];
      return value !== null && (Number.isNaN(value) || value < 0);
    });

    if (invalid) {
      Alert.alert("Configuration", `Valeur invalide : ${invalid.label}.`);
      return null;
    }

    return {
      ...values,
      processTypeId: operation.parameters?.processTypeId ?? null,
      notes: paramNotes.trim() || null,
    };
  };

  const handleSave = async () => {
    const parameters = canEditParameters ? buildParameters() : undefined;
    if (parameters === null) return;

    try {
      await updateOperation({
        id: operation.id,
        plannedDate: canEditDate
          ? plannedDate.toISOString()
          : operation.plannedDate,
        notes,
        parameters,
      });

      setIsEditing(false);
    } catch (e: any) {
      Alert.alert(
        "Erreur",
        e?.message ?? "Impossible de mettre à jour les informations.",
      );
    }
  };

  return (
    <View style={styles.card}>
      {/* N° d'opération */}
      <View style={styles.row}>
        <Text style={[typography.caption, styles.field]}>N° d&apos;opération</Text>
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
          Quantité d&apos;olives (kg)
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

      {/* Configuration de pression : saisie pendant la pression, obligatoire à la clôture */}
      <Text style={[typography.bodyStrong, styles.sectionTitle]}>
        Configuration de pression
      </Text>

      {isPlanned && (
        <Text style={[typography.caption, styles.hint]}>
          La configuration se saisit une fois la pression lancée.
        </Text>
      )}

      {!isPlanned && isEditing && canEditParameters && (
        <>
          {PARAM_FIELDS.map((field) => (
            <View key={field.key} style={styles.row}>
              <Text style={[typography.caption, styles.field]}>{field.label}</Text>
              <TextInput
                style={[typography.bodyStrong, styles.input]}
                keyboardType="decimal-pad"
                placeholder="—"
                placeholderTextColor={semanticColors.textMuted}
                value={paramValues[field.key]}
                onChangeText={(value) =>
                  setParamValues((current) => ({ ...current, [field.key]: value }))
                }
              />
            </View>
          ))}

          <View style={styles.column}>
            <Text style={[typography.caption, styles.field]}>Notes configuration</Text>
            <TextInput
              style={[typography.body, styles.input, styles.multiline]}
              multiline
              value={paramNotes}
              onChangeText={setParamNotes}
              placeholder="Ajouter une note..."
              placeholderTextColor={semanticColors.textMuted}
            />
          </View>
        </>
      )}

      {!isPlanned && !(isEditing && canEditParameters) && (
        operation.parameters ? (
          <>
            {PARAM_FIELDS.map((field) => (
              <ParamReadOnlyRow
                key={field.key}
                label={field.label}
                value={numToStr(operation.parameters?.[field.key] ?? null)}
              />
            ))}

            <View style={styles.column}>
              <Text style={[typography.caption, styles.field]}>Notes configuration</Text>
              <Text style={[typography.body, styles.notesValue]}>
                {operation.parameters.notes || "—"}
              </Text>
            </View>
          </>
        ) : (
          <Text style={[typography.caption, styles.hint]}>
            {isInProgress
              ? "Aucune configuration : touchez « Modifier » pour la saisir (obligatoire avant la clôture)."
              : "Aucune configuration de pression."}
          </Text>
        )
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
  hint: { color: semanticColors.textSecondary },
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