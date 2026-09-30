import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";

import { useOilAnalysisDetailsStore } from "@olive-platform/core/features/analyses/oilAnalyses/stores/UseOilAnalysisDetailsStore";
import type { OilAnalysisDetails } from "@olive-platform/core/features/analyses/oilAnalyses/domain/entities/OilAnalysisDetails";
import type { UpdateOilAnalysisParams } from "@olive-platform/core/features/analyses/oilAnalyses/domain/params/UpdateOilAnalysisParams";
import { ProductionStatus } from "@olive-platform/core/features/production/domain/entities/ProductionStatus";
import { OIL_CATEGORY_LABELS } from "@olive-platform/core/features/tanks/domain/entities/Tank";

import { Screen } from "../../components/Screen";
import { DetailsHeader } from "../../components/DetailsHeader";
import { ActionCard } from "../../components/ActionCard";
import { Loading } from "../../components/Loading";
import { ProductionStatusBadge } from "../../components/ProductionStatusBadge";
import { HarvestSectionHeader } from "../harvest/components/details/HarvestSectionHeader";
import { OilCategoryBadge } from "./components/OilCategoryBadge";
import { OilLocationsSection } from "./components/OilLocationsSection";
import { OilStorageTransferSection } from "./components/OilStorageTransferSection";
import { colors, semanticColors } from "../../consts/Colors";
import { typography } from "../../consts/Typography";
import { radius, shadow, spacing } from "../../consts/spacing";

type Props = { analysisId: number };

type ResultKey = "acidityPercentage" | "peroxideIndex" | "k232" | "k270" | "organolepticGrade";

type ResultsForm = Record<ResultKey, string>;

// Résultats du contrôle physico-chimique de l'huile.
const RESULT_FIELDS: { key: ResultKey; label: string }[] = [
  { key: "acidityPercentage", label: "Acidité (%) *" },
  { key: "peroxideIndex", label: "Indice de peroxyde (meq O₂/kg)" },
  { key: "k232", label: "K232" },
  { key: "k270", label: "K270" },
  { key: "organolepticGrade", label: "Classification organoleptique" },
];

const toText = (value?: number | null) => (value != null ? String(value) : "");

const formFromAnalysis = (analysis: OilAnalysisDetails): ResultsForm => ({
  acidityPercentage: toText(analysis.acidityPercentage),
  peroxideIndex: toText(analysis.peroxideIndex),
  k232: toText(analysis.k232),
  k270: toText(analysis.k270),
  organolepticGrade: toText(analysis.organolepticGrade),
});

