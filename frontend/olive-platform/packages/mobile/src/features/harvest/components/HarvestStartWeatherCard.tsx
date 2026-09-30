import { StyleSheet, Text, View } from "react-native";

import type { HarvestStartWeather } from "@olive-platform/core/features/harvests/domain/entities/HarvestStartWeather";
import { formatStringToDateTime } from "@olive-platform/core/features/shared/utils/DatesUtils";
import { colors } from "../../../consts/Colors";
import { typography } from "../../../consts/Typography";
import { radius, spacing } from "../../../consts/spacing";
import { LEVEL_STYLES, summary } from "./HarvestWeatherAdvice";

type Props = {
  weather: HarvestStartWeather;
};

// Météo enregistrée au lancement de la récolte (trace pour l'analyse du rendement).
export function HarvestStartWeatherCard({ weather }: Props) {
  const style = LEVEL_STYLES[weather.level] ?? LEVEL_STYLES.info;
  const Icon = style.icon;

  const hasForecast = weather.tempMax !== null || weather.precipitationMm !== null;

  return (
    <View style={[styles.box, { backgroundColor: style.background, borderColor: style.color }]}>
      <View style={styles.header}>
        <Icon size={18} color={style.color} />
        <Text style={[typography.bodyStrong, { color: style.color }, styles.flex]}>
          Météo au lancement — {formatStringToDateTime(weather.checkedAt)}
        </Text>
      </View>

      {weather.startedDespiteWarning && (
        <View style={styles.badge}>
          <Text style={[typography.caption, styles.badgeText]}>Lancée malgré l’alerte</Text>
        </View>
      )}

      {hasForecast && (
        <Text style={[typography.caption, styles.text]}>
          {summary({
            date: weather.weatherDate,
            tempMin: weather.tempMin,
            tempMax: weather.tempMax,
            precipitationMm: weather.precipitationMm,
            precipitationProbability: weather.precipitationProbability,
            windSpeedKmh: weather.windSpeedKmh,
            conditions: weather.conditions,
            icon: null,
          })}
          {weather.previousRainMm
            ? ` · ${weather.previousRainMm.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} mm les 2 jours avant`
            : ""}
        </Text>
      )}

      {weather.warnings.map((warning) => (
        <Text
          key={warning.code}
          style={[typography.caption, { color: LEVEL_STYLES[warning.level]?.color ?? style.color }]}
        >
          • {warning.message}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    gap: spacing.xs,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  header: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  flex: { flex: 1 },
  text: { color: colors.textPrimary },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: spacing.md,
    paddingVertical: 2,
    borderRadius: radius.pill,
    backgroundColor: colors.rust[600],
  },
  badgeText: { color: "#fff", fontWeight: "700" },
});
