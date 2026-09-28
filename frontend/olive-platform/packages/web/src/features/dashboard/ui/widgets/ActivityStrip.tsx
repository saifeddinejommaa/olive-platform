import React from "react";
import styles from "../styles/dashboard.module.css";
import type { ProductionPipeline } from "@olive-platform/core/features/dashboard/domain/dashboard.types";

type Group = {
  title: string;
  data: ProductionPipeline;
};

export interface ActivityStripProps {
  harvests: ProductionPipeline;
  pressings: ProductionPipeline;
}

const steps = (data: ProductionPipeline) => [
  { label: "planifiées", value: data.plannedCount, tone: styles.chipPlanned },
  { label: "en cours", value: data.inProgressCount, tone: styles.chipInProgress },
  { label: "terminées", value: data.completedCount, tone: styles.chipCompleted },
];

// Bandeau compact : l'avancement des récoltes et des pressions en un coup d'œil.
export const ActivityStrip: React.FC<ActivityStripProps> = ({ harvests, pressings }) => {
  const groups: Group[] = [
    { title: "Récoltes", data: harvests },
    { title: "Pressions", data: pressings },
  ];

  return (
    <div className={styles.activityStrip}>
      {groups.map((group) => (
        <div key={group.title} className={styles.activityGroup}>
          <span className={styles.activityTitle}>{group.title}</span>

          <div className={styles.activityChips}>
            {steps(group.data).map((step) => (
              <span key={step.label} className={`${styles.activityChip} ${step.tone}`}>
                <strong className={styles.chipValue}>{step.value}</strong>
                {step.label}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityStrip;
