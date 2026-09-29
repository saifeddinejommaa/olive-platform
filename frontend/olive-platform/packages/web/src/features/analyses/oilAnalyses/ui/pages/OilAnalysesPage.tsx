import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Button from "../../../../../common/widgets/button/Button";
import DataTable from "../../../../../common/widgets/tables/OrdersTable";
import ActionCard from "../../../../../common/widgets/actionCard/ActionCard";

import { usePageTitle } from "../../../../../common/hooks/usePageTitle";

import type { OilAnalysisForList } from "@olive-platform/core/features/analyses/oilAnalyses/domain/entities/OilAnalysisForList"
import { useOilAnalysesListStore } from "@olive-platform/core/features/analyses/oilAnalyses/stores/UseAnalysesListStore";
import { StartOilAnalysis } from "@olive-platform/core/features/analyses/oilAnalyses/domain/usecases/GetOilAnalysisDetails";
import { ProductionStatus } from "@olive-platform/core/features/production/domain/entities/ProductionStatus";
import OilAnalysesFilter from "../components/OilAnalysesFilter";
import { IconPlus } from "@tabler/icons-react";
import { renderStatus } from "../../../../../common/status/StatusUtils";
import { productionStatusConfig } from "../../../../../common/status/ProductionStatusConfig";

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
    setPage,
    clear,
  } = useOilAnalysesListStore();

  // Analyse en cours de lancement depuis la liste.
  const [startingId, setStartingId] = useState<number | null>(null);

  useEffect(() => {
    fetchList();

    return () => clear();
  }, [fetchList, clear]);

  const handlePageChange = async (page: number) => {
    setPage(page);
    await fetchList();
  };

  const handleOpenDetails = (id: number) => {
    navigate(`/oil-analyses/${id}`);
  };

  const handleCreate = () => {
    navigate("/oil-analyses/new");
  };

  // Lance l'analyse puis ouvre son détail pour saisir les résultats.
  const handleStart = async (item: OilAnalysisForList) => {
    if (startingId) return;

    setStartingId(item.id);

    try {
      await StartOilAnalysis(item.id);

      toast.success(`L'analyse ${item.reference} a été lancée.`);

      navigate(`/oil-analyses/${item.id}`);
    } catch (err) {
      toast.error(
        err instanceof Error && err.message
          ? err.message
          : "Impossible de lancer l'analyse d'huile.",
      );

      await fetchList();
    } finally {
      setStartingId(null);
    }
  };

  const columns = [
    {
      key: "reference" as keyof OilAnalysisForList,
      label: "Référence",
      render: (item: OilAnalysisForList) =>
        <strong>{item.reference || "-"}</strong>,
    },

    {
      key: "sourceReference" as keyof OilAnalysisForList,
      label: "Source",
      render: (item: OilAnalysisForList) =>
        item.sourceReference || "-",
    },

    {
      key: "oilLocation" as keyof OilAnalysisForList,
      label: "Citerne",
      render: (item: OilAnalysisForList) =>
        item.oilLocation || "-",
    },

    {
      key: "plannedDate" as keyof OilAnalysisForList,
      label: "Date d'analyse",
      render: (item: OilAnalysisForList) =>
        item.plannedDate
          ? new Date(item.plannedDate).toLocaleDateString("fr-FR")
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
        <div style={{ display: "flex", gap: "4px", justifyContent: "flex-end" }}>
          {item.status === ProductionStatus.Planned && (
            <ActionCard
              type="start"
              title={startingId === item.id ? "Lancement..." : "Lancer l'analyse"}
              onClick={() => handleStart(item)}
            />
          )}
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
        onRowClick={(item) => handleOpenDetails(item.id)}
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
