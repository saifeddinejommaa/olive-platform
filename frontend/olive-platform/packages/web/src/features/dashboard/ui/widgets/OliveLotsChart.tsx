import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { colors } from "@olive-platform/core/theme/Colors";
import styles from "../styles/dashboard.module.css";
import type { OliveLotsOverview } from "@olive-platform/core/features/dashboard/domain/dashboard.types";
import Card from "../../../../common/widgets/card/Card";

ChartJS.register(ArcElement, Tooltip);

export interface OliveLotsChartProps {
  data: OliveLotsOverview;
  // Action affichée à droite du titre (ex. « Planifier des pressions »).
  action?: React.ReactNode;
}

const formatKg = (value: number) =>
  `${value.toLocaleString("fr-TN", { maximumFractionDigits: 0 })} kg`;

const plural = (count: number) => `${count} lot${count > 1 ? "s" : ""}`;

// Répartition des olives de la campagne selon l'état de leurs lots.
export const OliveLotsChart: React.FC<OliveLotsChartProps> = ({ data, action }) => {
  const segments = [
    {
      label: "Prêt à presser",
      kg: data.readyKg,
      lots: data.readyLots,
      color: colors.olive[600],
    },
    {
      label: "En attente d'analyse",
      kg: data.pendingAnalysisKg,
      lots: data.pendingAnalysisLots,
      color: colors.gold[600],
    },
    {
      label: "En pression",
      kg: data.inPressingKg,
      lots: data.inPressingLots,
      color: colors.teal[700],
    },
    {
      label: "Pressé",
      kg: data.pressedKg,
      lots: data.pressedLots,
      color: colors.textMuted,
    },
  ];

  const hasData = segments.some((segment) => segment.kg > 0);

  const chartData = {
    labels: segments.map((segment) => segment.label),
    datasets: [
      {
        data: segments.map((segment) => segment.kg),
        backgroundColor: segments.map((segment) => segment.color),
        borderWidth: 0,
      },
    ],
  };

  return (
    <Card
      headerAction={
        <div className={styles.lotsHeader}>
          <h3 className={styles.panelTitle}>
            Lots d'olives{" "}
            <span className={styles.panelMeta}>· {plural(data.totalLots)}</span>
          </h3>
          {action}
        </div>
      }
    >
      {!hasData ? (
        <div className={styles.panelMeta}>
          Aucun lot d'olives sur cette campagne.
        </div>
      ) : (
        <>
          <div className={styles.lotsWrap}>
            <div className={styles.lotsDonut}>
              <Doughnut
                data={chartData}
                options={{
                  cutout: "70%",
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: (item) => {
                          const segment = segments[item.dataIndex];
                          return `${segment.label} : ${formatKg(segment.kg)} (${plural(segment.lots)})`;
                        },
                      },
                    },
                  },
                }}
              />
              <div className={styles.donutCenter}>
                <span className={styles.donutCenterValue}>
                  {formatKg(data.totalKg)}
                </span>
                <span className={styles.donutCenterLabel}>d'olives</span>
              </div>
            </div>

            <ul className={styles.lotsLegend}>
              {segments.map((segment) => (
                <li key={segment.label} className={styles.lotsLegendRow}>
                  <span
                    className={styles.legendDot}
                    style={{ background: segment.color }}
                  />
                  <span className={styles.lotsLegendLabel}>{segment.label}</span>
                  <span className={styles.lotsLegendValue}>{formatKg(segment.kg)}</span>
                  <span className={styles.lotsLegendMeta}>{plural(segment.lots)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.lotsFooter}>
            <span>Récolte — {formatKg(data.harvestKg)}</span>
            <span>Achat — {formatKg(data.purchaseKg)}</span>
          </div>
        </>
      )}
    </Card>
  );
};

export default OliveLotsChart;
