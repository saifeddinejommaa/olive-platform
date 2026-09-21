// widgets/HarvestYieldChart.tsx
import React from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import styles from '../styles/dashboard.module.css';
import type { HarvestYieldPoint } from '@olive-platform/core/features/dashboard/domain/dashboard.types';
import Card from '../../../../common/widgets/card/Card';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export interface HarvestYieldChartProps {
  data: HarvestYieldPoint[];
}

export const HarvestYieldChart: React.FC<HarvestYieldChartProps> = ({ data }) => {
  const totalKg = data.reduce((sum, d) => sum + d.quantityKg, 0);

  const chartData = {
    labels: data.map((d) => new Date(d.date).toLocaleDateString('fr-TN', { day: '2-digit', month: '2-digit' })),
    datasets: [
      {
        data: data.map((d) => d.quantityKg),
        backgroundColor: '#66763F',
        borderRadius: 3,
        maxBarThickness: 18,
      },
    ],
  };

  return (
    <Card
      headerAction={
        <div className={styles.panelTitleRow}>
          <h3 className={styles.panelTitle}>Rendement récolte / jour</h3>
          <span className={styles.panelMeta}>{(totalKg / 1000).toFixed(1)} t sur la période</span>
        </div>
      }
    >
      <div style={{ height: 220 }}>
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              tooltip: {
                callbacks: {
                  label: (item) => `${Number(item.raw).toLocaleString('fr-TN')} kg`,
                },
              },
            },
            scales: {
              x: { grid: { display: false }, ticks: { color: '#6B6C58', font: { size: 11 } } },
              y: {
                grid: { color: '#CFC7AA' },
                ticks: { color: '#6B6C58', font: { size: 12 }, callback: (v) => `${Number(v) / 1000}t` },
              },
            },
          }}
        />
      </div>
    </Card>
  );
};

export default HarvestYieldChart;