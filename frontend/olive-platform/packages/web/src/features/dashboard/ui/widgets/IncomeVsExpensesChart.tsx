import React from 'react';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { colors } from '@olive-platform/core/theme/Colors';
import styles from '../styles/dashboard.module.css';
import type { IncomeVsExpenses } from '@olive-platform/core/features/dashboard/domain/dashboard.types';
import Card from '../../../../common/widgets/card/Card';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

const formatTnd = (value: number) => `${Number(value).toLocaleString('fr-TN')} TND`;

export interface IncomeVsExpensesChartProps {
  data: IncomeVsExpenses;
}

/**
 * Dépenses (charges de récolte + achats d'olives) contre gains (ventes d'huile
 * livrées, HT) de la campagne, et le résultat.
 */
export const IncomeVsExpensesChart: React.FC<IncomeVsExpensesChartProps> = ({ data }) => {
  const expenses = Number(data.expensesAmount);
  const income = Number(data.incomeAmount);
  const result = Number(data.resultAmount);

  const chartData = {
    labels: ['Dépenses', 'Gains'],
    datasets: [
      {
        data: [expenses, income],
        backgroundColor: [colors.rust[600], colors.olive[700]],
        borderRadius: 6,
        maxBarThickness: 48,
      },
    ],
  };

  return (
    <Card headerAction={<h3 className={styles.panelTitle}>Dépenses vs gains</h3>}>
      <div className={styles.donutWrap}>
        <div style={{ width: 140, height: 140, position: 'relative' }}>
          <Bar
            data={chartData}
            options={{
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: {
                  callbacks: {
                    label: (item) => `${item.label}: ${formatTnd(Number(item.raw))}`,
                  },
                },
              },
              scales: {
                x: { grid: { display: false } },
                y: { display: false, beginAtZero: true },
              },
            }}
          />
        </div>

        <ul className={styles.donutLegend}>
          <li>
            <span className={styles.legendDotUnpaid} />
            Dépenses — {formatTnd(expenses)}
          </li>

          <li>
            <span className={styles.legendDotHarvested} />
            Gains — {formatTnd(income)}
          </li>

          <li>
            <strong style={{ color: result >= 0 ? colors.olive[700] : colors.rust[600] }}>
              Résultat — {result >= 0 ? '+' : ''}
              {formatTnd(result)}
            </strong>
          </li>
        </ul>
      </div>
    </Card>
  );
};

export default IncomeVsExpensesChart;
