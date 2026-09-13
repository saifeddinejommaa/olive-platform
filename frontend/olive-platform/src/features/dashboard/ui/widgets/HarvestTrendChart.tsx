import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  type ChartOptions,
  type TooltipItem,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import styles from '../styles/dashboard.module.css'
import type { HarvestPoint } from '../../domain/dashboard.types';
import Card from '../../../../common/widgets/card/Card';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

export interface HarvestTrendChartProps {
  data: HarvestPoint[];
}

const options: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: { intersect: false, mode: 'index' },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: '#6B6C58', font: { size: 12 } },
    },
    y: {
      grid: { color: '#CFC7AA', drawTicks: false },
      border: { display: false },
      ticks: {
        color: '#6B6C58',
        font: { size: 12 },
        callback: (v) => `${Number(v) / 1000}t`,
      },
    },
  },
  plugins: {
    tooltip: {
      backgroundColor: '#FBFAF3',
      titleColor: '#262B1C',
      bodyColor: '#262B1C',
      borderColor: '#CFC7AA',
      borderWidth: 1,
      padding: 10,
      titleFont: { size: 12.5 },
      bodyFont: { size: 12.5 },
      callbacks: {
        title: (items: TooltipItem<'line'>[]) => `Semaine ${items[0].label}`,
        label: (item: TooltipItem<'line'>) => `${Number(item.raw).toLocaleString('fr-TN')} kg récoltés`,
      },
    },
  },
};

/** Weekly harvested olive quantity across the current campaign. */
export const HarvestTrendChart: React.FC<HarvestTrendChartProps> = ({ data }) => {
  const totalT = (data.reduce((sum, d) => sum + d.quantityKg, 0) / 1000).toFixed(1);

  const chartData = {
    labels: data.map((d) => d.week),
    datasets: [
      {
        data: data.map((d) => d.quantityKg),
        borderColor: '#66763F',
        backgroundColor: 'rgba(102, 118, 63, 0.18)',
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: '#66763F',
        borderWidth: 2,
        fill: true,
        tension: 0.35,
      },
    ],
  };

  return (
    <Card
      headerAction={
        <div className={styles.panelTitleRow}>
          <h3 className={styles.panelTitle}>Récolte par semaine</h3>
          <span className={styles.panelMeta}>{totalT} t cumulées cette campagne</span>
        </div>
      }
    >
      <div style={{ height: 220 }}>
        <Line data={chartData} options={options} />
      </div>
    </Card>
  );
};

export default HarvestTrendChart;
