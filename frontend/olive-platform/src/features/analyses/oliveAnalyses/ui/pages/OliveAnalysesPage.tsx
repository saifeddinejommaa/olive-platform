import { useEffect } from "react";

import type { OliveAnalysis } from "../../domain/entities/OliveAnalysis";
import type { OliveAnalysesFilters } from "../../domain/entities/OliveAnalysesFilter";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import { useOliveAnalysesStore } from "../store/OliveAnalysesStore";
import { renderStatus } from "../../../../shared/utils/StatusUtils";
import { productionStatusConfig } from "../../../../shared/status/ProductionStatusConfig";
import TextInput from "../../../../../common/widgets/textInput/TextInput";
import Select from "../../../../../common/widgets/select/Select";
import Button from "../../../../../common/widgets/button/Button";
import DataTable from "../../../../../common/widgets/tables/OrdersTable";

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

  useEffect(() => {
    fetchAnalyses();
  }, [fetchAnalyses]);

  const updateFilter = (
    field: keyof OliveAnalysesFilters,
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

  // ============================================================
  // RESET
  // ============================================================

  const handleReset = async () => {
    clear();

    await fetchAnalyses({
      pageNumber: 1,
      pageSize: 10,
    });
  };

  // ============================================================
  // PAGINATION
  // ============================================================

  const handlePageChange = async (page: number) => {
    await fetchAnalyses({
      pageNumber: page,
    });
  };

  // ============================================================
  // DETAILS
  // ============================================================

  const handleOpenDetails = (id: number) => {
    navigate(`/Olive-analyses/${id}`);
  };

  // ============================================================
  // COLUMNS
  // ============================================================

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
          <EditIcon
            fontSize="small"
            sx={{
              color: "var(--color-olive-900)",
            }}
          />
        </button>
      ),
    },
  ];

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="feature-page">
      {/* ====================================================== */}
      {/* HEADER                                                 */}
      {/* ====================================================== */}

      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">Analyses d'olives</h1>

          <p className="page-description">
            Gestion des analyses physico-chimiques des olives et suivi de leur
            qualité.
          </p>
        </div>
      </div>

      {/* ====================================================== */}
      {/* FILTERS                                                */}
      {/* ====================================================== */}

      <div className="filters">
        <div className="filters-header">
          <div>
            <h3>Filtres de recherche</h3>

            <span>Rechercher une analyse d'olive</span>
          </div>
        </div>

        <div className="filters-content">
          {/* REFERENCE */}

          <div className="filter-item">
            <TextInput
              label="Référence"
              placeholder="ANA-2026-001"
              value={filter.reference ?? ""}
              onChange={(event) =>
                updateFilter("reference", event.target.value)
              }
            />
          </div>

          {/* SOURCE */}

          <div className="filter-item">
            <TextInput
              label="Ref de la Récolte:"
              placeholder="Ref de la Récolte"
              type="number"
              min="1"
              value={
                filter.harvestReference !== null &&
                filter.harvestReference !== undefined
                  ? String(filter.harvestReference)
                  : ""
              }
              onChange={(event) =>
                updateFilter(
                  "harvestReference",
                  event.target.value ? Number(event.target.value) : null,
                )
              }
            />
          </div>

          {/* PARCELLE */}

          <div className="filter-item">
            <TextInput
              label="Ref de la Parcelle"
              placeholder="Ref de la Parcelle"
              type="number"
              min="1"
              value={
                filter.plotReference !== null &&
                filter.plotReference !== undefined
                  ? String(filter.plotReference)
                  : ""
              }
              onChange={(event) =>
                updateFilter(
                  "plotReference",
                  event.target.value ? Number(event.target.value) : null,
                )
              }
            />
          </div>

          {/* STATUS */}

          <div className="filter-item">
            <Select
              label="Statut"
              value={filter.status ?? ""}
              onChange={(event) => updateFilter("status", event.target.value)}
              options={[
                {
                  value: "",
                  label: "Tous les statuts",
                },
                {
                  value: "Planned",
                  label: "Planifiée",
                },
                {
                  value: "InProgress",
                  label: "En cours",
                },
                {
                  value: "Completed",
                  label: "Clôturée",
                },
                {
                  value: "Cancelled",
                  label: "Annulée",
                },
              ]}
            />
          </div>
        </div>

        {/* ==================================================== */}
        {/* FILTER ACTIONS                                       */}
        {/* ==================================================== */}

        <div className="filters-footer">
          <Button variant="secondary" onClick={handleReset} disabled={loading}>
            Réinitialiser
          </Button>

          <Button variant="primary" onClick={handleSearch} disabled={loading}>
            {loading ? "Recherche..." : "Rechercher"}
          </Button>
        </div>
      </div>

      {/* ====================================================== */}
      {/* ERROR                                                  */}
      {/* ====================================================== */}

      {error && <div className="error-message">{error}</div>}

      {/* ====================================================== */}
      {/* TABLE                                                  */}
      {/* ====================================================== */}

      <DataTable
        data={analyses}
        columns={columns}
        pageNumber={filter.pageNumber}
        pageSize={filter.pageSize}
        totalCount={total}
        onPageChange={handlePageChange}
      />

      {/* ====================================================== */}
      {/* LOADING                                                */}
      {/* ====================================================== */}

      {loading && <div className="loading">Chargement des analyses...</div>}
    </div>
  );
}
