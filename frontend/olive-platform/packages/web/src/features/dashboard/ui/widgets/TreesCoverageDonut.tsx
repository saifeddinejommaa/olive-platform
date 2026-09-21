// widgets/TreesCoverageDonut.tsx
import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import styles from '../styles/dashboard.module.css';
import type { TreesCoverage } from '@olive-platform/core/features/dashboard/domain/dashboard.types';
import Card from '../../../../common/widgets/card/Card';

ChartJS.register(ArcElement, Tooltip);

export interface TreesCoverageDonutProps {
  data: TreesCoverage;
}

export const TreesCoverageDonut: React.FC<TreesCoverageDonutProps> = ({ data }) => {
  const chartData = {
    labels: ['Récolté', 'Planifié / en cours', 'Non récolté'],
    datasets: [
      {
        data: [data.harvestedTrees, data.plannedTrees, data.notHarvestedTrees],
        backgroundColor: ['#66763F', '#96741F', '#CFC7AA'],
        borderWidth: 0,
      },
    ],
  };

  const harvestedPct = data.totalTrees > 0
    ? Math.round((data.harvestedTrees / data.totalTrees) * 100)
    : 0;

  return (
    <Card headerAction={<h3 className={styles.panelTitle}>Arbres récoltés</h3>}>
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
                    label: (item) => `${item.label}: ${item.raw} arbres`,
                  },
                },
              },
            }}
          />
          <div className={styles.donutCenter}>
            <span className={styles.donutCenterValue}>{harvestedPct}%</span>
            <span className={styles.donutCenterLabel}>récolté</span>
          </div>
        </div>
        <ul className={styles.donutLegend}>
          <li><span className={styles.legendDotHarvested} />Récolté — {data.harvestedTrees.toLocaleString('fr-TN')}</li>
          <li><span className={styles.legendDotPlanned} />Planifié — {data.plannedTrees.toLocaleString('fr-TN')}</li>
          <li><span className={styles.legendDotRemaining} />Non récolté — {data.notHarvestedTrees.toLocaleString('fr-TN')}</li>
        </ul>
      </div>
    </Card>
  );
};

export default TreesCoverageDonut;