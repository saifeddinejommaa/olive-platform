import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarElement, CategoryScale, Chart as ChartJS, LinearScale, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { colors } from '@olive-platform/core/theme/Colors';
import styles from '../styles/dashboard.module.css';
import Card from '../../../../common/widgets/card/Card';
import type {
  YieldIndicators,
  YieldRow,
} from '@olive-platform/core/features/indicators/domain/entities/YieldIndicators';
import { IndicatorRepository } from '@olive-platform/core/features/indicators/data/repositories/IndicatorRepository';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

const formatLiters = (value: number) =>
  `${Number(value).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} L`;

export interface YieldSummaryCardProps {
  // Campagne sélectionnée : la carte se recharge quand elle change.
  seasonId: number | null;
}

/**
 * Résumé des rendements de la campagne : moyenne, tendance par mois, meilleure
 * et plus faible source (parcelle ou fournisseur). Le détail est sur la page
 * Indicateurs.
 */
export const YieldSummaryCard: React.FC<YieldSummaryCardProps> = ({ seasonId }) => {
  const navigate = useNavigate();
  const [yields, setYields] = useState<YieldIndicators | null>(null);

  useEffect(() => {
    let cancelled = false;

    IndicatorRepository.getYields()
      .then((data) => {
        if (!cancelled) setYields(data);
      })
      .catch(() => {
        // Carte masquée si l'API ne répond pas : le reste du tableau de bord s'affiche.
        if (!cancelled) setYields(null);
      });

    return () => {
      cancelled = true;
    };
  }, [seasonId]);

  if (!yields) return null;

  const { totals } = yields;

  // Sources comparables : parcelles (récolte) et fournisseurs (achat).
  const sources: YieldRow[] = [...yields.byPlot, ...yields.bySupplier].sort(
    (a, b) => Number(b.litersPer100Kg) - Number(a.litersPer100Kg),
  );
  const best = sources[0];
  const worst = sources.length > 1 ? sources[sources.length - 1] : undefined;

  const chartData = {
    labels: yields.byMonth.map((month) => month.label),
    datasets: [
      {
        data: yields.byMonth.map((month) => Number(month.litersPer100Kg)),
        backgroundColor: colors.olive[700],
        borderRadius: 4,
        maxBarThickness: 18,
      },
    ],
  };

  return (
    <Card headerAction={<h3 className={styles.panelTitle}>Rendement</h3>}>
      {totals.pressingsCount === 0 ? (
        <span style={{ fontSize: 12.5, color: 'var(--color-muted)' }}>
          Aucune pression terminée sur cette campagne.
        </span>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className={styles.donutWrap}>
            <div style={{ display: 'flex', flexDirection: 'column', minWidth: 110 }}>
              <span className={styles.donutCenterValue}>{formatLiters(totals.litersPer100Kg)}</span>
              <span className={styles.donutCenterLabel}>
                pour 100 kg · {Number(totals.yieldPercentage).toLocaleString('fr-FR')} %
              </span>
            </div>

            {/* Tendance par mois. */}
            <div style={{ flex: 1, height: 60 }}>
              <Bar
                data={chartData}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: (item) => `${formatLiters(Number(item.raw))} / 100 kg`,
                      },
                    },
                  },
                  scales: {
                    x: { display: false },
                    y: { display: false, beginAtZero: true },
                  },
                }}
              />
            </div>
          </div>

          <ul className={styles.donutLegend}>
            <li>
              {totals.pressingsCount} pression{totals.pressingsCount > 1 ? 's' : ''} ·{' '}
              {Number(totals.oliveKg).toLocaleString('fr-FR')} kg → {formatLiters(totals.oilLiters)}
            </li>

            {best && (
              <li>
                <span className={styles.legendDotHarvested} />
                Meilleur : {best.label} — {formatLiters(best.litersPer100Kg)}
              </li>
            )}

            {worst && worst.key !== best?.key && (
              <li>
                <span className={styles.legendDotUnpaid} />
                Plus faible : {worst.label} — {formatLiters(worst.litersPer100Kg)}
              </li>
            )}
          </ul>

          <button
            type="button"
            onClick={() => navigate('/indicators')}
            style={{
              alignSelf: 'flex-end',
              border: 'none',
              background: 'none',
              padding: 0,
              color: 'var(--color-olive-700)',
              fontWeight: 600,
              fontSize: 12.5,
              cursor: 'pointer',
            }}
          >
            Voir le détail →
          </button>
        </div>
      )}
    </Card>
  );
};

export default YieldSummaryCard;
