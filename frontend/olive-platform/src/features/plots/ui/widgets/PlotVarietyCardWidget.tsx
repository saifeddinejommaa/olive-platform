// src/features/production/plots/presentation/components/PlotVarietyCard.tsx

import { useState } from "react";

import Button from "../../../../common/widgets/button/Button";
import InfoFieldWidget from "../../../../common/widgets/InfoFieldWidget";
import ProgressBar from "../../../../common/widgets/progressBar/ProgressBar";

import LaunchHarvestCard from "./LaunchHarvestCard";

import type { PlotVarietyDetail } from "../../domain/entities/PlotVarietyDetail";

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

  return (
    <div className="filter-item" style={{ gridColumn: "1 / -1" }}>
      <span className="filter-item-label">{variety.varietyLabel}</span>

      <ProgressBar
        value={variety.harvestedPercentage}
        secondaryValue={variety.plannedTreesPercentage}
        showValue
      />
      <div style={{ display: "flex", gap: "24px", marginTop: "8px" }}>
        <InfoFieldWidget
          label="Nombre total d'arbres"
          value={variety.numberOfTrees.toLocaleString("fr-FR")}
        />
        <InfoFieldWidget
          label="Reste à récolter"
          value={variety.remainingTreesToHarvest.toLocaleString("fr-FR")}
        />
      </div>

      {variety.remainingTreesToHarvest > 0 && !showLaunchForm && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "12px" }}>
          <Button variant="primary" onClick={() => setShowLaunchForm(true)}>
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
    </div>
  );
}