// "0,35" -> 0.35 ; vide -> undefined ; invalide -> NaN.
const parseValue = (value: string): number | undefined => {
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

export function OilAnalysisDetailsPage({ analysisId }: Props) {
  const { analysis, saving, error, fetchAnalysis, update, start, complete, abandon, clear } =
    useOilAnalysisDetailsStore();

  const [form, setForm] = useState<ResultsForm>({
    acidityPercentage: "",
    peroxideIndex: "",
    k232: "",
    k270: "",
    organolepticGrade: "",
  });
  const [errors, setErrors] = useState<Partial<Record<ResultKey, string>>>({});
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    fetchAnalysis(analysisId).catch(() => undefined);
    return () => clear();
  }, [analysisId, fetchAnalysis, clear]);

  // Le formulaire suit l'analyse chargée : resynchronisé pendant le rendu.
  const [syncedAnalysis, setSyncedAnalysis] = useState<OilAnalysisDetails | null>(null);

  if (analysis && analysis !== syncedAnalysis) {
    setSyncedAnalysis(analysis);
    setForm(formFromAnalysis(analysis));
    setErrors({});
    setDirty(false);
  }

  const isPlanned = analysis?.status === ProductionStatus.Planned;
  const isInProgress = analysis?.status === ProductionStatus.InProgress;
  const isCompleted = analysis?.status === ProductionStatus.Completed;

  const handleChange = (key: ResultKey, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
    setDirty(true);
  };

  // Valeurs positives ; l'acidité est obligatoire pour clôturer.
  const buildParams = (requireAcidity: boolean): UpdateOilAnalysisParams | null => {
    const nextErrors: Partial<Record<ResultKey, string>> = {};
    const values: Partial<Record<ResultKey, number | undefined>> = {};

    for (const field of RESULT_FIELDS) {
      const value = parseValue(form[field.key]);

      if (value !== undefined && (Number.isNaN(value) || value < 0)) {
        nextErrors[field.key] = "Valeur invalide.";
      }

      values[field.key] = value;
    }

    if (values.acidityPercentage !== undefined && values.acidityPercentage > 100) {
      nextErrors.acidityPercentage = "L'acidité doit être comprise entre 0 et 100 %.";
    }

    if (requireAcidity && values.acidityPercentage === undefined) {
      nextErrors.acidityPercentage = "L'acidité est obligatoire pour clôturer l'analyse.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return null;
    }

    // La date d'analyse est gérée par l'API.
    return values;
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
    const params = buildParams(false);
    if (!params || !analysis) return;

    try {
      await update(analysis.id, params);
    } catch (e: any) {
      Alert.alert("Erreur", e?.message ?? "Impossible d'enregistrer les résultats.");
    }
  };

  // Clôture : la catégorie de l'huile est fixée par l'API (seuils COI).
  const handleComplete = () => {
    const params = buildParams(true);
    if (!params || !analysis) return;

    Alert.alert(
      "Clôturer l'analyse",
      "Les résultats seront figés et la catégorie de l'huile déterminée. Continuer ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Clôturer",
          onPress: async () => {
            try {
              await complete(analysis.id, params);
            } catch (e: any) {
              Alert.alert("Erreur", e?.message ?? "Impossible de clôturer l'analyse.");
            }
          },
        },
      ],
    );
  };

  const handleAbandon = () => {
    if (!analysis) return;

    Alert.alert("Abandonner l'analyse", "Voulez-vous vraiment abandonner cette analyse ?", [
      { text: "Non", style: "cancel" },
      {
        text: "Abandonner",
        style: "destructive",
        onPress: async () => {
          try {
            await abandon(analysis.id);
          } catch (e: any) {
            Alert.alert("Erreur", e?.message ?? "Impossible d'abandonner l'analyse.");
          }
        },
      },
    ]);
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

  const infoRows = [
    { label: "Pression", value: analysis.sourceReference || "—" },
    {
      label: "Huile produite",
      value:
        analysis.oilQuantityLiters != null
          ? `${Number(analysis.oilQuantityLiters).toLocaleString("fr-FR")} L`
          : "—",
    },
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
          <DetailsHeader title="Analyse d'huile" onBack={() => router.back()} />

          {/* ==================== RÉSUMÉ ==================== */}
          <View style={styles.card}>
            <Text style={[typography.label, styles.muted]}>ANALYSE D&apos;HUILE</Text>
            <Text style={[typography.h1, styles.primaryText]}>{analysis.reference}</Text>

            <View style={styles.badges}>
              <ProductionStatusBadge status={analysis.status} />
              {isCompleted && <OilCategoryBadge category={analysis.oilCategory} />}
            </View>
          </View>

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
              title="Clôturer l'analyse"
              subtitle="Valider les résultats et classer l'huile"
              loading={saving}
              onPress={handleComplete}
            />
          )}

          {/* ==================== RÉSULTATS ==================== */}
          <View style={styles.section}>
            <HarvestSectionHeader
              title="Résultats"
              subtitle={
                isInProgress
                  ? "Saisissez les mesures de l'huile"
                  : "Contrôle physico-chimique de l'huile"
              }
            />

            <View style={styles.card}>
              {isPlanned ? (
                <Text style={[typography.body, styles.muted]}>
                  Les résultats se saisissent une fois l&apos;analyse démarrée.
                </Text>
              ) : (
                RESULT_FIELDS.map((field) => (
                  <View key={field.key} style={styles.resultRow}>
                    <View style={styles.resultLine}>
                      <Text style={[typography.body, styles.muted, styles.resultLabel]}>
                        {field.label}
                      </Text>

                      {isInProgress ? (
                        <TextInput
                          style={[typography.bodyStrong, styles.input]}
                          keyboardType="decimal-pad"
                          placeholder="—"
                          placeholderTextColor={semanticColors.textMuted}
                          value={form[field.key]}
                          onChangeText={(value) => handleChange(field.key, value)}
                        />
                      ) : (
                        <Text style={[typography.bodyStrong, styles.primaryText]}>
                          {form[field.key] || "—"}
                        </Text>
                      )}
                    </View>

                    {errors[field.key] && (
                      <Text style={[typography.caption, styles.errorText]}>
                        {errors[field.key]}
                      </Text>
                    )}
                  </View>
                ))
              )}

              {isInProgress && (
                <Text style={[typography.caption, styles.muted]}>
                  La catégorie de l&apos;huile sera déterminée à la clôture.
                </Text>
              )}

              {isCompleted && (
                <Text style={[typography.bodyStrong, styles.primaryText]}>
                  Catégorie :{" "}
                  {analysis.oilCategory
                    ? OIL_CATEGORY_LABELS[analysis.oilCategory]
                    : "non déterminée"}
                </Text>
              )}
            </View>

            {isInProgress && (
              <TouchableOpacity
                style={[styles.saveButton, (!dirty || saving) && styles.disabled]}
                onPress={handleSave}
                disabled={!dirty || saving}
              >
                <Text style={[typography.bodyStrong, styles.saveLabel]}>
                  {saving ? "Enregistrement..." : "Enregistrer les résultats"}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* ==================== POSITION DE L'HUILE ==================== */}
          <OilLocationsSection
            locations={analysis.oilLocations}
            oilQuantityLiters={analysis.oilQuantityLiters}
          />

          {/* ==================== STOCKAGE ==================== */}
          {isCompleted && (
            <OilStorageTransferSection
              oilAnalysisId={analysis.id}
              category={analysis.oilCategory}
              locations={analysis.oilLocations}
              onTransferred={() => fetchAnalysis(analysis.id)}
            />
          )}

          {/* ==================== INFORMATIONS ==================== */}
          <View style={styles.section}>
            <HarvestSectionHeader title="Informations" subtitle="Source et calendrier" />

            <View style={styles.card}>
              {infoRows.map((row) => (
                <View key={row.label} style={styles.resultLine}>
                  <Text style={[typography.body, styles.muted]}>{row.label}</Text>
                  <Text style={[typography.bodyStrong, styles.primaryText]}>{row.value}</Text>
                </View>
              ))}
            </View>
          </View>

          {(isPlanned || isInProgress) && (
            <TouchableOpacity style={styles.abandonButton} onPress={handleAbandon} disabled={saving}>
              <Text style={[typography.bodyStrong, styles.abandonLabel]}>
                Abandonner l&apos;analyse
              </Text>
            </TouchableOpacity>
          )}

          <View style={styles.bottomSpace} />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
  },
  section: { marginTop: spacing.md, marginBottom: spacing.md },
  card: {
    backgroundColor: semanticColors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: semanticColors.border,
    padding: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.lg,
    ...shadow.card,
  },
  badges: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  muted: { color: semanticColors.textSecondary },
  primaryText: { color: semanticColors.textPrimary },
  resultRow: { gap: 4 },
  resultLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.md,
  },
  resultLabel: { flexShrink: 1 },
  input: {
    minWidth: 100,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: semanticColors.textPrimary,
    backgroundColor: colors.surface,
    textAlign: "right",
  },
  saveButton: {
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: semanticColors.primary,
    backgroundColor: colors.surface,
  },
  disabled: { opacity: 0.5 },
  saveLabel: { color: semanticColors.primary },
  abandonButton: {
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: semanticColors.danger,
    marginTop: spacing.md,
  },
  abandonLabel: { color: semanticColors.danger },
  errorText: { color: semanticColors.danger },
  bottomSpace: { height: spacing.xxl },
});
