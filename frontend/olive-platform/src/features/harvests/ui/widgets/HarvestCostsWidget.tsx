import React from "react";

import Card from "../../../../common/widgets/card/Card";

import type { HarvestCostSummary } from "../../domain/entities/HarvestCostSummary";

import styles from "../styles/harvestCostsWidget.module.css";
import { getCostTypeLabel } from "../../../appConstants/helper/AppConstantsHelper";

interface HarvestCostsWidgetProps {
  costs: HarvestCostSummary[];
}

export const HarvestCostsWidget: React.FC<HarvestCostsWidgetProps> = ({
  costs,
}) => {
  const totalAmount = costs.reduce(
    (total, cost) => total + cost.totalAmount,
    0,
  );

  const formatAmount = (amount: number) =>
    amount.toLocaleString("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  return (
    <Card
      headerAction={
        <h3 className={styles.title}>
          Charges
        </h3>
      }
    >
      <div className={styles.container}>
        {costs.length === 0 ? (
          <div className={styles.empty}>
            Aucune charge enregistrée.
          </div>
        ) : (
          <>
            <div className={styles.costList}>
              {costs.map((cost) => (
                <div
                  key={cost.costLineTypeId}
                  className={styles.costRow}
                >
                  <div className={styles.costInfo}>
                    <span className={styles.costName}>
                      {getCostTypeLabel(cost.costLineTypeId)}
                    </span>
                  </div>

                  <span className={styles.costAmount}>
                    {formatAmount(cost.totalAmount)} dt
                  </span>
                </div>
              ))}
            </div>

            <div className={styles.separator} />

            <div className={styles.summary}>
              <div className={styles.summaryRow}>
                <span>Total des charges</span>

                <strong>
                  {formatAmount(totalAmount)} dt
                </strong>
              </div>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

export default HarvestCostsWidget;