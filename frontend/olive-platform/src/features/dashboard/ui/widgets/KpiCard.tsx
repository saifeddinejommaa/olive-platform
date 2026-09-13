import React from 'react';
import styles from '../styles/dashboard.module.css'
import type { KpiAccent } from '../../domain/dashboard.types';

export interface KpiCardProps {
  label: string;
  value: string;
  unit?: string;
  deltaPct: number;
  deltaLabel: string;
  accent: KpiAccent;
}

const accentColor: Record<KpiAccent, string> = {
  harvest: 'var(--olv-sage)',
  purchase: 'var(--olv-brass)',
  pressing: 'var(--olv-deep-olive)',
  quality: 'var(--olv-clay)',
};

/** Single KPI stat card used in the dashboard's top row. */
export const KpiCard: React.FC<KpiCardProps> = ({ label, value, unit, deltaPct, deltaLabel, accent }) => {
  const positive = deltaPct >= 0;
  return (
    <div className={styles.kpiCard} style={{ borderLeftColor: accentColor[accent] }}>
      <div className={styles.kpiCardTop}>
        <span className={styles.kpiLabel}>{label}</span>
      </div>
      <div className={styles.kpiValueRow}>
        <span className={styles.kpiValue}>{value}</span>
        {unit && <span className={styles.kpiUnit}>{unit}</span>}
      </div>
      <div className={`${styles.kpiDelta} ${positive ? styles.positive : styles.negative}`}>
        <span>{positive ? '+' : ''}{deltaPct}%</span>
        <span className={styles.deltaLabel}>{deltaLabel}</span>
      </div>
    </div>
  );
};

export default KpiCard;
