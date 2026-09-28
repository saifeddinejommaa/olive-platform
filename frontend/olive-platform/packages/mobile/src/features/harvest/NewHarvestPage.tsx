import { useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";

import type { PlotForList } from "@olive-platform/core/features/plots/domain/entities/PlotForList";
import type { PlotVarietyDetail } from "@olive-platform/core/features/plots/domain/entities/PlotVarietyDetail";
import { GetPlotDetails } from "@olive-platform/core/features/plots/domain/usecases/GetPlotsDetails";
import { createHarvestUseCase } from "@olive-platform/core/features/harvests/domain/usecases/createHarvest";
import { toDateOnlyString } from "@olive-platform/core/features/shared/utils/DatesUtils";

import { Screen } from "../../components/Screen";
import { DetailsHeader } from "../../components/DetailsHeader";
import HarvestTypeSelector from "../../components/HarvestTypeSelector";
import { DatePickerField } from "../../widgets/DatePickerField";
import { PlotSelector } from "./components/new/PlotSelector";
import { useSeasonStore } from "../../stores/SeasonStore";
import { defaultDateInSeason, seasonDateRange } from "../../utils/seasonDates";
import { colors, semanticColors } from "../../consts/Colors";
import { typography } from "../../consts/Typography";
import { radius, shadow, spacing } from "../../consts/spacing";

// Valeur par défaut acceptée par l'API (1 = Manuelle).
const DEFAULT_HARVEST_TYPE = 1;

export function NewHarvestPage() {
  const selectedSeason = useSeasonStore((state) =>
    state.seasons.find((season) => season.id === state.selectedSeasonId),
  );
  const { minimumDate, maximumDate } = seasonDateRange(selectedSeason);

  const [plot, setPlot] = useState<PlotForList | null>(null);
  const [varieties, setVarieties] = useState<PlotVarietyDetail[]>([]);
  const [varietiesLoading, setVarietiesLoading] = useState(false);
  const [varietyId, setVarietyId] = useState<number | null>(null);

  const [plannedDate, setPlannedDate] = useState(() =>
    defaultDateInSeason(selectedSeason),
  );
  const [harvestType, setHarvestType] = useState(DEFAULT_HARVEST_TYPE);
  const [plannedTrees, setPlannedTrees] = useState("");
  const [notes, setNotes] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const selectedVariety = varieties.find(
    (variety) => variety.varietyId === varietyId,
  );
  const availableTrees = selectedVariety?.remainingTreesToHarvest ?? null;

  // Les variétés proposées sont celles de la parcelle choisie.
  const handlePlotChange = async (nextPlot: PlotForList) => {
    setPlot(nextPlot);
    setVarieties([]);
    setVarietyId(null);
    setPlannedTrees("");
    setError(null);
    setVarietiesLoading(true);

    try {
      const details = await GetPlotDetails(nextPlot.id);
      const plotVarieties = details.varieties ?? [];

      setVarieties(plotVarieties);

      // Une seule variété disponible : on la présélectionne.
      const harvestable = plotVarieties.filter(
        (variety) => variety.remainingTreesToHarvest > 0,
      );

      if (harvestable.length === 1) {
        selectVariety(harvestable[0]);
      }
    } catch {
      setError("Impossible de charger les variétés de la parcelle.");
    } finally {
      setVarietiesLoading(false);
    }
  };

  const selectVariety = (variety: PlotVarietyDetail) => {
    setVarietyId(variety.varietyId);
    // Proposé par défaut : tous les arbres restant à récolter.
    setPlannedTrees(String(variety.remainingTreesToHarvest));
    setError(null);
  };

  const validate = (): string | null => {
    if (!plot) return "La parcelle est obligatoire.";
    if (!varietyId) return "La variété est obligatoire.";
    if (!harvestType) return "Le type de récolte est obligatoire.";

    const trees = Number(plannedTrees.trim() || "0");

    if (!Number.isInteger(trees) || trees <= 0) {
      return "Le nombre d'arbres doit être supérieur à 0.";
    }

    if (availableTrees !== null && trees > availableTrees) {
      return `Le nombre d'arbres ne peut pas dépasser ${availableTrees}.`;
    }

    return null;
  };

  const handleSubmit = async () => {
    Keyboard.dismiss();

    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await createHarvestUseCase({
        plotId: plot!.id,
        varietyId: varietyId!,
        plannedTrees: Number(plannedTrees),
        plannedDate: toDateOnlyString(plannedDate),
        harvestType,
        notes: notes.trim() || null,
      });

      // La liste se recharge à son retour au premier plan.
      router.back();
    } catch (e: any) {
      setError(e?.message ?? "Impossible de créer la récolte.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <DetailsHeader title="Nouvelle récolte" onBack={() => router.back()} />

          <View style={styles.card}>
            {/* PARCELLE */}
            <Text style={styles.label}>Parcelle *</Text>
            <PlotSelector value={plot} onChange={handlePlotChange} />

            {/* VARIÉTÉ */}
            {plot && (
              <>
                <Text style={styles.label}>Variété *</Text>

                {varietiesLoading && (
                  <ActivityIndicator
                    style={styles.loader}
                    color={semanticColors.primary}
                  />
                )}

                {!varietiesLoading && varieties.length === 0 && (
                  <Text style={styles.hint}>
                    Aucune variété enregistrée pour cette parcelle.
                  </Text>
                )}

                {!varietiesLoading && varieties.length > 0 && (
                  <View style={styles.varieties}>
                    {varieties.map((variety) => {
                      const selected = variety.varietyId === varietyId;
                      const exhausted = variety.remainingTreesToHarvest <= 0;

                      return (
                        <Pressable
                          key={variety.varietyId}
                          disabled={exhausted}
                          onPress={() => selectVariety(variety)}
                          style={[
                            styles.variety,
                            selected && styles.varietySelected,
                            exhausted && styles.varietyDisabled,
                          ]}
                        >
                          <Text
                            style={[
                              typography.bodyStrong,
                              styles.varietyLabel,
                              selected && styles.varietyLabelSelected,
                            ]}
                          >
                            {variety.varietyLabel}
                          </Text>
                          <Text style={[typography.caption, styles.varietyMeta]}>
                            {exhausted
                              ? "Tous les arbres sont récoltés"
                              : `${variety.remainingTreesToHarvest} / ${variety.numberOfTrees} arbres disponibles`}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                )}
              </>
            )}

            {/* DATE */}
            <Text style={styles.label}>Date de récolte *</Text>
            <DatePickerField
              value={plannedDate}
              editable
              minimumDate={minimumDate}
              maximumDate={maximumDate}
              onChange={(date) => {
                setPlannedDate(date);
                setError(null);
              }}
            />

            {/* TYPE */}
            <Text style={styles.label}>Type de récolte *</Text>
            <HarvestTypeSelector
              value={harvestType}
              onChange={(value) => {
                if (value !== null) {
                  setHarvestType(value);
                  setError(null);
                }
              }}
            />

            {/* ARBRES */}
            <Text style={styles.label}>Nombre d&apos;arbres à récolter *</Text>
            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              placeholder="0"
              placeholderTextColor={colors.textMuted}
              value={plannedTrees}
              onChangeText={(value) => {
                setPlannedTrees(value);
                setError(null);
              }}
            />
            {availableTrees !== null && (
              <Text style={styles.hint}>
                {availableTrees} arbres disponibles pour la récolte
              </Text>
            )}

            {/* NOTES */}
            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={[styles.input, styles.notes]}
              placeholder="Notes concernant la récolte..."
              placeholderTextColor={colors.textMuted}
              value={notes}
              onChangeText={setNotes}
              multiline
            />
          </View>

          {error && <Text style={styles.error}>{error}</Text>}

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.cancel}
              onPress={() => router.back()}
              disabled={saving}
            >
              <Text style={[typography.bodyStrong, styles.cancelLabel]}>
                Annuler
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.confirm, saving && styles.confirmDisabled]}
              onPress={handleSubmit}
              disabled={saving}
            >
              <Text style={[typography.bodyStrong, styles.confirmLabel]}>
                {saving ? "Création..." : "Créer la récolte"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    ...shadow.card,
  },

  label: {
    ...typography.label,
    color: semanticColors.textSecondary,
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },

  loader: {
    paddingVertical: spacing.md,
  },

  hint: {
    ...typography.caption,
    color: semanticColors.textSecondary,
    marginTop: spacing.xs,
  },

  varieties: {
    gap: spacing.sm,
  },

  variety: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },

  varietySelected: {
    borderColor: colors.olive[500],
    backgroundColor: colors.olive[100],
  },

  varietyDisabled: {
    opacity: 0.5,
  },

  varietyLabel: {
    color: semanticColors.textPrimary,
  },

  varietyLabelSelected: {
    color: colors.olive[800],
  },

  varietyMeta: {
    color: semanticColors.textSecondary,
    marginTop: 2,
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
    minHeight: 90,
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
    marginTop: spacing.lg,
  },

  cancel: {
    flex: 1,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
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
