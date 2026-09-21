// src/features/production/plots/presentation/widgets/PlotVarietyCardWidget.tsx

import { useState } from "react";

import Button from "../../../../common/widgets/button/Button";
import ProgressBar from "../../../../common/widgets/progressBar/ProgressBar";
import Card from "../../../../common/widgets/card/Card";

import LaunchHarvestCard from "./LaunchHarvestCard";

import type { PlotVarietyDetail } from "@olive-platform/core/features/plots/domain/entities/PlotVarietyDetail";

type Props = {
  plotId: number;
  variety: PlotVarietyDetail;
  onHarvestLaunched: () => void;
};

export default function PlotVarietyCardWidget({
  plotId,
  variety,
  onHarvestLaunched,
}: Props) {
  const [showLaunchForm, setShowLaunchForm] = useState(false);

  const handleSuccess = () => {
    setShowLaunchForm(false);
    onHarvestLaunched();
  };

  const isCompleted = variety.remainingTreesToHarvest === 0;

  return (
    <Card>
      <div className="variety-card-header">
        <span className="variety-card-title">{variety.varietyLabel}</span>

        <span
          className={`status-badge ${
            isCompleted ? "status-badge--success" : "status-badge--warning"
          }`}
        >
          {isCompleted
            ? "Terminée"
            : `${variety.remainingTreesToHarvest.toLocaleString("fr-FR")} restants`}
        </span>
      </div>

      <ProgressBar value={variety.harvestedPercentage} showValue={false} />

      {!isCompleted && !showLaunchForm && (
        <div className="variety-card-footer">
          <Button variant="secondary" onClick={() => setShowLaunchForm(true)}>
            Lancer la récolte
          </Button>
        </div>
      )}

      {showLaunchForm && (
        <LaunchHarvestCard
          plotId={plotId}
          varietyId={variety.varietyId}
          defaultPlannedTrees={variety.remainingTreesToHarvest}
          onClose={() => setShowLaunchForm(false)}
          onSuccess={handleSuccess}
        />
      )}
    </Card>
  );
}