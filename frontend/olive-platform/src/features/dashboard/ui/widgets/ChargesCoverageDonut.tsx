import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import styles from '../styles/dashboard.module.css';
import type { ChargesCoverage } from '../../domain/dashboard.types';
import Card from '../../../../common/widgets/card/Card';

ChartJS.register(ArcElement, Tooltip);

export interface ChargesCoverageDonutProps {
  data: ChargesCoverage;
}

export const ChargesCoverageDonut: React.FC<ChargesCoverageDonutProps> = ({ data }) => {
  const chartData = {
    labels: ['Réglé', 'Restant à régler'],
    datasets: [
      {
        data: [data.paidAmount, data.unpaidAmount],
        backgroundColor: ['#3b6d11', '#a23b2e'],
        borderWidth: 0,
      },
    ],
  };

  const paidPct = data.totalAmount > 0
    ? Math.round((data.paidAmount / data.totalAmount) * 100)
    : 0;

  return (
    <Card headerAction={<h3 className={styles.panelTitle}>Charges</h3>}>
      <div className={styles.donutWrap}>
        <div style={{ width: 140, height: 140, position: 'relative' }}>
          <Doughnut
            data={chartData}
            options={{
              cutout: '70%',
              plugins: {
                legend: { display: false },
                tooltip: {
                  callbacks: {
                    label: (item) =>
                      `${item.label}: ${Number(item.raw).toLocaleString('fr-TN')} TND`,
                  },
                },
              },
            }}
          />

          <div className={styles.donutCenter}>
            <span className={styles.donutCenterValue}>{paidPct}%</span>
            <span className={styles.donutCenterLabel}>réglé</span>
          </div>
        </div>

        <ul className={styles.donutLegend}>
          <li>
            <span className={styles.legendDotHarvested} />
            Réglé — {data.paidAmount.toLocaleString('fr-TN')} TND
          </li>

          <li>
            <span className={styles.legendDotUnpaid} />
            Restant — {data.unpaidAmount.toLocaleString('fr-TN')} TND
          </li>
        </ul>
      </div>
    </Card>
  );
};

export default ChargesCoverageDonut;