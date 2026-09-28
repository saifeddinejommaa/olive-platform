import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";

import { useOliveAnalysisDetailsStore } from "@olive-platform/core/features/analyses/oliveAnalyses/store/OliveAnalysisDetailsStore";
import type { OliveAnalysisDetails } from "@olive-platform/core/features/analyses/oliveAnalyses/domain/entities/OliveAnalysisDetails";
import type { UpdateOliveAnalysisParams } from "@olive-platform/core/features/analyses/oliveAnalyses/domain/params/UpdateOliveAnalysisParams";
import { ProductionStatus } from "@olive-platform/core/features/production/domain/entities/ProductionStatus";
import { getOliveVarietyLabel } from "@olive-platform/core/features/appConstants/helper/AppConstantsHelper";

import { Screen } from "../../components/Screen";
import { DetailsHeader } from "../../components/DetailsHeader";
import { ActionCard } from "../../components/ActionCard";
import { Loading } from "../../components/Loading";
import { HarvestSectionHeader } from "../harvest/components/details/HarvestSectionHeader";
import { OliveAnalysisSummaryCard } from "./components/details/OliveAnalysisSummaryCard";
import { CompleteOliveAnalysisSheet } from "./components/details/CompleteOliveAnalysisSheet";
import {
  OliveAnalysisResultsSection,
  RESULT_FIELDS,
  type ResultField,
  type ResultsForm,
} from "./components/details/OliveAnalysisResultsSection";
import { colors, semanticColors } from "../../consts/Colors";
import { typography } from "../../consts/Typography";
import { radius, shadow, spacing } from "../../consts/spacing";

type Props = { analysisId: number };

const toText = (value?: number | null) => (value != null ? String(value) : "");

const formFromAnalysis = (analysis: OliveAnalysisDetails): ResultsForm => ({
  humidityPercentage: toText(analysis.humidityPercentage),
  waterPercentage: toText(analysis.waterPercentage),
  oilPercentage: toText(analysis.oilPercentage),
  acidityPercentage: toText(analysis.acidityPercentage),
});

// "12,5" -> 12.5 ; vide -> undefined ; invalide -> NaN.
const parsePercentage = (value: string): number | undefined => {
  const trimmed = value.trim().replace(",", ".");
  return trimmed === "" ? undefined : Number(trimmed);
};

