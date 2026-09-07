import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import EditIcon from "@mui/icons-material/Edit";

import TextInput from "../../../../../common/widgets/textInput/TextInput";
import Select from "../../../../../common/widgets/select/Select";
import Button from "../../../../../common/widgets/button/Button";
import DataTable from "../../../../../common/widgets/tables/OrdersTable";

import { renderStatus } from "../../../../shared/utils/StatusUtils";
import { productionStatusConfig } from "../../../../shared/status/ProductionStatusConfig";

import type { ProductionStatus } from "../../../../production/domain/entities/ProductionStatus";
import { useOilAnalysesListStore } from "../../../oilAnalyses/ui/stores/UseAnalysesListStore";
import type { OilAnalysisForList } from "../../../oilAnalyses/domain/entities/OilAnalysisForList";

export default function OilAnalysesPage() {
  const navigate = useNavigate();

  // ============================================================
  // STORE
  // ============================================================

  const {
    items,
    totalCount,
    pageNumber,
    pageSize,
    filters,
    loading,
    error,
    fetchList,
    setFilters,
    setPage,
    clear,
  } = useOilAnalysesListStore();

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    fetchList();
    return () => clear();
  }, [fetchList, clear]);

  // ============================================================
  // FILTER UPDATE
  // ============================================================

  const updateFilter = (
    field: keyof typeof filters,
    value: string | number | ProductionStatus | null,
  ) => {
    setFilters({
      [field]: value,
    });
  };

  // ============================================================
  // SEARCH
  // ============================================================

  const handleSearch = async () => {
    await fetchList();
  };

  // ============================================================
  // RESET
  // ============================================================

  const handleReset = async () => {
    clear();

    await fetchList();
  };

  // ============================================================
  // PAGINATION
  // ============================================================

  const handlePageChange = async (page: number) => {
    await fetchList();
  };

  // ============================================================
  // DETAILS
  // ============================================================

  const handleOpenDetails = (id: number) => {
    navigate(`/oil-analyses/${id}`);
  };

  // ============================================================
  // COLUMNS
  // ============================================================

  const columns = [
    {
      key: "reference" as keyof OilAnalysisForList,

      label: "Référence",

      render: (item: OilAnalysisForList) => item.reference || "-",
    },

    {
      key: "sourceReference" as keyof OilAnalysisForList,

      label: "Source",

      render: (item: OilAnalysisForList) => item.sourceReference || "-",
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
        renderStatus(item.status, productionStatusConfig),
    },

    {
      key: "id" as keyof OilAnalysisForList,

      label: "Actions",

      render: (item: OilAnalysisForList) => (
        <button
          type="button"
          title="Modifier l'analyse"
          aria-label="Modifier l'analyse"
          onClick={(event) => {
            event.stopPropagation();
            handleOpenDetails(item.id);
          }}
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
          <h1 className="page-title">Analyses d'huile</h1>

          <p className="page-description">
            Gestion des analyses physico-chimiques des huiles et suivi de leur
            qualité.
          </p>
        </div>

        <Button variant="primary" onClick={() => navigate("/oil-analyses/new")}>
          Nouvelle analyse
        </Button>
      </div>

      {/* ====================================================== */}
      {/* FILTERS                                                */}
      {/* ====================================================== */}

      <div className="filters">
        <div className="filters-header">
          <div>
            <h3>Filtres de recherche</h3>

            <span>Rechercher une analyse d'huile</span>
          </div>
        </div>

        <div className="filters-content">
          {/* ================================================== */}
          {/* REFERENCE                                           */}
          {/* ================================================== */}

          <div className="filter-item">
            <TextInput
              label="Référence"
              placeholder="ANA-HUILE-2026-001"
              value={filters.reference ?? ""}
              onChange={(event) =>
                updateFilter("reference", event.target.value)
              }
            />
          </div>

          {/* ================================================== */}
          {/* SOURCE                                              */}
          {/* ================================================== */}

          <div className="filter-item">
            <TextInput
              label="Référence de la source"
              placeholder="Référence de l'opération ou du tank"
              value={filters.reference ?? ""}
              onChange={(event) =>
                updateFilter("reference", event.target.value)
              }
            />
          </div>

          {/* ================================================== */}
          {/* DATE                                                */}
          {/* ================================================== */}

          <div className="filter-item">
            <TextInput
              label="Date d'analyse"
              type="date"
              value={filters.analysisDate ?? ""}
              onChange={(event) =>
                updateFilter("analysisDate", event.target.value)
              }
            />
          </div>

          {/* ================================================== */}
          {/* STATUS                                              */}
          {/* ================================================== */}

          <div className="filter-item">
            <Select
              label="Statut"
              value={filters.status ?? ""}
              onChange={(event) =>
                updateFilter(
                  "status",
                  event.target.value ? Number(event.target.value) : null,
                )
              }
              options={[
                {
                  value: "",
                  label: "Tous les statuts",
                },
                {
                  value: "1",
                  label: "Planifiée",
                },
                {
                  value: "2",
                  label: "En cours",
                },
                {
                  value: "3",
                  label: "Clôturée",
                },
                {
                  value: "4",
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
        data={items}
        columns={columns}
        pageNumber={pageNumber}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageChange={handlePageChange}
      />

      {/* ====================================================== */}
      {/* LOADING                                                */}
      {/* ====================================================== */}

      {loading && <div className="loading">Chargement des analyses...</div>}
    </div>
  );
}
