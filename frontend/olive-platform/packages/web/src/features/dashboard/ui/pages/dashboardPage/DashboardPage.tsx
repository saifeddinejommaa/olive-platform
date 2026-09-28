import React, { useEffect } from "react";
import styles from "../../styles/dashboard.module.css";
import ActivityStrip from "../../widgets/ActivityStrip";
import OliveLotsChart from "../../widgets/OliveLotsChart";
import PressingComparisonChart from "../../widgets/PressingComparisonChart";
import TreesCoverageDonut from "../../widgets/TreesCoverageDonut";
import TankOccupancyGauge from "../../widgets/TankOccupancyGauge";
import ChargesCoverageDonut from "../../widgets/ChargesCoverageDonut";
import { useDashboardStore } from "@olive-platform/core/features/dashboard/stores/useDahsbordStore";
import { usePageTitle } from "../../../../../common/hooks/usePageTitle";
import { useSeasonStore } from "../../../../../stores/SeasonStore";

export const DashboardPage: React.FC = () => {
  const {
    summary,
    loading,
    error,
    fetchSummary,
  } = useDashboardStore();

  // La page est remontée à chaque changement de campagne (Layout) :
  // le résumé est donc rechargé pour la campagne sélectionnée.
  const selectedSeason = useSeasonStore((state) =>
    state.seasons.find((season) => season.id === state.selectedSeasonId),
  );

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  usePageTitle(
    "Tableau de bord",
    selectedSeason ? `Campagne ${selectedSeason.label}` : "",
  );

  if (loading && !summary) {
    return (
      <div className={styles.loading}>
        Chargement du tableau de bord...
      </div>
    );
  }

  if (error && !summary) {
    return (
      <div className={styles.error}>
        <p>{error}</p>

        <button type="button" onClick={fetchSummary}>
          Réessayer
        </button>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className={styles.empty}>
        Aucune donnée disponible.
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      <ActivityStrip
        harvests={summary.harvestPipeline}
        pressings={summary.pressingPipeline}
      />

      <div className={styles.grid}>
        <div className={styles.column}>
          <div className="filters">
            <OliveLotsChart data={summary.oliveLots} />

            <PressingComparisonChart
              data={summary.pressingComparison}
            />
          </div>
        </div>

        <div className={styles.column}>
          <div className="filters">
            <TreesCoverageDonut
              data={summary.treesCoverage}
            />
            <ChargesCoverageDonut
              data={summary.chargesCoverage}
            />
            <TankOccupancyGauge
              data={summary.tankOccupancy}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
