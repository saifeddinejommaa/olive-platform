import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Button from "../../../../common/widgets/button/Button";

import { useHarvestDetailsStore } from "../stores/HarvestDetailsStore";

import HarvestTabs, { type HarvestTab } from "../components/HarvestTabs";
import HarvestGeneralTab from "../components/HarvestGeneralTab";
import HarvestStocksTab from "../components/HarvestStockTab";

import { renderStatus } from "../../../shared/utils/StatusUtils";
import { productionStatusConfig } from "../../../shared/status/ProductionStatusConfig";
import { ProductionStatus } from "../../../production/domain/entities/ProductionStatus";

import CloseHarvestDrawer from "../components/CompleteHarvestDrawer";

import type { HarvestStockParams } from "../../domain/params/HarvestStockParams";
import { toast } from "react-toastify";

export default function HarvestDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [closeDrawerOpen, setCloseDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] =
    useState<HarvestTab>("general");

  const {
    harvest,
    saving,
    fetchHarvest,
    start,
    complete,
    clear,
  } = useHarvestDetailsStore();

  const harvestId = Number(id);

  const isPlanned =
    harvest?.status === ProductionStatus.Planned;

  const isInProgress =
    harvest?.status === ProductionStatus.InProgress;

  useEffect(() => {
    if (!id) {
      return;
    }

    fetchHarvest(harvestId);
  }, [id, harvestId, fetchHarvest]);

  useEffect(() => {
    return () => {
      clear();
    };
  }, [clear]);

  const handleStartHarvest = async () => {
    if (!harvest) {
      return;
    }

    try {
      await start(harvest.id);
      toast.success("Opération lancée avec succés")
    } catch {
      toast.error("Erruer de lancement de l'opération")
    }
  };

  const handleCloseHarvest = async (
    stocks: HarvestStockParams[],
    proceedAnalyse: boolean,
  ) => {
    if (!harvest) {
      return;
    }

    try {
      await complete(
        harvest.id,
        harvest.quantityKg ?? 0,
        harvest.harvestedTrees,
        new Date().toISOString(),
        stocks,
        proceedAnalyse,
      );

      setCloseDrawerOpen(false);

      await fetchHarvest(harvest.id);

      toast.success("Opération terminée avec succèes")
    } catch {
      toast.error("Nous n'avons pas clôturé l'opération")    
    }
  };

  return (
    <div className="feature-page">
      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">
            Récolte {harvest?.reference}
          </h1>

          {harvest &&
            renderStatus(
              harvest.status,
              productionStatusConfig,
            )}
        </div>

        {isPlanned && (
          <Button
            variant="primary"
            onClick={handleStartHarvest}
            disabled={saving}
          >
            {saving
              ? "Lancement..."
              : "Lancer la récolte"}
          </Button>
        )}

        {isInProgress && (
          <Button
            variant="primary"
            onClick={() => setCloseDrawerOpen(true)}
            disabled={saving}
          >
            Clôturer la récolte
          </Button>
        )}
      </div>

      <HarvestTabs
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === "general" && harvest && (
        <HarvestGeneralTab
          harvestId={harvest.id}
          onNotesChange={() => {}}
        />
      )}

      {activeTab === "olives" && harvest && (
        <HarvestStocksTab
          harvestId={harvest.id}
        />
      )}

      <div className="filters-footer">
        <Button
          variant="secondary"
          onClick={() => navigate("/harvests")}
        >
          Retour
        </Button>
      </div>

      {harvest && (
        <CloseHarvestDrawer
          open={closeDrawerOpen}
          saving={saving}
          harvest={harvest}
          onClose={() => setCloseDrawerOpen(false)}
          onConfirm={handleCloseHarvest}
        />
      )}
    </div>
  );
}