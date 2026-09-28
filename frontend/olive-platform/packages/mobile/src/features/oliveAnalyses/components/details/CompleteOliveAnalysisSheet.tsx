import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import type { OliveAnalysisDetails } from "@olive-platform/core/features/analyses/oliveAnalyses/domain/entities/OliveAnalysisDetails";
import type { UpdateOliveAnalysisParams } from "@olive-platform/core/features/analyses/oliveAnalyses/domain/params/UpdateOliveAnalysisParams";
import { getOliveVarietyLabel } from "@olive-platform/core/features/appConstants/helper/AppConstantsHelper";
import { RESULT_FIELDS } from "./OliveAnalysisResultsSection";
import { colors, semanticColors } from "../../../../consts/Colors";
import { typography } from "../../../../consts/Typography";
import { radius, shadow, spacing } from "../../../../consts/spacing";

type Props = {
  visible: boolean;
  saving?: boolean;
  analysis: OliveAnalysisDetails;
  // Taux saisis (validés) : enregistrés puis l'analyse est terminée.
  results: UpdateOliveAnalysisParams;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
};

// Densité de l'huile d'olive (kg / L), comme pour l'huile attendue des pressions.
const OLIVE_OIL_DENSITY = 0.916;

const formatNumber = (value: number, digits = 2) =>
  value.toLocaleString("fr-FR", { maximumFractionDigits: digits });

const formatPercentage = (value?: number) =>
  value !== undefined ? `${formatNumber(value)} %` : "—";

/**
 * Récapitulatif avant de terminer l'analyse : olives analysées (source,
 * variété, quantité) et taux mesurés.
 */
export function CompleteOliveAnalysisSheet({
  visible,
  saving,
  analysis,
  results,
  onClose,
  onConfirm,
}: Props) {
  const [error, setError] = useState<string | null>(null);

  const sourceLabel =
    analysis.sourceTypeId === 1 ? "Récolte" : analysis.sourceTypeId === 2 ? "Achat" : "Source";
  const quantityKg = analysis.quantityKg ?? 0;
  const lotsCount = analysis.lotsCount ?? 0;

  // Huile estimée à partir du taux d'huile, en litres.
  const estimatedOilLiters =
    results.oilPercentage !== undefined && quantityKg > 0
      ? (quantityKg * results.oilPercentage) / 100 / OLIVE_OIL_DENSITY
      : null;

  const handleConfirm = async () => {
    setError(null);

    try {
      await onConfirm();
    } catch (e: any) {
      setError(e?.message ?? "Impossible de terminer l'analyse.");
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <Pressable style={styles.backdrop} onPress={onClose} />

        <View style={styles.sheet}>
          <View style={styles.handle} />

          <Text style={[typography.h2, styles.title]}>Terminer l&apos;analyse</Text>
          <Text style={[typography.body, styles.subtitle]}>
            Vérifiez le récapitulatif avant de terminer.
          </Text>

          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            {/* OLIVES ANALYSÉES */}
            <Text style={styles.sectionTitle}>Olives analysées</Text>
            <View style={styles.block}>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>{sourceLabel}</Text>
                <Text style={[styles.rowValue, styles.strong]}>
                  {analysis.sourceReference || "—"}
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.rowLabel}>Variété</Text>
                <Text style={styles.rowValue}>
                  {analysis.varietyId ? getOliveVarietyLabel(analysis.varietyId) : "—"}
                </Text>
              </View>

              <View style={styles.separator} />

              <View style={styles.row}>
                <Text style={styles.rowLabel}>Quantité</Text>
                <Text style={[styles.rowValue, styles.strong]}>
                  {formatNumber(quantityKg)} kg
                  <Text style={styles.muted}>
                    {"  "}({lotsCount} lot{lotsCount > 1 ? "s" : ""})
                  </Text>
                </Text>
              </View>
            </View>

            {/* RÉSULTATS */}
            <Text style={styles.sectionTitle}>Résultats</Text>
            <View style={styles.block}>
              {RESULT_FIELDS.map((field) => (
                <View key={field.key} style={styles.row}>
                  <Text style={styles.rowLabel}>{field.label}</Text>
                  <Text style={[styles.rowValue, styles.strong]}>
                    {formatPercentage(results[field.key])}
                  </Text>
                </View>
              ))}

              {estimatedOilLiters !== null && (
                <>
                  <View style={styles.separator} />

                  <View style={styles.row}>
                    <Text style={styles.rowLabel}>Huile estimée</Text>
                    <Text style={[styles.rowValue, styles.strong, styles.ok]}>
                      ≈ {formatNumber(estimatedOilLiters, 1)} L
                    </Text>
                  </View>
                </>
              )}
            </View>

            {results.oilPercentage === undefined && (
              <View style={styles.warningBox}>
                <Text style={styles.warningText}>
                  Le taux d&apos;huile n&apos;est pas renseigné : l&apos;huile attendue des
                  pressions ne pourra pas être calculée.
                </Text>
              </View>
            )}

            <View style={styles.notice}>
              <Text style={styles.noticeText}>
                Une fois terminée, l&apos;analyse ne pourra plus être modifiée et
                ses lots deviendront pressables.
              </Text>
            </View>
          </ScrollView>

          {error && <Text style={styles.error}>{error}</Text>}

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancel} onPress={onClose} disabled={saving}>
              <Text style={[typography.bodyStrong, styles.cancelLabel]}>Annuler</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.confirm, saving && styles.confirmDisabled]}
              onPress={handleConfirm}
              disabled={saving}
            >
              <Text style={[typography.bodyStrong, styles.confirmLabel]}>
                {saving ? "Enregistrement..." : "Terminer"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
  },

  subtitle: {
    color: semanticColors.textSecondary,
    marginTop: spacing.xs,
  },

  scroll: {
    flexGrow: 0,
  },

  sectionTitle: {
    ...typography.label,
    color: semanticColors.textSecondary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    textTransform: "uppercase",
  },

  block: {
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.background,
    gap: spacing.sm,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    paddingVertical: 2,
  },

  rowLabel: {
    ...typography.body,
    color: semanticColors.textPrimary,
    flexShrink: 1,
  },

  rowValue: {
    ...typography.body,
    color: semanticColors.textPrimary,
    textAlign: "right",
  },

  strong: {
    fontWeight: "700",
  },

  muted: {
    fontWeight: "400",
    color: semanticColors.textSecondary,
  },

  ok: {
    color: semanticColors.success,
  },

  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
  },

  warningBox: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.gold[100],
  },

  warningText: {
    ...typography.caption,
    color: colors.gold[700],
  },

  notice: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: semanticColors.infoSoft,
  },

  noticeText: {
    ...typography.caption,
    color: semanticColors.info,
  },

  error: {
    ...typography.caption,
    color: semanticColors.danger,
    marginTop: spacing.md,
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
