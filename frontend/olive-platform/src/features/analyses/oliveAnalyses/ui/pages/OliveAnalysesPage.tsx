import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";

import type { OliveAnalysis } from "../../domain/entities/OliveAnalysis";
import type { OliveAnalysesFilters as OliveAnalysesFiltersType } from "../../domain/entities/OliveAnalysesFilter";
import { useOliveAnalysesStore } from "../store/OliveAnalysesStore";
import { renderStatus } from "../../../../shared/utils/StatusUtils";
import { productionStatusConfig } from "../../../../shared/status/ProductionStatusConfig";
import DataTable from "../../../../../common/widgets/tables/OrdersTable";
import Button from "../../../../../common/widgets/button/Button";
import OliveAnalysesFilterComponent from "../components/OliveAnalysesFilterComponent";
import { usePageTitle } from "../../../../../common/hooks/usePageTitle";

export default function OliveAnalysesPage() {
  const navigate = useNavigate();
  const {
    analyses,
    total,
    loading,
    error,
    filter,
    setParams,
    fetchAnalyses,
    clear,
  } = useOliveAnalysesStore();

  usePageTitle("Analyses d'olives",
    "Gestion des analyses physico-chimiques des olives et suivi de leur qualité.")

  useEffect(() => {
    fetchAnalyses();
  }, [fetchAnalyses]);

  const updateFilter = (
    field: keyof OliveAnalysesFiltersType,
    value: string | number | null,
  ) => {
    setParams({
      [field]: value,
    });
  };

  const handleSearch = async () => {
    await fetchAnalyses({
      pageNumber: 1,
    });
  };

  const handleReset = async () => {
    clear();

    await fetchAnalyses({
      pageNumber: 1,
      pageSize: 10,
    });
  };

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
      render: (item: OliveAnalysis) => item.reference || "-",
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
        renderStatus(item.status, productionStatusConfig),
    },
    {
      key: "id" as keyof OliveAnalysis,
      label: "Actions",
      render: (item: OliveAnalysis) => (
        <button
          type="button"
          title="Modifier l'analyse"
          aria-label="Modifier l'analyse"
          onClick={() => handleOpenDetails(item.id)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "6px",
          }}
        >
          <EditIcon fontSize="small" sx={{ color: "var(--color-olive-900)" }} />
        </button>
      ),
    },
  ];

  return (
    <div className="feature-page">
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom:10 }}>
        <Button variant="primary" onClick={handleCreateAnalysis}>
          <AddIcon fontSize="small" />
          Nouvelle analyse
        </Button>
      </div>

      <OliveAnalysesFilterComponent
        filter={filter}
        loading={loading}
        onFilterChange={updateFilter}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      {error && <div className="error-message">{error}</div>}

      <DataTable
        data={analyses}
        columns={columns}
        pageNumber={filter.pageNumber}
        pageSize={filter.pageSize}
        totalCount={total}
        onPageChange={handlePageChange}
      />

      {loading && <div className="loading">Chargement des analyses...</div>}
    </div>
  );
}