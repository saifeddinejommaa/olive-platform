// widgets/ProductionPipelineCard.tsx
import React from 'react';
import styles from '../styles/dashboard.module.css';
import type { ProductionPipeline } from '@olive-platform/core/features/dashboard/domain/dashboard.types';
import Card from '../../../../common/widgets/card/Card';


export interface ProductionPipelineCardProps {
  title: string;
  data: ProductionPipeline;
}

export const ProductionPipelineCard: React.FC<ProductionPipelineCardProps> = ({ title, data }) => {
  const steps = [
    { label: 'Planifiées', value: data.plannedCount },
    { label: 'En cours', value: data.inProgressCount },
    { label: 'Terminées', value: data.completedCount },
  ];

  return (
    <Card headerAction={<h3 className={styles.panelTitle}>{title}</h3>}>
      <div className={styles.pipelineRow}>
        {steps.map((step, i) => (
          <React.Fragment key={step.label}>
            <div className={styles.pipelineStep}>
              <span className={styles.pipelineValue}>{step.value}</span>
              <span className={styles.pipelineLabel}>{step.label}</span>
            </div>
            {i < steps.length - 1 && <div className={styles.pipelineConnector} />}
          </React.Fragment>
        ))}
      </div>
    </Card>
  );
};

export default ProductionPipelineCard;