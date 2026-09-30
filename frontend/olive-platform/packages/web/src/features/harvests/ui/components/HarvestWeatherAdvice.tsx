import { useEffect, useState } from "react";
import {
  IconAlertTriangle,
  IconCircleCheck,
  IconInfoCircle,
  IconShieldX,
} from "@tabler/icons-react";

import Button from "../../../../common/widgets/button/Button";
import { colors } from "@olive-platform/core/theme/Colors";
import type {
  HarvestWeatherAdvice as Advice,
  WeatherAdviceLevel,
  WeatherDay,
} from "@olive-platform/core/features/weather/domain/entities/WeatherForecast";
import { WeatherRepository } from "@olive-platform/core/features/weather/data/repositories/WeatherRepository";

// Couleurs et icône par niveau de conseil.
export const LEVEL_STYLES: Record<WeatherAdviceLevel, { color: string; background: string; icon: typeof IconInfoCircle }> = {
  ok: { color: colors.olive[700], background: colors.olive[100], icon: IconCircleCheck },
  info: { color: colors.teal[700], background: colors.teal[100], icon: IconInfoCircle },
  warning: { color: colors.gold[700], background: colors.gold[100], icon: IconAlertTriangle },
  danger: { color: colors.rust[600], background: colors.rust[100], icon: IconShieldX },
};

const formatDay = (date: string) =>
  new Date(`${date}T12:00:00`).toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  });

export const summary = (day: WeatherDay) =>
  [
    day.conditions,
    day.tempMax !== null ? `${Math.round(day.tempMax)}°` : null,
    `pluie ${Number(day.precipitationMm ?? 0).toLocaleString("fr-FR", { maximumFractionDigits: 1 })} mm${
      day.precipitationProbability !== null ? ` (${Math.round(day.precipitationProbability)} %)` : ""
    }`,
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
export default function HarvestWeatherAdvice({ plotId, date, onPickDate, onAdviceChange }: Props) {
  const [advice, setAdvice] = useState<Advice | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!plotId || !date) {
      setAdvice(null);
      onAdviceChange?.(null);
      return;
    }

    let cancelled = false;
    setLoading(true);

    WeatherRepository.getHarvestAdvice(plotId, date)
      .then((data) => {
        if (cancelled) return;
        setAdvice(data);
        onAdviceChange?.(data);
      })
      .catch(() => {
        // Météo indisponible : pas de conseil, la planification continue.
        if (cancelled) return;
        setAdvice(null);
        onAdviceChange?.(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // onAdviceChange : rappel du parent, pas une dépendance de chargement.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plotId, date]);

  if (!plotId || !date) return null;

  if (loading && !advice) {
    return <div style={{ fontSize: 13, color: "var(--color-muted)" }}>Chargement de la météo...</div>;
  }

  if (!advice) return null;

  return <WeatherAdviceView advice={advice} onPickDate={onPickDate} />;
}

type ViewProps = {
  advice: Advice;
  onPickDate?: (date: string) => void;
};

// Affichage d'un conseil déjà chargé (planification, confirmation du lancement).
export function WeatherAdviceView({ advice, onPickDate }: ViewProps) {
  const style = LEVEL_STYLES[advice.level] ?? LEVEL_STYLES.info;
  const Icon = style.icon;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        padding: "12px 14px",
        borderRadius: 10,
        background: style.background,
        border: `1px solid ${style.color}33`,
        fontSize: 13,
      }}
    >
      <strong style={{ display: "flex", alignItems: "center", gap: 6, color: style.color }}>
        <Icon size={18} />
        {advice.level === "ok"
          ? "Météo favorable"
          : advice.forecastAvailable
            ? "Météo à surveiller"
            : "Météo"}
        {" — "}
        {formatDay(advice.date)} · {advice.plotReference}
      </strong>

      {advice.day && <span>{summary(advice.day)}</span>}

      {advice.warnings.length > 0 && (
        <ul style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 4 }}>
          {advice.warnings.map((warning) => (
            <li key={warning.code} style={{ color: LEVEL_STYLES[warning.level]?.color }}>
              {warning.message}
            </li>
          ))}
        </ul>
      )}

      {advice.suggestedDate && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <span>
            💡 Jour conseillé : <strong>{formatDay(advice.suggestedDate)}</strong>
            {advice.suggestedDay ? ` (${summary(advice.suggestedDay)})` : ""}
          </span>
          {onPickDate && (
            <Button variant="outline" size="sm" onClick={() => onPickDate(advice.suggestedDate!)}>
              Choisir cette date
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
