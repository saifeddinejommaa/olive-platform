import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../../../../../common/widgets/button/Button";
import DataTable from "../../../../../common/widgets/tables/OrdersTable";
import ActionCard from "../../../../../common/widgets/actionCard/ActionCard";

import { usePageTitle } from "../../../../../common/hooks/usePageTitle";

import { renderStatus } from "../../../../shared/utils/StatusUtils";
import { productionStatusConfig } from "../../../../shared/status/ProductionStatusConfig";
import type { OilAnalysisForList } from "../../../oilAnalyses/domain/entities/OilAnalysisForList";
import { useOilAnalysesListStore } from "../../../oilAnalyses/ui/stores/UseAnalysesListStore";
import OilAnalysesFilter from "../components/OilAnalysesFilter";
import { IconPlus } from "@tabler/icons-react";

export default function OilAnalysesPage() {
  const navigate = useNavigate();

  usePageTitle("Analyses d'huile", "Liste des analyses d'huile");

  const {
    items,
    totalCount,
    pageNumber,
    pageSize,
    loading,
    error,
    fetchList,
    clear,
  } = useOilAnalysesListStore();

  useEffect(() => {
    fetchList();

    return () => clear();
  }, [fetchList, clear]);

  const handlePageChange = async () => {
    await fetchList();
  };

  const handleOpenDetails = (id: number) => {
    navigate(`/oil-analyses/${id}`);
  };



  const handleCreate = () => {
    navigate("/oil-analyses/new");
  };

  const columns = [
    {
      key: "reference" as keyof OilAnalysisForList,
      label: "Référence",
      render: (item: OilAnalysisForList) =>
        item.reference || "-",
    },

    {
      key: "sourceReference" as keyof OilAnalysisForList,
      label: "Source",
      render: (item: OilAnalysisForList) =>
        item.sourceReference || "-",
    },

    {
      key: "analysisDate" as keyof OilAnalysisForList,
      label: "Date d'analyse",
      render: (item: OilAnalysisForList) =>
        item.analysisDate
          ? new Date(item.analysisDate).toLocaleDateString("fr-FR")
          : "-",
    },

    {
      key: "createdAt" as keyof OilAnalysisForList,
      label: "Créé le",
      render: (item: OilAnalysisForList) =>
        item.createdAt
          ? new Date(item.createdAt).toLocaleDateString("fr-FR")
          : "-",
    },

    {
      key: "status" as keyof OilAnalysisForList,
      label: "Statut",
      render: (item: OilAnalysisForList) =>
        renderStatus(
          item.status,
          productionStatusConfig,
        ),
    },

    {
      key: "id" as keyof OilAnalysisForList,
      label: "Actions",
      render: (item: OilAnalysisForList) => (
        <div
          style={{
            display: "flex",
            gap: "4px",
          }}
        >
          <ActionCard
            type="edit"
            title="Détails"
            onClick={() => handleOpenDetails(item.id)}
          />
        </div>
      ),
    },
  ];

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="feature-page">
      
      <div className="page-header page-header-actions">
        <Button
          variant="primary"
          onClick={handleCreate}
        >
          <IconPlus size={18} stroke={2} />
          Nouvelle analyse
        </Button>
      </div>

      <OilAnalysesFilter />

      {/* ====================================================== */}
      {/* ERROR                                                  */}
      {/* ====================================================== */}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* ====================================================== */}
      {/* TABLE                                                  */}
      {/* ====================================================== */}

      <DataTable
        data={items}
        columns={columns}
        pageNumber={pageNumber}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageChange={handlePageChange}
      />
      {loading && (
        <div className="loading">
          Chargement des analyses...
        </div>
      )}

    </div>
  );
}
