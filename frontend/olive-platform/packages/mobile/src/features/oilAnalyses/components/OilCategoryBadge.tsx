import { StyleSheet, Text, View } from "react-native";

import {
  OIL_CATEGORY_LABELS,
  OilCategory,
} from "@olive-platform/core/features/tanks/domain/entities/Tank";
import { colors } from "../../../consts/Colors";
import { typography } from "../../../consts/Typography";
import { radius, spacing } from "../../../consts/spacing";

// Couleurs par catégorie (fixée par l'API, jamais calculée ici).
const CATEGORY_COLORS: Partial<Record<OilCategory, { color: string; background: string }>> = {
  [OilCategory.ExtraVirgin]: { color: colors.olive[800], background: colors.olive[100] },
  [OilCategory.Virgin]: { color: colors.gold[700], background: colors.gold[100] },
  [OilCategory.Lampante]: { color: colors.rust[600], background: colors.rust[100] },
};

type Props = {
  // null : catégorie inconnue (en attente d'analyse).
  category: OilCategory | null | undefined;
};

export function OilCategoryBadge({ category }: Props) {
  const palette = (category && CATEGORY_COLORS[category]) ?? {
    color: colors.textSecondary,
    background: colors.border,
  };

  return (
    <View style={[styles.badge, { backgroundColor: palette.background }]}>
      <Text style={[typography.caption, styles.label, { color: palette.color }]}>
        {category ? OIL_CATEGORY_LABELS[category] : "En attente d'analyse"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  label: { fontWeight: "700" },
});
