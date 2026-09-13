import React from 'react';
import styles from '../styles/dashboard.module.css'
import type { PressingBatch } from '../../domain/dashboard.types';
import Card from '../../../../common/widgets/card/Card';

export interface PressingYieldWidgetProps {
  data: PressingBatch[];
}

/** Extraction yield summary for the latest pressing batches. */
export const PressingYieldWidget: React.FC<PressingYieldWidgetProps> = ({ data }) => {
  const avgYield = data.reduce((sum, b) => sum + b.yieldPct, 0) / data.length;

  return (
    <Card headerAction={<h3 className={styles.panelTitle}>Rendement trituration</h3>}>
      <div className={styles.yieldSummary}>
        <svg width="72" height="72" viewBox="0 0 72 72">
          <circle cx="36" cy="36" r="30" fill="none" stroke="#CFC7AA" strokeWidth="8" />
          <circle
            cx="36" cy="36" r="30" fill="none" stroke="#37451F" strokeWidth="8"
            strokeDasharray={`${(avgYield / 22) * 188.5} 188.5`}
            strokeLinecap="round"
            transform="rotate(-90 36 36)"
          />
        </svg>
        <div>
          <span className={styles.yieldRingLabel}>{avgYield.toFixed(1)}%</span>
          <div className={styles.panelMeta}>moyenne sur {data.length} derniers lots</div>
        </div>
      </div>
      {data.map((b) => (
        <div className={styles.yieldBatchRow} key={b.id}>
          <span className={styles.yieldBatchId}>{b.id} · {b.oliveInputKg.toLocaleString('fr-TN')} kg olives</span>
          <span>{b.yieldPct.toFixed(1)}%</span>
        </div>
      ))}
    </Card>
  );
};

export default PressingYieldWidget;
