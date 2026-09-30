import { useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";

import { usePlotDetailStore } from "@olive-platform/core/features/plots/stores/UsePlotDetailStore";
import type { PlotVarietyDetail } from "@olive-platform/core/features/plots/domain/entities/PlotVarietyDetail";

import { Screen } from "../../components/Screen";
import { DetailsHeader } from "../../components/DetailsHeader";
import { ActionCard } from "../../components/ActionCard";
import { Loading } from "../../components/Loading";
import { HarvestSectionHeader } from "../harvest/components/details/HarvestSectionHeader";
import { colors, semanticColors } from "../../consts/Colors";
import { typography } from "../../consts/Typography";
import { radius, shadow, spacing } from "../../consts/spacing";

type Props = { plotId: number };

const formatNumber = (value: number | null | undefined, digits = 0) =>
  value !== null && value !== undefined
    ? Number(value).toLocaleString("fr-FR", { maximumFractionDigits: digits })
    : "—";

const clampPercentage = (value: number) => Math.min(100, Math.max(0, Number(value) || 0));

/**
 * Détail d'une parcelle : informations, avancement de la récolte par variété
 * et lancement d'une récolte.
 */
export function PlotDetailsPage({ plotId }: Props) {
  const { plot, loading, error, fetchPlotDetail, reset } = usePlotDetailStore();

  useEffect(() => {
    fetchPlotDetail(plotId);
    return () => reset();
  }, [plotId, fetchPlotDetail, reset]);

  if (error && !plot) {
    return (
      <Screen>
        <View style={styles.content}>
          <DetailsHeader title="Parcelle" onBack={() => router.back()} />
          <Text style={[typography.body, styles.error]}>{error}</Text>
        </View>
      </Screen>
    );
  }

  if (!plot || loading) {
    return <Loading />;
  }

  const harvested = clampPercentage(plot.harvestedTreesPercentage);
  const planned = clampPercentage(plot.plannedTreesPercentage);

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <DetailsHeader title="Détails parcelle" onBack={() => router.back()} />

        {/* ==================== RÉSUMÉ ==================== */}
        <View style={styles.card}>
          <Text style={[typography.label, styles.label]}>PARCELLE</Text>
          <Text style={[typography.h1, styles.title]}>{plot.name}</Text>
          <Text style={[typography.caption, styles.muted]}>{plot.reference}</Text>

          <View style={styles.metrics}>
            <Metric label="Arbres" value={formatNumber(plot.numberOfTrees)} />
            <Metric label="Surface" value={plot.areaHectares ? `${formatNumber(plot.areaHectares, 2)} ha` : "—"} />
            <Metric label="Plantation" value={plot.plantingYear ? String(plot.plantingYear) : "—"} />
          </View>

          {/* Avancement de la récolte de la campagne. */}
          <View style={styles.progressBlock}>
            <View style={styles.progressHeader}>
              <Text style={[typography.bodyStrong, styles.primaryText]}>Récolte de la campagne</Text>
              <Text style={[typography.bodyStrong, styles.primaryText]}>{formatNumber(harvested)} %</Text>
            </View>

            <ProgressBar harvested={harvested} planned={planned} />

            <View style={styles.legend}>
              <LegendDot color={semanticColors.primary} label={`Récolté ${formatNumber(harvested)} %`} />
              <LegendDot color={semanticColors.accent} label={`Planifié ${formatNumber(planned)} %`} />
            </View>
          </View>
        </View>

        {plot.canLaunchHarvest && (
          <ActionCard
            icon="🧺"
            title="Lancer une récolte"
            subtitle="Planifier la récolte de cette parcelle"
            onPress={() =>
              router.push({
                pathname: "/harvest/new",
                params: { plotId: String(plot.id) },
              })
            }
          />
        )}

        {/* ==================== VARIÉTÉS ==================== */}
        <HarvestSectionHeader title="Variétés" subtitle="Arbres récoltés par variété" />

        <View style={styles.list}>
          {plot.varieties.length === 0 ? (
            <Text style={[typography.body, styles.muted]}>Aucune variété renseignée.</Text>
          ) : (
            plot.varieties.map((variety) => (
              <VarietyCard key={variety.varietyId} variety={variety} />
            ))
          )}
        </View>

        {/* ==================== INFORMATIONS ==================== */}
        <HarvestSectionHeader title="Informations" subtitle="Localisation et notes" />

        <View style={styles.card}>
          <InfoRow label="Localisation" value={plot.location || "—"} />
          <InfoRow label="Notes" value={plot.notes || "—"} />
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>
    </Screen>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.metric}>
      <Text style={[typography.caption, styles.muted]}>{label}</Text>
      <Text style={[typography.bodyStrong, styles.primaryText]}>{value}</Text>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={[typography.caption, styles.muted]}>{label}</Text>
      <Text style={[typography.body, styles.primaryText]}>{value}</Text>
    </View>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[typography.caption, styles.muted]}>{label}</Text>
    </View>
  );
}

// Barre : récolté (olive) puis planifié (or) sur le total des arbres.
function ProgressBar({ harvested, planned }: { harvested: number; planned: number }) {
  return (
    <View style={styles.bar}>
      <View style={[styles.barFill, { width: `${harvested}%`, backgroundColor: semanticColors.primary }]} />
      <View
        style={[
          styles.barFill,
          {
            width: `${Math.min(planned, 100 - harvested)}%`,
            backgroundColor: semanticColors.accent,
          },
        ]}
      />
    </View>
  );
}

function VarietyCard({ variety }: { variety: PlotVarietyDetail }) {
  const harvested = clampPercentage(variety.harvestedPercentage);
  const planned = clampPercentage(variety.plannedTreesPercentage);
  const completed = variety.remainingTreesToHarvest === 0;

  return (
    <View style={styles.varietyCard}>
      <View style={styles.progressHeader}>
        <Text style={[typography.bodyStrong, styles.primaryText]}>{variety.varietyLabel}</Text>
        <Text style={[typography.caption, completed ? styles.done : styles.muted]}>
          {completed
            ? "Récoltée"
            : `${formatNumber(variety.remainingTreesToHarvest)} arbres restants`}
        </Text>
      </View>

      <ProgressBar harvested={harvested} planned={planned} />

      <Text style={[typography.caption, styles.muted]}>
        {formatNumber(variety.numberOfTrees)} arbres · {formatNumber(harvested)} % récoltés
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxxl,
  },
  card: {
    backgroundColor: semanticColors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: semanticColors.border,
    padding: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.xl,
    ...shadow.card,
  },
  label: { color: semanticColors.textMuted },
  title: { color: semanticColors.textPrimary },
  muted: { color: semanticColors.textSecondary },
  primaryText: { color: semanticColors.textPrimary },
  error: { color: semanticColors.danger, marginTop: spacing.lg },
  metrics: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  metric: { gap: 2 },
  progressBlock: { gap: spacing.sm, marginTop: spacing.md },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.md,
  },
  bar: {
    flexDirection: "row",
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
    overflow: "hidden",
  },
  barFill: { height: "100%" },
  legend: { flexDirection: "row", gap: spacing.lg },
  legendItem: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  dot: { width: 8, height: 8, borderRadius: 4 },
  list: { gap: spacing.md, marginBottom: spacing.xl },
  varietyCard: {
    backgroundColor: semanticColors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: semanticColors.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  done: { color: semanticColors.success, fontWeight: "700" },
  infoRow: { gap: 2, paddingVertical: spacing.xs },
  bottomSpace: { height: spacing.xxl },
});
