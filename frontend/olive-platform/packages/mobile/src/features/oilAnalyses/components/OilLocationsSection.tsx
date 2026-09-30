import { StyleSheet, Text, View } from "react-native";

import type { OilLocation } from "@olive-platform/core/features/analyses/oilAnalyses/domain/entities/OilLocation";
import { TankType } from "@olive-platform/core/features/tanks/domain/entities/Tank";
import { HarvestSectionHeader } from "../../harvest/components/details/HarvestSectionHeader";
import { colors, semanticColors } from "../../../consts/Colors";
import { typography } from "../../../consts/Typography";
import { radius, shadow, spacing } from "../../../consts/spacing";

const formatLiters = (value: number) =>
  `${Number(value).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} L`;

type Props = {
  locations: OilLocation[];
  // Huile produite par la pression source (L).
  oilQuantityLiters?: number;
};

// Position de l'huile analysée : les citernes qui la contiennent aujourd'hui.
export function OilLocationsSection({ locations, oilQuantityLiters }: Props) {
  return (
    <View style={styles.section}>
      <HarvestSectionHeader title="Position de l'huile" subtitle="Citerne(s) contenant l'huile" />

      <View style={styles.card}>
        {locations.length === 0 ? (
          <Text style={[typography.body, styles.muted]}>
            {oilQuantityLiters
              ? `Les ${formatLiters(oilQuantityLiters)} produits ne sont dans aucune citerne.`
              : "L'huile de cette source n'est dans aucune citerne."}
          </Text>
        ) : (
          locations.map((location) => {
            const isBuffer = location.tankType === TankType.Buffer;
            const percentage = Math.min(
              100,
              (Number(location.quantityLiters) / Number(location.capacityLiters)) * 100,
            );

            return (
              <View key={location.tankId} style={styles.location}>
                <View style={styles.header}>
                  <Text style={[typography.bodyStrong, styles.primaryText]}>
                    {location.tankCode}
                    {location.tankName ? ` · ${location.tankName}` : ""}
                  </Text>
                  <Text style={[typography.caption, styles.tag]}>{location.tankTypeLabel}</Text>
                </View>

                <View style={styles.bar}>
                  <View
                    style={[
                      styles.fill,
                      {
                        width: `${percentage}%`,
                        backgroundColor: isBuffer ? semanticColors.accent : semanticColors.primary,
                      },
                    ]}
                  />
                </View>

                <Text style={[typography.caption, styles.muted]}>
                  {formatLiters(location.quantityLiters)} de cette huile · capacité{" "}
                  {formatLiters(location.capacityLiters)}
                  {location.batchNumbers ? ` · lot ${location.batchNumbers}` : ""}
                </Text>
              </View>
            );
          })
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
  location: { gap: spacing.sm },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: spacing.md,
  },
  tag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
    backgroundColor: semanticColors.accentSoft,
    color: colors.gold[700],
    fontWeight: "700",
  },
  bar: {
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
    overflow: "hidden",
  },
  fill: { height: "100%" },
  muted: { color: semanticColors.textSecondary },
  primaryText: { color: semanticColors.textPrimary },
});
