import React, { useEffect } from "react";
import styles from "../../styles/dashboard.module.css";
import ProductionPipelineCard from "../../widgets/ProductionPipelineCard";
import HarvestYieldChart from "../../widgets/HarvestYieldChart";
import PressingComparisonChart from "../../widgets/PressingComparisonChart";
import TreesCoverageDonut from "../../widgets/TreesCoverageDonut";
import TankOccupancyGauge from "../../widgets/TankOccupancyGauge";
import { useDashboardStore } from "../../stores/useDahsbordStore";
import { usePageTitle } from "../../../../../common/hooks/usePageTitle";

export const DashboardPage: React.FC = () => {
  const {
    summary,
    loading,
    error,
    fetchSummary,
  } = useDashboardStore();

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  usePageTitle("Tableau de bord", "Campagne 2026/2027")
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

      <div className={styles.kpiRow}>
        <ProductionPipelineCard
          title="Récolte"
          data={summary.harvestPipeline}
        />

        <ProductionPipelineCard
          title="Pression"
          data={summary.pressingPipeline}
        />
      </div>

      <div className={styles.grid}>
        <div className={styles.column}>
          <div className="filters">
            <HarvestYieldChart
              data={summary.harvestYield}
            />

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