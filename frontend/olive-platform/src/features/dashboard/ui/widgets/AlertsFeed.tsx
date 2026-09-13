import React from 'react';
import styles from '../styles/dashboard.module.css'
import Card from '../../../../common/widgets/card/Card';
import type { AlertItem } from '../../domain/dashboard.types';

export interface AlertsFeedProps {
  data: AlertItem[];
}

const barClass: Record<AlertItem['severity'], string> = {
  critical: styles.alertBarCritical,
  warning: styles.alertBarWarning,
  info: styles.alertBarInfo,
};

/** Feed of operational alerts (quality thresholds, stock levels, rejected lots...). */
export const AlertsFeed: React.FC<AlertsFeedProps> = ({ data }) => (
  <Card headerAction={<h3 className={styles.panelTitle}>Alertes</h3>}>
    {data.map((a) => (
      <div className={styles.alertRow} key={a.id}>
        <span className={`${styles.alertBar} ${barClass[a.severity]}`} />
        <div>
          {a.message}
          <span className={styles.alertTime}>{a.time}</span>
        </div>
      </div>
    ))}
  </Card>
);

export default AlertsFeed;
