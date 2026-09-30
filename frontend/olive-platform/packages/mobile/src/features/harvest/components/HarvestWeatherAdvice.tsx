import { useEffect, useState, type ComponentType } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  IconAlertTriangle,
  IconCircleCheck,
  IconInfoCircle,
  IconShieldX,
} from "@tabler/icons-react-native";

import type {
  HarvestWeatherAdvice as Advice,
  WeatherAdviceLevel,
  WeatherDay,
} from "@olive-platform/core/features/weather/domain/entities/WeatherForecast";
import { WeatherRepository } from "@olive-platform/core/features/weather/data/repositories/WeatherRepository";
import { colors } from "../../../consts/Colors";
import { typography } from "../../../consts/Typography";
import { radius, spacing } from "../../../consts/spacing";

// Couleurs et icône par niveau de conseil (mêmes que le web).
export const LEVEL_STYLES: Record<
  WeatherAdviceLevel,
  { color: string; background: string; icon: ComponentType<{ size?: number; color?: string }> }
> = {
  ok: { color: colors.olive[700], background: colors.olive[100], icon: IconCircleCheck },
  info: { color: colors.teal[700], background: colors.teal[100], icon: IconInfoCircle },
  warning: { color: colors.gold[700], background: colors.gold[100], icon: IconAlertTriangle },
  danger: { color: colors.rust[600], background: colors.rust[100], icon: IconShieldX },
};

export const formatDay = (date: string) =>
  new Date(`${date}T12:00:00`).toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  });

export const summary = (day: WeatherDay) =>
  [
    day.conditions,
    day.tempMax !== null ? `${Math.round(day.tempMax)}°` : null,
    `pluie ${Number(day.precipitationMm ?? 0).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} mm`,
    day.windSpeedKmh !== null ? `vent ${Math.round(day.windSpeedKmh)} km/h` : null,
  ]
    .filter(Boolean)
    .join(" · ");

type Props = {
  plotId: number | null;
  // « AAAA-MM-JJ ».
  date: string;
  // Remplace la date du formulaire par le jour conseillé.
  onPickDate?: (date: string) => void;
  // Le formulaire en a besoin pour confirmer une date déconseillée.
  onAdviceChange?: (advice: Advice | null) => void;
};

/**
 * Conseil météo pour récolter une parcelle à une date (règles côté API) :
 * un conseil, jamais une interdiction.
 */
export function HarvestWeatherAdvice({ plotId, date, onPickDate, onAdviceChange }: Props) {
  // Conseil de la dernière requête, avec sa clé : ignoré s'il ne correspond
  // plus à la parcelle et à la date affichées.
  const [result, setResult] = useState<{ key: string; advice: Advice | null } | null>(null);

  const key = plotId && date ? `${plotId}:${date}` : null;

  useEffect(() => {
    if (!key || !plotId) return;

    let cancelled = false;

    WeatherRepository.getHarvestAdvice(plotId, date)
      .then((advice) => {
        if (cancelled) return;
        setResult({ key, advice });
        onAdviceChange?.(advice);
      })
      .catch(() => {
        // Météo indisponible : pas de conseil, la planification continue.
        if (cancelled) return;
        setResult({ key, advice: null });
        onAdviceChange?.(null);
      });

    return () => {
      cancelled = true;
    };
    // onAdviceChange : rappel du parent, pas une dépendance de chargement.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  if (!key) return null;

  if (result?.key !== key) {
    return <Text style={[typography.caption, styles.muted]}>Chargement de la météo...</Text>;
  }

  const advice = result.advice;

  if (!advice) return null;

  const style = LEVEL_STYLES[advice.level] ?? LEVEL_STYLES.info;
  const Icon = style.icon;

  return (
    <View style={[styles.box, { backgroundColor: style.background, borderColor: style.color }]}>
      <View style={styles.header}>
        <Icon size={18} color={style.color} />
        <Text style={[typography.bodyStrong, { color: style.color }, styles.flex]}>
          {advice.level === "ok"
            ? "Météo favorable"
            : advice.forecastAvailable
              ? "Météo à surveiller"
              : "Météo"}
          {" — "}
          {formatDay(advice.date)}
        </Text>
      </View>

      {advice.day && <Text style={[typography.caption, styles.text]}>{summary(advice.day)}</Text>}

      {advice.warnings.map((warning) => (
        <Text
          key={warning.code}
          style={[typography.caption, { color: LEVEL_STYLES[warning.level]?.color ?? style.color }]}
        >
          • {warning.message}
        </Text>
      ))}

      {advice.suggestedDate && (
        <View style={styles.suggestion}>
          <Text style={[typography.caption, styles.text, styles.flex]}>
            💡 Jour conseillé : <Text style={styles.bold}>{formatDay(advice.suggestedDate)}</Text>
            {advice.suggestedDay ? ` (${summary(advice.suggestedDay)})` : ""}
          </Text>

          {onPickDate && (
            <Pressable
              style={[styles.pick, { borderColor: style.color }]}
              onPress={() => onPickDate(advice.suggestedDate!)}
            >
              <Text style={[typography.caption, styles.bold, { color: style.color }]}>Choisir</Text>
            </Pressable>
          )}
        </View>
      )}
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
  muted: { color: colors.textSecondary },
  bold: { fontWeight: "700" },
  suggestion: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  pick: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
});
