import type { HarvestStartWeather } from "@olive-platform/core/features/harvests/domain/entities/HarvestStartWeather";
import { formatStringToDateTime } from "@olive-platform/core/features/shared/utils/DatesUtils";
import { LEVEL_STYLES, summary } from "./HarvestWeatherAdvice";

type Props = {
  weather: HarvestStartWeather;
};

// Météo enregistrée au lancement de la récolte (trace pour l'analyse du rendement).
export default function HarvestStartWeatherCard({ weather }: Props) {
  const style = LEVEL_STYLES[weather.level] ?? LEVEL_STYLES.info;
  const Icon = style.icon;

  const hasForecast = weather.tempMax !== null || weather.precipitationMm !== null;

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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <strong style={{ display: "flex", alignItems: "center", gap: 6, color: style.color }}>
          <Icon size={18} />
          Météo au lancement — {formatStringToDateTime(weather.checkedAt)}
        </strong>

        {weather.startedDespiteWarning && (
          <span
            style={{
              padding: "2px 10px",
              borderRadius: 999,
              background: LEVEL_STYLES.danger.color,
              color: "#fff",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            Lancée malgré l'alerte
          </span>
        )}
      </div>

      {hasForecast && (
        <span>
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
        </span>
      )}

      {weather.warnings.length > 0 && (
        <ul style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 4 }}>
          {weather.warnings.map((warning) => (
            <li key={warning.code} style={{ color: LEVEL_STYLES[warning.level]?.color }}>
              {warning.message}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
