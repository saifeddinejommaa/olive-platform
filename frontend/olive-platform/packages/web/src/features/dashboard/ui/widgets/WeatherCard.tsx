import React, { useEffect, useState } from 'react';
import {
  IconCloud,
  IconCloudRain,
  IconDroplet,
  IconMapPin,
  IconMist,
  IconMoon,
  IconSnowflake,
  IconSun,
  IconWind,
  type Icon as TablerIcon,
} from '@tabler/icons-react';
import { colors } from '@olive-platform/core/theme/Colors';
import styles from '../styles/dashboard.module.css';
import Card from '../../../../common/widgets/card/Card';
import type {
  WeatherDay,
  WeatherForecast,
} from '@olive-platform/core/features/weather/domain/entities/WeatherForecast';
import { WeatherRepository } from '@olive-platform/core/features/weather/data/repositories/WeatherRepository';

// Pictogrammes Visual Crossing → icônes de l'application (mêmes que le mobile).
const WEATHER_ICONS: Record<string, { icon: TablerIcon; color: string }> = {
  'clear-day': { icon: IconSun, color: colors.gold[600] },
  'clear-night': { icon: IconMoon, color: colors.textSecondary },
  'partly-cloudy-day': { icon: IconSun, color: colors.gold[600] },
  'partly-cloudy-night': { icon: IconMoon, color: colors.textSecondary },
  cloudy: { icon: IconCloud, color: colors.textSecondary },
  rain: { icon: IconCloudRain, color: colors.teal[700] },
  showers: { icon: IconCloudRain, color: colors.teal[700] },
  snow: { icon: IconSnowflake, color: colors.teal[700] },
  fog: { icon: IconMist, color: colors.textSecondary },
  wind: { icon: IconWind, color: colors.textSecondary },
};

const iconOf = (day: WeatherDay) =>
  WEATHER_ICONS[day.icon ?? ''] ?? { icon: IconCloud, color: colors.textSecondary };

// Pluie notable : mise en évidence (premier conseil pour planifier une récolte).
const isRainy = (day: WeatherDay) =>
  Number(day.precipitationMm ?? 0) >= 1 || Number(day.precipitationProbability ?? 0) >= 60;

const formatTemp = (value: number | null) => (value !== null ? `${Math.round(value)}°` : '—');

const weekday = (date: string) =>
  new Date(`${date}T12:00:00`).toLocaleDateString('fr-FR', { weekday: 'short' }).replace('.', '');

/**
 * Météo de la première parcelle géolocalisée : aujourd'hui en détail, puis
 * les jours suivants, jours de pluie mis en évidence.
 */
export const WeatherCard: React.FC = () => {
  const [forecast, setForecast] = useState<WeatherForecast | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    WeatherRepository.getForecast()
      .then((data) => {
        if (cancelled) return;
        setForecast(data);
        setMessage(data.days.length === 0 ? 'Météo indisponible pour le moment.' : null);
      })
      .catch((error) => {
        if (cancelled) return;
        // Ex. aucune parcelle géolocalisée : le message de l'API l'explique.
        setMessage(error instanceof Error && error.message ? error.message : 'Météo indisponible.');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const [today, ...nextDays] = forecast?.days ?? [];

  return (
    <Card headerAction={<h3 className={styles.panelTitle}>Météo</h3>}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12.5, color: 'var(--color-muted)' }}>
          <IconMapPin size={14} />
          {forecast ? `${forecast.plotReference} · ${forecast.plotName}` : 'Première parcelle géolocalisée'}
        </span>

        {!today ? (
          <span style={{ fontSize: 13, color: 'var(--color-muted)' }}>
            {message ?? 'Chargement de la météo...'}
          </span>
        ) : (
          <>
            {/* Aujourd'hui */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <TodayIcon day={today} />

              <div style={{ flex: 1, minWidth: 0 }}>
                <div className={styles.donutCenterValue} style={{ fontSize: 28 }}>
                  {formatTemp(today.tempMax)}
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--color-muted)' }}>
                  {today.conditions ?? '—'} · min {formatTemp(today.tempMin)}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, fontSize: 12.5 }}>
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    color: isRainy(today) ? colors.teal[700] : 'var(--color-muted)',
                    fontWeight: isRainy(today) ? 600 : 400,
                  }}
                >
                  <IconDroplet size={14} />
                  {Number(today.precipitationMm ?? 0).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} mm
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--color-muted)' }}>
                  <IconWind size={14} />
                  {Math.round(Number(today.windSpeedKmh ?? 0))} km/h
                </span>
              </div>
            </div>

            {/* Jours suivants */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${Math.max(nextDays.length, 1)}, 1fr)`,
                gap: 4,
                paddingTop: 12,
                borderTop: '1px solid var(--color-border)',
              }}
            >
              {nextDays.map((day) => {
                const { icon: Icon, color } = iconOf(day);
                const rainy = isRainy(day);

                return (
                  <div
                    key={day.date}
                    title={day.conditions ?? undefined}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 3,
                      padding: '6px 0',
                      borderRadius: 8,
                      background: rainy ? colors.teal[100] : 'transparent',
                      fontSize: 12,
                    }}
                  >
                    <span style={{ color: 'var(--color-muted)', textTransform: 'capitalize' }}>
                      {weekday(day.date)}
                    </span>
                    <Icon size={20} color={color} />
                    <strong>{formatTemp(day.tempMax)}</strong>
                    <span
                      style={{
                        fontSize: 11,
                        color: rainy ? colors.teal[700] : 'var(--color-muted)',
                        fontWeight: rainy ? 600 : 400,
                      }}
                    >
                      {Math.round(Number(day.precipitationMm ?? 0))} mm
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

function TodayIcon({ day }: { day: WeatherDay }) {
  const { icon: Icon, color } = iconOf(day);

  return (
    <div
      style={{
        width: 48,
        height: 48,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-bg)',
        flexShrink: 0,
      }}
    >
      <Icon size={28} color={color} />
    </div>
  );
}

export default WeatherCard;
