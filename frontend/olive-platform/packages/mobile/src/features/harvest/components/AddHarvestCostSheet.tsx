import { useEffect, useMemo, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import type { AddHarvestCostLineParams } from "@olive-platform/core/features/harvests/domain/params/AddHarvestCostLineParams";
import { CostLineType } from "@olive-platform/core/features/payments/domain/entities/CostLineType";
import { toDateOnlyString } from "@olive-platform/core/features/shared/utils/DatesUtils";
import { useConstantsStore } from "../../../stores/ConstantsStore";
import { useSeasonStore } from "../../../stores/SeasonStore";
import { WorkerNameField } from "./WorkerNameField";
import { defaultDateInSeason } from "../../../utils/seasonDates";
import { colors, semanticColors } from "../../../consts/Colors";
import { typography } from "../../../consts/Typography";
import { radius, shadow, spacing } from "../../../consts/spacing";

type Props = {
  visible: boolean;
  saving?: boolean;
  onClose: () => void;
  onConfirm: (params: AddHarvestCostLineParams) => Promise<void> | void;
};

type Form = {
  typeId: CostLineType | null;
  workerName: string;
  // Non affiché : repris de l'ouvrier suggéré sélectionné.
  workerIdentifier: string;
  amount: string;
  notes: string;
};

const emptyForm = (): Form => ({
  typeId: CostLineType.MainOeuvre,
  workerName: "",
  workerIdentifier: "",
  amount: "",
  notes: "",
});

const parseAmount = (value: string) => Number(value.replace(",", ".").trim());

export function AddHarvestCostSheet({
  visible,
  saving,
  onClose,
  onConfirm,
}: Props) {
  const { Appconstants, fetchConstants } = useConstantsStore();
  const selectedSeason = useSeasonStore((state) =>
    state.seasons.find((season) => season.id === state.selectedSeasonId),
  );
  const [form, setForm] = useState<Form>(emptyForm);
  const [error, setError] = useState<string | null>(null);

  // Le formulaire est réinitialisé par le parent (key) à chaque ouverture.
  useEffect(() => {
    fetchConstants();
  }, [fetchConstants]);

  // Les achats d'olives ne sont pas des coûts de récolte.
  const costTypes = useMemo(
    () =>
      Appconstants.costLineTypes.filter(
        (type) => type.id !== CostLineType.OlivePurchase,
      ),
    [Appconstants.costLineTypes],
  );

  const isLabour = form.typeId === CostLineType.MainOeuvre;

  const update = <K extends keyof Form>(field: K, value: Form[K]) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setError(null);
  };

  const validate = (): string | null => {
    if (!form.typeId) return "Sélectionnez un type de coût.";

    const amount = parseAmount(form.amount);
    if (!form.amount.trim() || Number.isNaN(amount) || amount <= 0) {
      return "Le montant doit être supérieur à 0.";
    }

    if (isLabour && !form.workerName.trim()) {
      return "Le nom de l'ouvrier est obligatoire pour la main d'œuvre.";
    }

    return null;
  };

  const handleConfirm = async () => {
    Keyboard.dismiss();

    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      await onConfirm({
        typeId: form.typeId!,
        date: toDateOnlyString(defaultDateInSeason(selectedSeason)),
        totalAmount: parseAmount(form.amount),
        workerName: form.workerName.trim() || undefined,
        workerIdentifier: form.workerIdentifier.trim() || undefined,
        isPaid: false,
        notes: form.notes.trim() || undefined,
      });
    } catch (e: any) {
      setError(e?.message ?? "Impossible d'ajouter le coût.");
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.modalContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.sheet}>
          <View style={styles.handle} />

          <Text style={[typography.h2, styles.title]}>Ajouter un coût</Text>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* TYPE */}
            <Text style={styles.label}>Type de coût *</Text>
            <View style={styles.chips}>
              {costTypes.map((type) => {
                const selected = form.typeId === type.id;

                return (
                  <Pressable
                    key={type.id}
                    onPress={() => update("typeId", type.id as CostLineType)}
                    style={[styles.chip, selected && styles.chipSelected]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selected && styles.chipTextSelected,
                      ]}
                    >
                      {type.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* OUVRIER */}
            <Text style={styles.label}>
              Ouvrier{isLabour ? " *" : ""}
            </Text>
            <WorkerNameField
              value={form.workerName}
              onChangeText={(value) =>
                setForm((previous) => ({
                  ...previous,
                  workerName: value,
                  // Nom modifié à la main : ce n'est plus l'ouvrier suggéré.
                  workerIdentifier: "",
                }))
              }
              onSelect={(worker) =>
                setForm((previous) => ({
                  ...previous,
                  workerName: worker.workerName,
                  workerIdentifier: worker.workerIdentifier ?? "",
                }))
              }
            />

            {/* MONTANT */}
            <Text style={styles.label}>Montant (DT) *</Text>
            <TextInput
              style={styles.input}
              placeholder="0,000"
              placeholderTextColor={colors.textMuted}
              keyboardType="decimal-pad"
              value={form.amount}
              onChangeText={(value) => update("amount", value)}
            />

            {/* NOTES */}
            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={[styles.input, styles.notes]}
              placeholder="Informations complémentaires"
              placeholderTextColor={colors.textMuted}
              value={form.notes}
              onChangeText={(value) => update("notes", value)}
              multiline
            />
          </ScrollView>

          {/* Hors du ScrollView : toujours visible, même clavier ouvert. */}
          {error && <Text style={styles.error}>{error}</Text>}

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancel} onPress={onClose}>
              <Text style={[typography.bodyStrong, styles.cancelLabel]}>
                Annuler
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.confirm, saving && styles.confirmDisabled]}
              onPress={handleConfirm}
              disabled={saving}
            >
              <Text style={[typography.bodyStrong, styles.confirmLabel]}>
                {saving ? "Ajout..." : "Ajouter"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },

  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
  },

  sheet: {
    maxHeight: "90%",
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
    ...shadow.raised,
  },

  handle: {
    width: 40,
    height: 4,
    alignSelf: "center",
    borderRadius: radius.pill,
    backgroundColor: colors.border,
    marginBottom: spacing.lg,
  },

  title: {
    color: semanticColors.textPrimary,
    marginBottom: spacing.md,
  },

  scroll: {
    flexGrow: 0,
  },

  content: {
    paddingBottom: spacing.md,
  },

  label: {
    ...typography.label,
    color: semanticColors.textSecondary,
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },

  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },

  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },

  chipSelected: {
    borderColor: colors.olive[500],
    backgroundColor: colors.olive[100],
  },

  chipText: {
    ...typography.caption,
    color: semanticColors.textSecondary,
  },

  chipTextSelected: {
    color: colors.olive[800],
  },

  input: {
    ...typography.body,
    minHeight: 46,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    color: semanticColors.textPrimary,
  },

  notes: {
    minHeight: 80,
    textAlignVertical: "top",
  },

  error: {
    ...typography.caption,
    color: semanticColors.danger,
    marginTop: spacing.lg,
  },

  actions: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.md,
  },

  cancel: {
    flex: 1,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
    backgroundColor: colors.background,
  },

  cancelLabel: {
    color: semanticColors.textSecondary,
  },

  confirm: {
    flex: 1,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
    backgroundColor: semanticColors.primary,
  },

  confirmDisabled: {
    opacity: 0.6,
  },

  confirmLabel: {
    color: colors.white,
  },
});
