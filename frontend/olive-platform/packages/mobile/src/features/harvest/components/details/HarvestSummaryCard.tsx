import { StyleSheet, Text, View } from "react-native";
import {
  IconCalendarEvent,
  IconClock,
} from "@tabler/icons-react-native";
import { radius, shadow, spacing } from "../../../../consts/spacing";
import { colors, semanticColors } from "../../../../consts/Colors";
import { typography } from "../../../../consts/Typography";
import { HarvestMetric } from "./HarvestMetric";
import { ProductionStatusBadge } from "../../../../components/ProductionStatusBadge";

type Props = {
  harvest: any;
};

function formatDate(value?: string | null) {
  if (!value) return "—";

  return new Date(value).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(value?: string | null) {
  if (!value) return "—";

  return new Date(value).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function HarvestSummaryCard({ harvest }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <View style={styles.titleContainer}>
          <Text style={[typography.label, styles.label]}>RÉCOLTE</Text>

          <Text style={[typography.h1, styles.title]}>
            {harvest.reference}
          </Text>

          <View style={styles.meta}>
            <IconCalendarEvent
              size={15}
              color={semanticColors.textMuted}
            />

            <Text style={[typography.caption, styles.metaText]}>
              {formatDate(harvest.plannedDate)}
            </Text>

            <IconClock
              size={15}
              color={semanticColors.textMuted}
            />

            <Text style={[typography.caption, styles.metaText]}>
              {formatTime(harvest.startTime)}
            </Text>

            <Text style={[typography.caption, styles.separator]}>—</Text>

            <Text style={[typography.caption, styles.metaText]}>
              {formatTime(harvest.endTime)}
            </Text>
          </View>
        </View>

        <ProductionStatusBadge status={harvest.status} />
      </View>

      <View style={styles.divider} />

      <View style={styles.metrics}>
        <HarvestMetric
          label="Quantité"
          value={
            harvest.quantityKg
              ? `${harvest.quantityKg.toLocaleString()} kg`
              : "—"
          }
        />

        <View style={styles.metricDivider} />

        <HarvestMetric
          label="Oliviers récoltés"
          value={
            harvest.harvestedTrees
              ? harvest.harvestedTrees.toLocaleString()
              : "—"
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: semanticColors.primarySoft,
    borderRadius: radius.xl,
    padding: spacing.xl,
    marginBottom: spacing.md,
    ...shadow.card,
  },

  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  titleContainer: {
    flex: 1,
    marginRight: spacing.md,
  },

  label: {
    color: colors.olive[600],
    marginBottom: spacing.xs,
  },

  title: {
    color: colors.olive[900],
  },

  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    marginTop: spacing.sm,
    flexWrap: "wrap",
  },

  metaText: {
    color: semanticColors.textSecondary,
  },

  separator: {
    color: semanticColors.textMuted,
    marginHorizontal: 1,
  },

  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xl,
  },

  metrics: {
    flexDirection: "row",
    alignItems: "center",
  },

  metricDivider: {
    width: 1,
    height: 36,
    backgroundColor: colors.border,
    marginHorizontal: spacing.lg,
  },
});