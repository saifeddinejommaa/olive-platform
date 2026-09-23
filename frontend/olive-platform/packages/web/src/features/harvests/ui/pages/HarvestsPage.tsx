// src/features/production/harvests/presentation/pages/HarvestsPage.tsx

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

import DataTable from "../../../../common/widgets/tables/OrdersTable";
import ActionCard from "../../../../common/widgets/actionCard/ActionCard";
import HarvestsFilterComponent from "../components/HarvestsFilterComponent";
import { usePageTitle } from "../../../../common/hooks/usePageTitle";
import Button from "../../../../common/widgets/button/Button";
import { IconPlus } from "@tabler/icons-react";
import { useHarvestsStore } from "@olive-platform/core/features/harvests/stores/HarvestsStore";
import { useConstantsStore } from "../../../../stores/ConstantsStore";
import type { HarvestForList } from "@olive-platform/core/features/harvests/domain/entities/HarvestForList"
import { renderStatus } from "../../../../common/status/StatusUtils";
import { productionStatusConfig } from "../../../../common/status/ProductionStatusConfig";
import { getOliveVarietyLabel } from "@olive-platform/core/features/appConstants/helper/AppConstantsHelper";
export default function HarvestsPage() {
  const navigate = useNavigate();

  usePageTitle(
    "Récoltes",
    "Gestion des récoltes d'olives et suivi de leur qualité.",
  );

  const { harvests, loading, error, fetchHarvests, launchPressingOperation } =
    useHarvestsStore();

  const { fetchConstants } = useConstantsStore();

  useEffect(() => {
    fetchConstants();
    fetchHarvests();
  }, [fetchConstants, fetchHarvests]);

  const handlePageChange = async (page: number) => {
    useHarvestsStore.getState().setFilter("pageNumber", page);
    await fetchHarvests();
  };

  const handleOpenDetails = (id: number) => {
    navigate(`/harvests/harvest-operation/${id}`);
  };

  const handleLaunchPressing = async (id: number) => {
    try {
      await launchPressingOperation(id);
      toast.success("La pression a été lancée avec succès.");
      await fetchHarvests();
    } catch {
      toast.error("Une erreur est survenue lors du lancement de la pression.");
    }
  };

  const columns = [
    {
      key: "reference" as keyof HarvestForList,
      label: "Référence",
      render: (item: HarvestForList) => item.reference || "-",
    },
    {
      key: "harvestDate" as keyof HarvestForList,
      label: "Date",
      render: (item: HarvestForList) =>
        item.harvestDate
          ? new Date(item.harvestDate).toLocaleDateString("fr-FR")
          : "-",
    },
    {
      key: "plannedTrees" as keyof HarvestForList,
      label: "Arbres planifiés",
      render: (item: HarvestForList) =>
        item.plannedTrees?.toLocaleString("fr-FR") ?? "0",
    },
    {
      key: "harvestedTrees" as keyof HarvestForList,
      label: "Arbres récoltés",
      render: (item: HarvestForList) =>
        item.harvestedTrees?.toLocaleString("fr-FR") ?? "0",
    },
    {
      key: "varietyId" as keyof HarvestForList,
      label: "Variété",
      render: (item: HarvestForList) => getOliveVarietyLabel(item.variety),
    },
    {
      key: "status" as keyof HarvestForList,
      label: "Statut",
      render: (item: HarvestForList) =>
        renderStatus(item.status, productionStatusConfig),
    },
    {
      key: "analysis" as keyof HarvestForList,
      label: "Analyse",
      render: (item: HarvestForList) =>
        item.analysis ? renderStatus(item.analysis, productionStatusConfig) : "",
    },
    {
      key: "pressed" as keyof HarvestForList,
      label: "Pression",
      render: (item: HarvestForList) =>
        item.pressed ? renderStatus(item.pressed, productionStatusConfig) : "",
    },
    {
      key: "id" as keyof HarvestForList,
      label: "Actions",
      render: (item: HarvestForList) => (
        <div style={{ display: "flex", gap: "4px" }}>
          <ActionCard
            type="edit"
            title="Détails"
            onClick={() => handleOpenDetails(item.id)}
          />

          {item.canBePressed && (
            <ActionCard
              type="launch"
              title="Lancer la pression"
              onClick={() => handleLaunchPressing(item.id)}
            />
          )}
        </div>
      ),
    },
  ];

  const handleCreate = () => {
    navigate("/harvests/new");
  };

  return (
    <div className="feature-page">
      <div className="page-header page-header-actions">
        <Button
          variant="primary"
          onClick={handleCreate}
        >
          <IconPlus size={18} stroke={2} />
          Nouvelle récolte
        </Button>
      </div>
      
      <HarvestsFilterComponent />

      {error && <div className="error-message">{error}</div>}

      <DataTable
        data={harvests.items}
        columns={columns}
        pageNumber={harvests.pageNumber}
        pageSize={harvests.pageSize}
        totalCount={harvests.totalCount}
        onPageChange={handlePageChange}
      />

      {loading && <div className="loading">Chargement des récoltes...</div>}
    </div>
  );
}