import React from 'react';
import styles from '../styles/dashboard.module.css'
import type { OilAnalysis } from '../../domain/dashboard.types';
import Card from '../../../../common/widgets/card/Card';

export interface OilQualityPanelProps {
  data: OilAnalysis[];
}

const dotClass: Record<OilAnalysis['status'], string> = {
  pass: styles.qualityDotPass,
  warning: styles.qualityDotWarning,
  fail: styles.qualityDotFail,
};

/** Latest laboratory analysis results per pressing batch (acidity, peroxide index, grade). */
export const OilQualityPanel: React.FC<OilQualityPanelProps> = ({ data }) => (
  <Card headerAction={<h3 className={styles.panelTitle}>Analyses labo</h3>}>
    {data.map((a) => (
      <div className={styles.qualityRow} key={a.batchId}>
        <span className={`${styles.qualityDot} ${dotClass[a.status]}`} />
        <span>{a.batchId}</span>
        <span className={styles.panelMeta}>
          acidité {a.acidityPct.toFixed(2)}% · IP {a.peroxideIndex.toFixed(1)}
        </span>
        <span className={styles.qualityGrade}>{a.grade}</span>
      </div>
    ))}
  </Card>
);

export default OilQualityPanel;
