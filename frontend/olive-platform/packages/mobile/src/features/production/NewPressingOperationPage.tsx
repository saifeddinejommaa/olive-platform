import { useEffect, useState } from "react";
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
import { IconPlus } from "@tabler/icons-react-native";

import { CreatePressingOperation } from "@olive-platform/core/features/production/domain/useCases/CreatePressingOperation";
import { ProductionStatus } from "@olive-platform/core/features/production/domain/entities/ProductionStatus";
import type { CreatePressingOperationInputParams } from "@olive-platform/core/features/production/domain/params/CreatePressingOperationInputParams";
import { GetHarvestDetails } from "@olive-platform/core/features/harvests/domain/usecases/GetHarvestDetails";

import { Screen } from "../../components/Screen";
import { DetailsHeader } from "../../components/DetailsHeader";
import { DatePickerField } from "../../widgets/DatePickerField";
import {
  PressingSourceCard,
  type PressingSourceBlock,
} from "./component/new/PressingSourceCard";
import { useSeasonStore } from "../../stores/SeasonStore";
import { defaultDateInSeason, seasonDateRange } from "../../utils/seasonDates";
import { colors, semanticColors } from "../../consts/Colors";
import { typography } from "../../consts/Typography";
import { radius, shadow, spacing } from "../../consts/spacing";

let blockCounter = 0;

const newBlock = (): PressingSourceBlock => ({
  key: `source-${++blockCounter}`,
  sourceType: "harvest",
  source: null,
  lots: [],
  selectedLotIds: [],
});

const formatKg = (value: number) => `${value.toLocaleString("fr-FR")} kg`;

type Props = {
  // Récolte présélectionnée (« Lancer la pression » du détail d'une récolte).
  initialHarvestId?: number;
};

export function NewPressingOperationPage({ initialHarvestId }: Props) {
  const selectedSeason = useSeasonStore((state) =>
    state.seasons.find((season) => season.id === state.selectedSeasonId),
  );
  const { minimumDate, maximumDate } = seasonDateRange(selectedSeason);

  const [plannedDate, setPlannedDate] = useState(() =>
    defaultDateInSeason(selectedSeason),
  );
  const [blocks, setBlocks] = useState<PressingSourceBlock[]>(() => [newBlock()]);
  const [notes, setNotes] = useState("");
  const [preparing, setPreparing] = useState(!!initialHarvestId);

  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Récolte présélectionnée : le premier bloc la reprend, ses lots pressables cochés.
  useEffect(() => {
    if (!initialHarvestId) return;

    let cancelled = false;

    GetHarvestDetails(initialHarvestId)
      .then((harvest) => {
        if (cancelled) return;

        setBlocks([
          {
            ...newBlock(),
            sourceType: "harvest",
            source: {
              id: initialHarvestId,
              reference: harvest.reference,
              subtitle: "Récolte",
            },
            autoSelect: true,
          },
        ]);
      })
      .catch(() => {
        if (!cancelled) setError("Impossible de charger la récolte sélectionnée.");
      })
      .finally(() => {
        if (!cancelled) setPreparing(false);
      });

    return () => {
      cancelled = true;
    };
  }, [initialHarvestId]);

  // Une entrée de pression par lot coché, pour tout son restant.
  const inputs: CreatePressingOperationInputParams[] = blocks.flatMap((block) =>
    block.lots
      .filter((lot) => block.selectedLotIds.includes(lot.id))
      .map((lot) => ({ lotId: lot.id, quantityKg: lot.remainingKg })),
  );
  const totalKg = inputs.reduce((total, input) => total + (input.quantityKg ?? 0), 0);

  const updateBlock = (block: PressingSourceBlock) => {
    setBlocks((current) =>
      current.map((item) => (item.key === block.key ? block : item)),
    );
    setError(null);
  };

  const removeBlock = (key: string) => {
    setBlocks((current) => current.filter((item) => item.key !== key));
  };

  // Une même récolte / un même achat n'est choisi qu'une fois.
  const excludedSourceIds = (block: PressingSourceBlock) =>
    blocks
      .filter(
        (item) =>
          item.key !== block.key &&
          item.sourceType === block.sourceType &&
          item.source,
      )
      .map((item) => item.source!.id);

  const validate = (): string | null => {
    if (blocks.some((block) => !block.source)) {
      return "Sélectionnez une source pour chaque bloc.";
    }

    if (blocks.some((block) => block.selectedLotIds.length === 0)) {
      return "Sélectionnez au moins un lot pour chaque source.";
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
      const date = new Date(plannedDate);
      date.setHours(0, 0, 0, 0);

      await CreatePressingOperation({
        plannedDate: date.toISOString(),
        // Une nouvelle opération est toujours planifiée.
        status: ProductionStatus.Planned,
        startTime: null,
        endTime: null,
        oliveQuantityKg: totalKg,
        oilQuantityLiters: null,
        notes: notes.trim() || null,
        inputs,
      });

      // La liste se recharge à son retour au premier plan.
      router.back();
    } catch (e: any) {
      setError(e?.message ?? "Impossible de créer l'opération de pression.");
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
          <DetailsHeader title="Nouvelle pression" onBack={() => router.back()} />

          <View style={styles.card}>
            {/* DATE */}
            <Text style={[styles.label, styles.firstLabel]}>Date de pression *</Text>
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

            {/* NOTES */}
            <Text style={styles.label}>Notes</Text>
            <TextInput
              style={[styles.input, styles.notes]}
              placeholder="Notes concernant la pression..."
              placeholderTextColor={colors.textMuted}
              value={notes}
              onChangeText={setNotes}
              multiline
            />
          </View>

          {/* SOURCES */}
          {preparing && (
            <ActivityIndicator style={styles.preparing} color={semanticColors.primary} />
          )}

          {!preparing && blocks.map((block, index) => (
            <PressingSourceCard
              key={block.key}
              index={index}
              block={block}
              excludedSourceIds={excludedSourceIds(block)}
              canRemove={blocks.length > 1}
              onChange={updateBlock}
              onRemove={() => removeBlock(block.key)}
            />
          ))}

          <Pressable
            onPress={() => setBlocks((current) => [...current, newBlock()])}
            style={({ pressed }) => [styles.addSource, pressed && styles.addSourcePressed]}
          >
            <IconPlus size={18} color={semanticColors.primary} />
            <Text style={[typography.bodyStrong, styles.addSourceLabel]}>
              Ajouter une source
            </Text>
          </Pressable>

          {/* RÉSUMÉ */}
          <View style={styles.summary}>
            <Text style={[typography.body, styles.summaryLabel]}>
              {inputs.length} lot{inputs.length > 1 ? "s" : ""} sélectionné
              {inputs.length > 1 ? "s" : ""}
            </Text>
            <Text style={[typography.bodyStrong, styles.summaryValue]}>
              {formatKg(totalKg)}
            </Text>
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
                {saving ? "Création..." : "Planifier la pression"}
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

  firstLabel: {
    marginTop: 0,
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

  preparing: {
    paddingVertical: spacing.xl,
  },

  addSource: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    marginTop: spacing.lg,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.olive[500],
    borderRadius: radius.md,
  },

  addSourcePressed: {
    backgroundColor: colors.olive[100],
  },

  addSourceLabel: {
    color: semanticColors.primary,
  },

  summary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: spacing.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.olive[100],
  },

  summaryLabel: {
    color: colors.olive[800],
  },

  summaryValue: {
    color: colors.olive[800],
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