function formatDateTime(value?: string | null) {
  if (!value) return "—";

  return new Date(value).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(value?: string | null) {
  if (!value) return "—";

  return new Date(value).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function OliveAnalysisDetailsPage({ analysisId }: Props) {
  const { analysis, saving, error, fetchAnalysis, update, start, complete, clear } =
    useOliveAnalysisDetailsStore();

  const [form, setForm] = useState<ResultsForm>({
    humidityPercentage: "",
    waterPercentage: "",
    oilPercentage: "",
    acidityPercentage: "",
  });
  const [errors, setErrors] = useState<Partial<Record<ResultField, string>>>({});
  const [dirty, setDirty] = useState(false);
  // Taux à enregistrer à la clôture ; non null = récapitulatif ouvert.
  const [completeParams, setCompleteParams] = useState<UpdateOliveAnalysisParams | null>(null);

  useEffect(() => {
    fetchAnalysis(analysisId).catch(() => undefined);
    return () => clear();
  }, [analysisId, fetchAnalysis, clear]);

  // Le formulaire suit l'analyse chargée (ex. après enregistrement) :
  // resynchronisé pendant le rendu quand l'analyse change.
  const [syncedAnalysis, setSyncedAnalysis] = useState<OliveAnalysisDetails | null>(null);

  if (analysis && analysis !== syncedAnalysis) {
    setSyncedAnalysis(analysis);
    setForm(formFromAnalysis(analysis));
    setErrors({});
    setDirty(false);
  }

  const isPlanned = analysis?.status === ProductionStatus.Planned;
  const isInProgress = analysis?.status === ProductionStatus.InProgress;

  const handleChange = (field: ResultField, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setDirty(true);
  };

  // Taux entre 0 et 100 ; retourne les paramètres ou null si invalide.
  const buildParams = (): UpdateOliveAnalysisParams | null => {
    if (!analysis) return null;

    const nextErrors: Partial<Record<ResultField, string>> = {};
    const values: Partial<Record<ResultField, number | undefined>> = {};

    for (const field of RESULT_FIELDS) {
      const value = parsePercentage(form[field.key]);

      if (value !== undefined && (Number.isNaN(value) || value < 0 || value > 100)) {
        nextErrors[field.key] = "Valeur entre 0 et 100.";
      }

      values[field.key] = value;
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return null;
    }

    return { id: analysis.id, ...values };
  };

  const handleStart = useCallback(async () => {
    if (!analysis) return;

    try {
      await start(analysis.id);
    } catch (e: any) {
      Alert.alert("Erreur", e?.message ?? "Impossible de démarrer l'analyse.");
    }
  }, [analysis, start]);

  const handleSave = async () => {
    const params = buildParams();
    if (!params || !analysis) return;

    try {
      await update(analysis.id, params);
    } catch (e: any) {
      Alert.alert("Erreur", e?.message ?? "Impossible d'enregistrer les résultats.");
    }
  };

  // Ouvre le récapitulatif avec les taux saisis (validés).
  const handleComplete = () => {
    const params = buildParams();
    if (params) setCompleteParams(params);
  };

  // Terminer : les résultats sont d'abord enregistrés, puis l'analyse clôturée.
  // Une erreur remonte au récapitulatif, qui l'affiche.
  const handleConfirmComplete = async () => {
    if (!analysis || !completeParams) return;

    await update(analysis.id, completeParams);
    await complete(analysis.id, { id: analysis.id });
    setCompleteParams(null);
  };

  if (!analysis) {
    return error ? (
      <Screen>
        <View style={styles.content}>
          <DetailsHeader title="Détails" onBack={() => router.back()} />
          <Text style={[typography.body, styles.errorText]}>{error}</Text>
        </View>
      </Screen>
    ) : (
      <Loading />
    );
  }

  const sourceLabel =
    analysis.sourceTypeId === 1 ? "Récolte" : analysis.sourceTypeId === 2 ? "Achat" : "—";

  const infoRows = [
    { label: "Source", value: sourceLabel },
    { label: "Référence de la source", value: analysis.sourceReference || "—" },
    {
      label: "Variété",
      value: analysis.varietyId ? getOliveVarietyLabel(analysis.varietyId) : "—",
    },
    {
      label: "Quantité d'olives",
      value: analysis.quantityKg
        ? `${analysis.quantityKg.toLocaleString("fr-FR")} kg${
            analysis.lotsCount
              ? ` (${analysis.lotsCount} lot${analysis.lotsCount > 1 ? "s" : ""})`
              : ""
          }`
        : "—",
    },
    { label: "Date prévue", value: formatDate(analysis.plannedDate) },
    { label: "Début", value: formatDateTime(analysis.startTime) },
    { label: "Fin", value: formatDateTime(analysis.endTime) },
  ];

  return (
    <Screen>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <DetailsHeader title="Détails" onBack={() => router.back()} />

          <OliveAnalysisSummaryCard analysis={analysis} />

          {isPlanned && (
            <ActionCard
              icon="▶"
              title="Démarrer l'analyse"
              subtitle="Commencer les mesures"
              loading={saving}
              onPress={handleStart}
            />
          )}

          {isInProgress && (
            <ActionCard
              icon="✓"
              title="Terminer l'analyse"
              subtitle="Valider les résultats"
              loading={saving}
              onPress={handleComplete}
            />
          )}

          {/* RÉSULTATS */}
          <View style={styles.section}>
            <OliveAnalysisResultsSection
              form={form}
              editable={isInProgress}
              notStarted={isPlanned}
              errors={errors}
              onChange={handleChange}
            />

            {isInProgress && (
              <TouchableOpacity
                style={[styles.saveButton, (!dirty || saving) && styles.saveButtonDisabled]}
                onPress={handleSave}
                disabled={!dirty || saving}
              >
                <Text style={[typography.bodyStrong, styles.saveLabel]}>
                  {saving ? "Enregistrement..." : "Enregistrer les résultats"}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* INFORMATIONS */}
          <View style={styles.section}>
            <HarvestSectionHeader
              title="Informations générales"
              subtitle="Source et calendrier de l'analyse"
            />

            <View style={styles.card}>
              {infoRows.map((row, index) => (
                <View
                  key={row.label}
                  style={[styles.infoRow, index === infoRows.length - 1 && styles.lastRow]}
                >
                  <Text style={[typography.body, styles.infoLabel]}>{row.label}</Text>
                  <Text style={[typography.bodyStrong, styles.infoValue]}>{row.value}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.bottomSpace} />
        </ScrollView>
      </KeyboardAvoidingView>

      {completeParams && (
        <CompleteOliveAnalysisSheet
          visible
          saving={saving}
          analysis={analysis}
          results={completeParams}
          onClose={() => setCompleteParams(null)}
          onConfirm={handleConfirmComplete}
        />
      )}
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
  section: {
    marginTop: spacing.xl,
  },
  card: {
    backgroundColor: semanticColors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: semanticColors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    ...shadow.card,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  infoLabel: {
    color: semanticColors.textSecondary,
  },
  infoValue: {
    color: semanticColors.textPrimary,
    flexShrink: 1,
    textAlign: "right",
  },
  saveButton: {
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: semanticColors.primary,
    backgroundColor: colors.surface,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveLabel: {
    color: semanticColors.primary,
  },
  errorText: {
    color: semanticColors.danger,
    marginTop: spacing.lg,
  },
  bottomSpace: {
    height: spacing.xxl,
  },
});
