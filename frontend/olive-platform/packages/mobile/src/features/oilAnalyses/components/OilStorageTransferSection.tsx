import { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import type { OilLocation } from "@olive-platform/core/features/analyses/oilAnalyses/domain/entities/OilLocation";
import {
  OIL_CATEGORY_LABELS,
  TankType,
  type OilCategory,
  type Tank,
} from "@olive-platform/core/features/tanks/domain/entities/Tank";
import { GetTanks } from "@olive-platform/core/features/tanks/domain/usecases/GetTanks";
import { TransferOilToStorage } from "@olive-platform/core/features/oilMovements/domain/usecases/OilMovementUseCases";
import { HarvestSectionHeader } from "../../harvest/components/details/HarvestSectionHeader";
import { colors, semanticColors } from "../../../consts/Colors";
import { typography } from "../../../consts/Typography";
import { radius, shadow, spacing } from "../../../consts/spacing";

const formatLiters = (value: number) =>
  `${Number(value).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} L`;

type Props = {
  oilAnalysisId: number;
  // Catégorie officielle, fixée par l'API à la clôture de l'analyse.
  category: OilCategory | null;
  locations: OilLocation[];
  onTransferred: () => void;
};

/**
 * Après l'analyse : transfert de l'huile de la citerne tampon vers une
 * citerne de stockage de sa catégorie.
 */
export function OilStorageTransferSection({
  oilAnalysisId,
  category,
  locations,
  onTransferred,
}: Props) {
  // Huile encore en citerne tampon : c'est elle qui est transférée.
  const bufferLocations = locations.filter((location) => location.tankType === TankType.Buffer);
  const quantity = bufferLocations.reduce(
    (total, location) => total + Number(location.quantityLiters),
    0,
  );

  // Citernes de stockage ; null = en cours de chargement.
  const [tanks, setTanks] = useState<Tank[] | null>(null);
  const [pickedTankId, setPickedTankId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!category || quantity <= 0) return;

    let cancelled = false;

    GetTanks({ tankType: TankType.Storage, oilCategory: category, status: "active" })
      .then((items) => {
        if (!cancelled) setTanks(items);
      })
      .catch(() => {
        if (!cancelled) setTanks([]);
      });

    return () => {
      cancelled = true;
    };
  }, [category, quantity]);

  // Rien à transférer : l'huile n'est plus en citerne tampon.
  if (quantity <= 0) return null;

  const fits = (tank: Tank) => Number(tank.availableCapacityLiters) >= quantity;

  // Les plus remplies avec assez de place d'abord (moins d'air, moins d'oxydation).
  const sortedTanks = [...(tanks ?? [])].sort(
    (a, b) =>
      Number(!fits(a)) - Number(!fits(b)) ||
      Number(b.fillPercentage) - Number(a.fillPercentage),
  );
  const suggested = sortedTanks.find(fits) ?? null;
  const picked = sortedTanks.find((tank) => tank.id === pickedTankId);
  const selected = picked && fits(picked) ? picked : suggested;

  const handleTransfer = () => {
    if (!selected) return;

    Alert.alert(
      "Transférer l'huile",
      `${formatLiters(quantity)} de ${bufferLocations
        .map((location) => location.tankCode)
        .join(", ")} vers ${selected.code} ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Transférer",
          onPress: async () => {
            setSaving(true);

            try {
              await TransferOilToStorage({ oilAnalysisId, destinationTankId: selected.id });
              onTransferred();
            } catch (e: any) {
              Alert.alert("Erreur", e?.message ?? "Impossible de transférer l'huile.");
            } finally {
              setSaving(false);
            }
          },
        },
      ],
    );
  };

  return (
    <View style={styles.section}>
      <HarvestSectionHeader
        title="Stockage de l'huile"
        subtitle={`${formatLiters(quantity)} en citerne tampon à transférer`}
      />

      <View style={styles.card}>
        {!category ? (
          <Text style={[typography.body, styles.warning]}>
            Cette analyse n&apos;a pas de catégorie d&apos;huile.
          </Text>
        ) : tanks === null ? (
          <Text style={[typography.body, styles.muted]}>Chargement des citernes...</Text>
        ) : sortedTanks.length === 0 ? (
          <Text style={[typography.body, styles.warning]}>
            Aucune citerne de stockage « {OIL_CATEGORY_LABELS[category]} » active.
          </Text>
        ) : (
          <>
            <Text style={[typography.caption, styles.muted]}>
              Citernes « {OIL_CATEGORY_LABELS[category]} » : la plus remplie qui a la place est
              conseillée.
            </Text>

            {sortedTanks.map((tank) => {
              const ok = fits(tank);
              const isSelected = ok && tank.id === selected?.id;

              return (
                <TouchableOpacity
                  key={tank.id}
                  style={[styles.tank, isSelected && styles.tankSelected, !ok && styles.tankDisabled]}
                  disabled={!ok || saving}
                  onPress={() => setPickedTankId(tank.id)}
                >
                  <View style={[styles.radio, isSelected && styles.radioSelected]} />

                  <View style={styles.tankBody}>
                    <Text style={[typography.bodyStrong, styles.primaryText]}>
                      {tank.code}
                      {tank.name ? ` · ${tank.name}` : ""}
                      {tank.id === suggested?.id ? "  (conseillée)" : ""}
                    </Text>
                    <Text style={[typography.caption, styles.muted]}>
                      {formatLiters(Number(tank.currentQuantityLiters))} /{" "}
                      {formatLiters(Number(tank.capacityLiters))}
                      {ok ? "" : " · place insuffisante"}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity
              style={[styles.button, (!selected || saving) && styles.disabled]}
              onPress={handleTransfer}
              disabled={!selected || saving}
            >
              <Text style={[typography.bodyStrong, styles.buttonLabel]}>
                {saving ? "Transfert..." : "Transférer vers le stockage"}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginTop: spacing.md, marginBottom: spacing.md },
  card: {
    backgroundColor: semanticColors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: semanticColors.border,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadow.card,
  },
  muted: { color: semanticColors.textSecondary },
  primaryText: { color: semanticColors.textPrimary },
  warning: { color: semanticColors.warning },
  tank: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tankSelected: {
    borderColor: semanticColors.primary,
    backgroundColor: semanticColors.primarySoft,
  },
  tankDisabled: { opacity: 0.5 },
  tankBody: { flex: 1, gap: 2 },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: colors.border,
  },
  radioSelected: {
    borderColor: semanticColors.primary,
    backgroundColor: semanticColors.primary,
  },
  button: {
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
    backgroundColor: semanticColors.primary,
  },
  disabled: { opacity: 0.5 },
  buttonLabel: { color: semanticColors.onPrimary },
});
