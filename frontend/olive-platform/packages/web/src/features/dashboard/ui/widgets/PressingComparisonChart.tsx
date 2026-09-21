import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import styles from "../styles/dashboard.module.css";
import Card from "../../../../common/widgets/card/Card";
import type { PressingComparisonPoint } from "@olive-platform/core/features/dashboard/domain/dashboard.types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

export interface PressingComparisonChartProps {
  data: PressingComparisonPoint[];
}

export const PressingComparisonChart: React.FC<
  PressingComparisonChartProps
> = ({ data }) => {
  const actualPercentage = data.map((item) => {
    if (
      item.actualLiters === null ||
      item.expectedLiters === null ||
      item.expectedLiters === 0
    ) {
      return null;
    }

    return (item.actualLiters / item.expectedLiters) * 100;
  });

  const expectedPercentage = data.map((item) => {
    if (
      item.expectedLiters === null ||
      item.expectedLiters === 0
    ) {
      return null;
    }

    return 100;
  });

  const chartData = {
    labels: data.map((item) => item.operationNumber),

    datasets: [
      {
        label: "Réel",
        data: actualPercentage,

        borderColor: "rgb(55, 69, 31)",
        backgroundColor: "rgba(55, 69, 31, 0.5)",

        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: "rgb(55, 69, 31)",

        borderWidth: 2,
        tension: 0.3,
      },
      {
        label: "Attendu",
        data: expectedPercentage,

        borderColor: "rgb(166, 159, 133)",
        backgroundColor: "rgba(166, 159, 133, 0.5)",

        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: "rgb(166, 159, 133)",

        borderWidth: 2,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "top" as const,
      },

      title: {
        display: false,
      },

      tooltip: {
        callbacks: {
          label: (context: any) => {
            const index = context.dataIndex;
            const operation = data[index];

            if (
              !operation ||
              context.raw === null ||
              context.raw === undefined
            ) {
              return `${context.dataset.label}: -`;
            }

            if (context.dataset.label === "Réel") {
              const actualLiters =
                operation.actualLiters?.toLocaleString("fr-TN", {
                  maximumFractionDigits: 1,
                });

              const percentage = Number(context.raw).toLocaleString(
                "fr-TN",
                {
                  maximumFractionDigits: 1,
                },
              );

              return `Réel: ${actualLiters} L (${percentage} %)`;
            }

            const expectedLiters =
              operation.expectedLiters?.toLocaleString("fr-TN", {
                maximumFractionDigits: 1,
              });

            return `Attendu: ${expectedLiters} L (100 %)`;
          },
        },
      },
    },

    scales: {
      x: {
        grid: {
          display: false,
        },

        ticks: {
          color: "#6B6C58",

          font: {
            size: 11,
          },
        },
      },

      y: {
        min: 0,
        max: 110,

        grid: {
          color: "rgba(207, 199, 170, 0.4)",
        },

        ticks: {
          color: "#6B6C58",

          callback: (value: string | number) =>
            `${Number(value).toLocaleString("fr-TN")} %`,
        },

        title: {
          display: true,
          text: "Rendement par rapport à l'attendu",
          color: "#6B6C58",
        },
      },
    },
  };

  return (
    <Card
      headerAction={
        <h3 className={styles.panelTitle}>
          Pressage : réel vs attendu
        </h3>
      }
    >
      <div style={{ height: 280 }}>
        <Line data={chartData} options={options} />
      </div>
    </Card>
  );
};

export default PressingComparisonChart;