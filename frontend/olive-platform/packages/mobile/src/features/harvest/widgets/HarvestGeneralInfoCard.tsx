import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { IconCalendarEvent } from "@tabler/icons-react-native";

import { useHarvestDetailsStore } from "@olive-platform/core/features/harvests/stores/HarvestDetailsStore";
import { ProductionStatus } from "@olive-platform/core/features/production/domain/entities/ProductionStatus";


import { colors, semanticColors } from "../../../consts/Colors";
import { typography } from "../../../consts/Typography";
import { radius, shadow, spacing } from "../../../consts/spacing";

import HarvestTypeSelector from "../../../components/HarvestTypeSelector";
import { useConstantsStore } from "../../../stores/ConstantsStore";

type Props = {
  harvest: {
    id: number;
    reference: string;
    status: ProductionStatus;
    plannedDate?: string | null;
    plannedTrees: number;
    notes?: string | null;
    harvestType: number;
  };
};

function formatDate(value?: string | null) {
  if (!value) {
    return "—";
  }

  return new Date(value).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function HarvestGeneralInfoCard({
  harvest,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);

  const [plannedDate, setPlannedDate] = useState(
    harvest.plannedDate
      ? new Date(harvest.plannedDate)
      : new Date(),
  );

  const [showDatePicker, setShowDatePicker] =
    useState(false);

  const [plannedTrees, setPlannedTrees] = useState(
    String(harvest.plannedTrees ?? ""),
  );

  const [notes, setNotes] = useState(
    harvest.notes ?? "",
  );

  const [harvestType, setHarvestType] =
    useState<number>(harvest.harvestType);

  const {update, saving} = useHarvestDetailsStore();

  const { Appconstants } = useConstantsStore();

  const harvestTypes = Appconstants.harvestTypes;

  const selectedHarvestType = harvestTypes.find(
    (type) => type.id === harvest.harvestType,
  );

  const isPlanned =
    harvest.status === ProductionStatus.Planned;

  const isInProgress =
    harvest.status === ProductionStatus.InProgress;

  const canEdit = isPlanned || isInProgress;

  const handleEdit = () => {
    setPlannedDate(
      harvest.plannedDate
        ? new Date(harvest.plannedDate)
        : new Date(),
    );

    setPlannedTrees(
      String(harvest.plannedTrees ?? ""),
    );

    setNotes(harvest.notes ?? "");

    setHarvestType(harvest.harvestType);

    setIsEditing(true);
  };

  const handleCancel = () => {
    setPlannedDate(
      harvest.plannedDate
        ? new Date(harvest.plannedDate)
        : new Date(),
    );

    setPlannedTrees(
      String(harvest.plannedTrees ?? ""),
    );

    setNotes(harvest.notes ?? "");

    setHarvestType(harvest.harvestType);

    setIsEditing(false);
    setShowDatePicker(false);
  };

  const handleSave = async () => {
    try {

      if (isPlanned) {
        await update(harvest.id, {
          plannedDate: plannedDate.toISOString(),
          plannedTrees: Number(plannedTrees) || 0,
          harvestType,
          notes,
        });
      }

      if (isInProgress) {
        await update(harvest.id, {
          notes,
        });
      }

      setIsEditing(false);
      setShowDatePicker(false);
    } catch {
      Alert.alert(
        "Erreur",
        "Impossible de mettre à jour les informations.",
      );
    }
  };

  const handleDateChange = (
    _event: any,
    selectedDate?: Date,
  ) => {
    setShowDatePicker(Platform.OS === "ios");

    if (selectedDate) {
      setPlannedDate(selectedDate);
    }
  };

  return (
    <View style={styles.card}>
      {/* Référence */}
      <View style={styles.row}>
        <Text
          style={[
            typography.caption,
            styles.field,
          ]}
        >
          Référence
        </Text>

        <Text
          style={[
            typography.bodyStrong,
            styles.value,
          ]}
        >
          {harvest.reference}
        </Text>
      </View>

      {/* Date */}
      <View style={styles.row}>
        <Text
          style={[
            typography.caption,
            styles.field,
          ]}
        >
          Date de récolte
        </Text>

        {isEditing && isPlanned ? (
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <IconCalendarEvent
              size={18}
              color={semanticColors.primary}
            />

            <Text
              style={[
                typography.bodyStrong,
                styles.dateValue,
              ]}
            >
              {formatDate(
                plannedDate.toISOString(),
              )}
            </Text>
          </TouchableOpacity>
        ) : (
          <Text
            style={[
              typography.bodyStrong,
              styles.value,
            ]}
          >
            {formatDate(harvest.plannedDate)}
          </Text>
        )}
      </View>

      {/* Date picker */}
      {isEditing &&
        isPlanned &&
        showDatePicker && (
          <DateTimePicker
            value={plannedDate}
            mode="date"
            display={
              Platform.OS === "ios"
                ? "spinner"
                : "default"
            }
            onChange={handleDateChange}
          />
        )}

      {/* Type de récolte */}
      <View style={styles.row}>
        <Text
          style={[
            typography.caption,
            styles.field,
          ]}
        >
          Type de récolte
        </Text>

        {isEditing && isPlanned ? (
          <View style={styles.selectorContainer}>
            <HarvestTypeSelector
              value={harvestType}
              onChange={(value) => {
                if (value !== null) {
                  setHarvestType(value);
                }
              }}
            />
          </View>
        ) : (
          <Text
            style={[
              typography.bodyStrong,
              styles.value,
            ]}
          >
            {selectedHarvestType?.label ?? "—"}
          </Text>
        )}
      </View>

      {/* Arbres prévus */}
      <View style={styles.row}>
        <Text
          style={[
            typography.caption,
            styles.field,
          ]}
        >
          Arbres prévus
        </Text>

        {isEditing && isPlanned ? (
          <TextInput
            style={[
              typography.body,
              styles.input,
            ]}
            keyboardType="numeric"
            value={plannedTrees}
            onChangeText={setPlannedTrees}
          />
        ) : (
          <Text
            style={[
              typography.bodyStrong,
              styles.value,
            ]}
          >
            {harvest.plannedTrees}
          </Text>
        )}
      </View>

      {/* Notes */}
      <View style={styles.column}>
        <Text
          style={[
            typography.caption,
            styles.field,
          ]}
        >
          Notes
        </Text>

        {isEditing && canEdit ? (
          <TextInput
            style={[
              typography.body,
              styles.input,
              styles.multiline,
            ]}
            multiline
            value={notes}
            onChangeText={setNotes}
            placeholder="Ajouter une note..."
            placeholderTextColor={
              semanticColors.textMuted
            }
          />
        ) : (
          <Text
            style={[
              typography.body,
              styles.notesValue,
            ]}
          >
            {harvest.notes || "—"}
          </Text>
        )}
      </View>

      {/* Actions */}
      {canEdit && (
        <View style={styles.actions}>
          {isEditing && (
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCancel}
              disabled={saving}
            >
              <Text
                style={[
                  typography.bodyStrong,
                  styles.cancelLabel,
                ]}
              >
                Annuler
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.editButton}
            onPress={
              isEditing
                ? handleSave
                : handleEdit
            }
            disabled={saving}
          >
            <Text
              style={[
                typography.bodyStrong,
                styles.editLabel,
              ]}
            >
              {saving
                ? "Enregistrement..."
                : isEditing
                  ? "Enregistrer"
                  : "Modifier"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
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

  column: {
    gap: spacing.sm,
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

  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },

  dateValue: {
    color: semanticColors.primary,
  },

  selectorContainer: {
    flex: 1,
    maxWidth: 220,
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

  notesValue: {
    color: semanticColors.textPrimary,
  },

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