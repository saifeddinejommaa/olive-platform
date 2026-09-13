import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IconPlus } from "@tabler/icons-react";

import type { OliveAnalysis } from "../../domain/entities/OliveAnalysis";
import { useOliveAnalysesStore } from "../store/OliveAnalysesStore";
import { renderStatus } from "../../../../shared/utils/StatusUtils";
import { productionStatusConfig } from "../../../../shared/status/ProductionStatusConfig";
import DataTable from "../../../../../common/widgets/tables/OrdersTable";
import Button from "../../../../../common/widgets/button/Button";
import ActionCard from "../../../../../common/widgets/actionCard/ActionCard";
import OliveAnalysesFilterComponent from "../components/OliveAnalysesFilterComponent";
import { usePageTitle } from "../../../../../common/hooks/usePageTitle";

export default function OliveAnalysesPage() {
  const navigate = useNavigate();

  usePageTitle(
    "Analyses d'olives",
    "Gestion des analyses physico-chimiques des olives et suivi de leur qualité.",
  );

  const {
    analyses,
    total,
    loading,
    error,
    filter,
    fetchAnalyses,
  } = useOliveAnalysesStore();

  useEffect(() => {
    fetchAnalyses();
  }, [fetchAnalyses]);

  const handlePageChange = async (page: number) => {
    await fetchAnalyses({
      pageNumber: page,
    });
  };

  const handleOpenDetails = (id: number) => {
    navigate(`/Olive-analyses/${id}`);
  };

  const handleCreateAnalysis = () => {
    navigate("/olive-analyses/new");
  };

  const columns = [
    {
      key: "reference" as keyof OliveAnalysis,
      label: "Référence",
    },
    {
      key: "analysisDate" as keyof OliveAnalysis,
      label: "Date d'analyse",
      render: (item: OliveAnalysis) =>
        item.analysisDate
          ? new Date(item.analysisDate).toLocaleDateString("fr-FR")
          : "-",
    },
    {
      key: "sourceId" as keyof OliveAnalysis,
      label: "Source",
      render: (item: OliveAnalysis) =>
        item.sourceId ? item.sourceId.toString() : "-",
    },
    {
      key: "status" as keyof OliveAnalysis,
      label: "Statut",
      render: (item: OliveAnalysis) =>
        renderStatus(
          item.status,
          productionStatusConfig,
        ),
    },
    {
      key: "id" as keyof OliveAnalysis,
      label: "Actions",
      render: (item: OliveAnalysis) => (
        <ActionCard
          type="edit"
          title="Détails"
          onClick={() => handleOpenDetails(item.id)}
        />
      ),
    },
  ];

  return (
    <div className="feature-page">
      <div className="page-header page-header-actions">
        <Button
          variant="primary"
          onClick={handleCreateAnalysis}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <IconPlus size={18} stroke={2} />
            Nouvelle analyse
          </span>
        </Button>
      </div>

      <OliveAnalysesFilterComponent />

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <DataTable
        data={analyses}
        columns={columns}
        pageNumber={filter.pageNumber}
        pageSize={filter.pageSize}
        totalCount={total}
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