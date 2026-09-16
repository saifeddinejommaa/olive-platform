// widgets/TankOccupancyGauge.tsx
import React from 'react';
import styles from '../styles/dashboard.module.css';
import type { TankOccupancy } from '../../domain/dashboard.types';
import Card from '../../../../common/widgets/card/Card';

export interface TankOccupancyGaugeProps {
  data: TankOccupancy;
}

export const TankOccupancyGauge: React.FC<TankOccupancyGaugeProps> = ({ data }) => {
  const pct = Math.min(Math.max(data.occupancyPercentage, 0), 100);

  return (
    <Card headerAction={<h3 className={styles.panelTitle}>Occupation cuves (global)</h3>}>
      <div className={styles.gaugeWrap}>
        <svg width="88" height="88" viewBox="0 0 88 88">
          <circle cx="44" cy="44" r="36" fill="none" stroke="#CFC7AA" strokeWidth="9" />
          <circle
            cx="44" cy="44" r="36" fill="none" stroke="#96741F" strokeWidth="9"
            strokeDasharray={`${(pct / 100) * 226.2} 226.2`}
            strokeLinecap="round"
            transform="rotate(-90 44 44)"
          />
        </svg>
        <div>
          <span className={styles.gaugeValue}>{pct.toFixed(0)}%</span>
          <div className={styles.panelMeta}>
            {data.currentLevelLiters.toLocaleString('fr-TN')} / {data.totalCapacityLiters.toLocaleString('fr-TN')} L
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TankOccupancyGauge;