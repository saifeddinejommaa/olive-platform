import React from 'react';
import styles from '../styles/dashboard.module.css'
import type { StockTank } from '../../domain/dashboard.types';
import Card from '../../../../common/widgets/card/Card';

export interface StockLevelWidgetProps {
  data: StockTank[];
}

/** Current fill level of each oil storage tank. */
export const StockLevelWidget: React.FC<StockLevelWidgetProps> = ({ data }) => (
  <Card headerAction={<h3 className={styles.panelTitle}>Stock cuves</h3>}>
    {data.map((t) => {
      const pct = Math.round((t.currentL / t.capacityL) * 100);
      const low = pct < 30;
      return (
        <div className={styles.stockRow} key={t.id}>
          <div className={styles.stockLabels}>
            <span>{t.label} · {t.grade}</span>
            <span>{t.currentL.toLocaleString('fr-TN')} / {t.capacityL.toLocaleString('fr-TN')} L</span>
          </div>
          <div className={styles.stockTrack}>
            <div
              className={`${styles.stockFill} ${low ? styles.stockFillLow : ''}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      );
    })}
  </Card>
);

export default StockLevelWidget;
