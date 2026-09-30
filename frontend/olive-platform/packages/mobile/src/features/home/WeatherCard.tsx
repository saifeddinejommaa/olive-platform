import { useCallback, useState, type ComponentType } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useFocusEffect } from "expo-router";
import {
  IconCloud,
  IconCloudRain,
  IconMapPin,
  IconMist,
  IconMoon,
  IconSnowflake,
  IconSun,
  IconWind,
  IconDroplet,
} from "@tabler/icons-react-native";

import type {
  WeatherDay,
  WeatherForecast,
} from "@olive-platform/core/features/weather/domain/entities/WeatherForecast";
import { WeatherRepository } from "@olive-platform/core/features/weather/data/repositories/WeatherRepository";
import { colors, semanticColors } from "../../consts/Colors";
import { typography } from "../../consts/Typography";
import { radius, shadow, spacing } from "../../consts/spacing";

type IconComponent = ComponentType<{ size?: number; color?: string }>;

// Pictogrammes Visual Crossing → icônes de l'application.
const WEATHER_ICONS: Record<string, { icon: IconComponent; color: string }> = {
  "clear-day": { icon: IconSun, color: colors.gold[600] },
  "clear-night": { icon: IconMoon, color: colors.textSecondary },
  "partly-cloudy-day": { icon: IconSun, color: colors.gold[600] },
  "partly-cloudy-night": { icon: IconMoon, color: colors.textSecondary },
  cloudy: { icon: IconCloud, color: colors.textSecondary },
  rain: { icon: IconCloudRain, color: colors.teal[700] },
  showers: { icon: IconCloudRain, color: colors.teal[700] },
  snow: { icon: IconSnowflake, color: colors.teal[700] },
  fog: { icon: IconMist, color: colors.textSecondary },
  wind: { icon: IconWind, color: colors.textSecondary },
};

const iconOf = (day: WeatherDay) =>
  WEATHER_ICONS[day.icon ?? ""] ?? { icon: IconCloud, color: colors.textSecondary };

// Pluie notable : on la met en évidence (premier conseil pour une récolte).
const isRainy = (day: WeatherDay) =>
  Number(day.precipitationMm ?? 0) >= 1 || Number(day.precipitationProbability ?? 0) >= 60;

const formatTemp = (value: number | null) => (value !== null ? `${Math.round(value)}°` : "—");

const formatMm = (value: number | null) =>
  `${Number(value ?? 0).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} mm`;

const weekday = (date: string) =>
  new Date(`${date}T12:00:00`).toLocaleDateString("fr-FR", { weekday: "short" }).replace(".", "");

/**
 * Météo de la première parcelle géolocalisée : aujourd'hui en détail, puis les
 * jours suivants ; les jours de pluie sont mis en évidence.
 */
export function WeatherCard() {
  const [forecast, setForecast] = useState<WeatherForecast | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Rechargé au retour sur l'accueil (le serveur met la météo en cache).
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      WeatherRepository.getForecast()
        .then((data) => {
          if (cancelled) return;
          setForecast(data);
          setMessage(data.days.length === 0 ? "Météo indisponible pour le moment." : null);
        })
        .catch((error) => {
          if (cancelled) return;
          // Ex. aucune parcelle géolocalisée : le message de l'API l'explique.
          setMessage(error instanceof Error && error.message ? error.message : "Météo indisponible.");
        });

      return () => {
        cancelled = true;
      };
    }, []),
  );

  const [today, ...nextDays] = forecast?.days ?? [];

  return (
    <View style={styles.card}>
      <View style={styles.location}>
        <IconMapPin size={14} color={colors.textMuted} />
        <Text style={[typography.caption, styles.muted]}>
          {forecast ? `${forecast.plotReference} · ${forecast.plotName}` : "Météo"}
        </Text>
      </View>

      {!today ? (
        <Text style={[typography.body, styles.muted]}>{message ?? "Chargement de la météo..."}</Text>
      ) : (
        <>
          {/* Aujourd'hui */}
          <View style={styles.today}>
            <TodayIcon day={today} />

            <View style={styles.todayMain}>
              <Text style={styles.temperature}>{formatTemp(today.tempMax)}</Text>
              <Text style={[typography.caption, styles.muted]} numberOfLines={1}>
                {today.conditions ?? "—"} · min {formatTemp(today.tempMin)}
              </Text>
            </View>

            <View style={styles.todayStats}>
              <View style={styles.stat}>
                <IconDroplet size={14} color={isRainy(today) ? colors.teal[700] : colors.textMuted} />
                <Text style={[typography.caption, isRainy(today) ? styles.rain : styles.muted]}>
                  {formatMm(today.precipitationMm)}
                </Text>
              </View>
              <View style={styles.stat}>
                <IconWind size={14} color={colors.textMuted} />
                <Text style={[typography.caption, styles.muted]}>
                  {Math.round(Number(today.windSpeedKmh ?? 0))} km/h
                </Text>
              </View>
            </View>
          </View>

          {/* Jours suivants */}
          <View style={styles.days}>
            {nextDays.map((day) => {
              const { icon: Icon, color } = iconOf(day);
              const rainy = isRainy(day);

              return (
                <View key={day.date} style={[styles.day, rainy && styles.dayRainy]}>
                  <Text style={[typography.caption, styles.muted, styles.weekday]}>{weekday(day.date)}</Text>
                  <Icon size={20} color={color} />
                  <Text style={[typography.caption, styles.primaryText, styles.bold]}>
                    {formatTemp(day.tempMax)}
                  </Text>
                  <Text style={[styles.dayRain, rainy ? styles.rain : styles.muted]}>
                    {Math.round(Number(day.precipitationMm ?? 0))} mm
                  </Text>
                </View>
              );
            })}
          </View>
        </>
      )}
    </View>
  );
}

function TodayIcon({ day }: { day: WeatherDay }) {
  const { icon: Icon, color } = iconOf(day);

  return (
    <View style={styles.todayIcon}>
      <Icon size={32} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: semanticColors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: semanticColors.border,
    padding: spacing.lg,
    gap: spacing.md,
    ...shadow.card,
  },
  location: { flexDirection: "row", alignItems: "center", gap: 4 },
  today: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  todayIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  todayMain: { flex: 1, gap: 2 },
  temperature: { fontSize: 30, fontWeight: "700", color: semanticColors.textPrimary },
  todayStats: { gap: 4, alignItems: "flex-end" },
  stat: { flexDirection: "row", alignItems: "center", gap: 4 },
  days: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  day: {
    flex: 1,
    alignItems: "center",
    gap: 4,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
  },
  dayRainy: { backgroundColor: colors.teal[100] },
  weekday: { textTransform: "capitalize" },
  dayRain: { fontSize: 11 },
  rain: { color: colors.teal[700], fontWeight: "700" },
  bold: { fontWeight: "700" },
  primaryText: { color: semanticColors.textPrimary },
  muted: { color: semanticColors.textSecondary },
});
