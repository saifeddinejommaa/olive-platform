import { useEffect, useState } from "react";
import { BarElement, CategoryScale, Chart as ChartJS, LinearScale, Tooltip } from "chart.js";
import { Bar } from "react-chartjs-2";

import Card from "../../../../common/widgets/card/Card";
import InfoFieldWidget from "../../../../common/widgets/InfoFieldWidget";
import { usePageTitle } from "../../../../common/hooks/usePageTitle";
import { useSeasonStore } from "../../../../stores/SeasonStore";
import YieldTable from "../components/YieldTable";

import { colors } from "@olive-platform/core/theme/Colors";
import type { YieldIndicators } from "@olive-platform/core/features/indicators/domain/entities/YieldIndicators";
import { IndicatorRepository } from "@olive-platform/core/features/indicators/data/repositories/IndicatorRepository";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

const formatNumber = (value: number, digits = 1) =>
  Number(value).toLocaleString("fr-FR", { maximumFractionDigits: digits });

/**
 * Indicateurs de décision de la campagne. Tout est calculé à partir des
 * pressions terminées : rien n'est estimé.
 */
export default function IndicatorsPage() {
  usePageTitle(
    "Indicateurs",
    "Rendements de la campagne par variété, parcelle, fournisseur et mois.",
  );

  const selectedSeasonId = useSeasonStore((state) => state.selectedSeasonId);

  const [yields, setYields] = useState<YieldIndicators | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Rechargé au changement de campagne.
  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    IndicatorRepository.getYields()
      .then((data) => {
        if (!cancelled) setYields(data);
      })
      .catch(() => {
        if (!cancelled) setError("Impossible de charger les indicateurs.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedSeasonId]);

  if (error) {
    return (
      <div className="feature-page">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (!yields) {
    return (
      <div className="feature-page">
        {loading && <div className="loading">Chargement des indicateurs...</div>}
      </div>
    );
  }

  const { totals } = yields;
  const average = Number(totals.litersPer100Kg);

  const monthChart = {
    labels: yields.byMonth.map((month) => month.label),
    datasets: [
      {
        data: yields.byMonth.map((month) => Number(month.litersPer100Kg)),
        backgroundColor: colors.olive[700],
        borderRadius: 6,
        maxBarThickness: 48,
      },
    ],
  };

  return (
    <div className="feature-page">
      {/* ==================== CAMPAGNE ==================== */}
      <Card>
        <div className="filters">
          <div className="filters-header">
            <div>
              <h3>Rendement de la campagne</h3>
              <span>
                Pressions terminées. L'huile d'une pression est répartie sur ses lots au prorata
                des kilos d'olives.
              </span>
            </div>
          </div>

          {totals.pressingsCount === 0 ? (
            <span className="tank-cell__sub">Aucune pression terminée sur cette campagne.</span>
          ) : (
            <div className="info-grid">
              <InfoFieldWidget label="Pressions terminées" value={String(totals.pressingsCount)} />
              <InfoFieldWidget label="Olives pressées" value={`${formatNumber(totals.oliveKg, 0)} kg`} />
              <InfoFieldWidget label="Huile produite" value={`${formatNumber(totals.oilLiters)} L`} />
              <InfoFieldWidget
                label="Litres pour 100 kg"
                value={`${formatNumber(totals.litersPer100Kg, 2)} L`}
              />
              <InfoFieldWidget
                label="Rendement (poids)"
                value={`${formatNumber(totals.yieldPercentage, 2)} %`}
              />
            </div>
          )}
        </div>
      </Card>

      {/* ==================== PAR MOIS ==================== */}
      {yields.byMonth.length > 0 && (
        <Card>
          <div className="filters">
            <div className="filters-header">
              <div>
                <h3>Évolution par mois</h3>
                <span>Litres d'huile pour 100 kg d'olives, selon la date de fin de pression.</span>
              </div>
            </div>

            <div style={{ height: 220 }}>
              <Bar
                data={monthChart}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: (item) => `${formatNumber(Number(item.raw), 2)} L / 100 kg`,
                      },
                    },
                  },
                  scales: {
                    x: { grid: { display: false } },
                    y: { beginAtZero: true, title: { display: true, text: "L / 100 kg" } },
                  },
                }}
              />
            </div>
          </div>
        </Card>
      )}

      {/* ==================== REGROUPEMENTS ==================== */}
      <YieldTable
        title="Par variété"
        description="Une pression qui mélange plusieurs variétés donne un rendement moyen : pressez-les séparément pour les comparer."
        groupLabel="Variété"
        rows={yields.byVariety}
        averageLitersPer100Kg={average}
        emptyMessage="Aucune pression terminée."
      />

      <YieldTable
        title="Par parcelle"
        description="Olives récoltées : quelle parcelle donne le plus d'huile par kilo."
        groupLabel="Parcelle"
        rows={yields.byPlot}
        averageLitersPer100Kg={average}
        emptyMessage="Aucune olive récoltée pressée sur cette campagne."
      />

      <YieldTable
        title="Par fournisseur"
        description="Olives achetées : quel fournisseur donne le plus d'huile par kilo."
        groupLabel="Fournisseur"
        rows={yields.bySupplier}
        averageLitersPer100Kg={average}
        emptyMessage="Aucune olive achetée pressée sur cette campagne."
      />
    </div>
  );
}
