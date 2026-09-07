import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../../../../common/widgets/tables/OrdersTable";
import Button from "../../../../common/widgets/button/Button";
import TextInput from "../../../../common/widgets/textInput/TextInput";
import Select from "../../../../common/widgets/select/Select";
import EditIcon from "@mui/icons-material/Edit";

import type { OlivePurchasesFilter } from "../../domain/entities/OlivePurchaseFilter";

import { useOlivePurchasesStore } from "../stores/OlivePurchaseStore";
import { useConstantsStore } from "../../../appConstants/ConstantsStore";
import { renderStatus } from "../../../shared/utils/StatusUtils";
import { purchaseStatusConfig } from "../../../shared/status/PurchaseStatusConfig";
import type { OlivePurchaseForList } from "../../domain/entities/OlivePurchaseForList";
import { productionStatusConfig } from "../../../shared/status/ProductionStatusConfig";

export default function OlivePurchasesPage() {
  const navigate = useNavigate();

  const {
    olivePurchases,
    loading,
    error,
    filters,
    setFilter,
    clearFilters,
    fetchOlivePurchases,
  } = useOlivePurchasesStore();

  const {
    Appconstants,
    loading: constantsLoading,
    fetchConstants,
  } = useConstantsStore();

  useEffect(() => {
    fetchConstants();
  }, [fetchConstants]);

  useEffect(() => {
    fetchOlivePurchases();
  }, [fetchOlivePurchases]);

  const updateFilter = (
    field: keyof OlivePurchasesFilter,
    value: string | number,
  ) => {
    setFilter(field, value);
  };

  const handleSearch = async () => {
    setFilter("pageNumber", 1);
    await fetchOlivePurchases();
  };

  const handleReset = async () => {
    clearFilters();
    await fetchOlivePurchases();
  };

  const handlePageChange = async (page: number) => {
    setFilter("pageNumber", page);
    await fetchOlivePurchases();
  };

  const statusOptions = [
    {
      value: "",
      label: "Tous les statuts",
    },
    ...Appconstants.purchaseStatus.map((status) => ({
      value: String(status.id),
      label: status.label,
    })),
  ];

  const handleOpenDetails = (id: number) => {
         navigate(`/olive-purchases/${id}`);
  };

  const columns = [
    {
      key: "reference" as keyof OlivePurchaseForList,
      label: "N° Achat",
    },

    {
      key: "supplierName" as keyof OlivePurchaseForList,
      label: "Fournisseur",
    },

    {
      key: "purchaseDate" as keyof OlivePurchaseForList,
      label: "Date",
      render: (item: OlivePurchaseForList) =>
        new Date(item.purchaseDate).toLocaleDateString("fr-FR"),
    },
    {
      key: "quantityKg" as keyof OlivePurchaseForList,
      label: "Quantité (kg)",
    },
    {
      key: "analyseStatus" as keyof OlivePurchaseForList,
      label: "Analyse",
      render: (item: OlivePurchaseForList) =>
        renderStatus(item.analyseStatus, productionStatusConfig),
    },
    {
      key: "pressed" as keyof OlivePurchaseForList,
      label: "Pressé",
      render: (item: OlivePurchaseForList) =>
      renderStatus(item.pressed, productionStatusConfig),
    },

    {
      key: "status" as keyof OlivePurchaseForList,
      label: "Etat",
      render: (item: OlivePurchaseForList) =>
        renderStatus(item.status, purchaseStatusConfig),
    },




    {
      key: "id" as keyof OlivePurchaseForList,
      label: "Actions",

      render: (item: OlivePurchaseForList) => (
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

  return (
    <div className="feature-page">
      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">Achats d’olives</h1>

          <p className="page-description">
            Gestion des achats d’olives auprès des fournisseurs.
          </p>
        </div>
      </div>

      <div className="filters">
        <div className="filters-header">
          <div>
            <h3>Filtres de recherche</h3>

            <span>Rechercher un achat d’olives</span>
          </div>
        </div>

        <div className="filters-content">
          <div className="filter-item">
            <TextInput
              label="N° Achat"
              placeholder="ACH-2026-001"
              value={filters.purchaseNumber}
              onChange={(event) =>
                updateFilter("purchaseNumber", event.target.value)
              }
            />
          </div>

          <div className="filter-item">
            <TextInput
              label="Fournisseur"
              placeholder="Nom du fournisseur"
              value={filters.supplierName}
              onChange={(event) =>
                updateFilter("supplierName", event.target.value)
              }
            />
          </div>

          <div className="filter-item">
            <TextInput
              label="Du"
              type="date"
              value={filters.fromDate}
              onChange={(event) => updateFilter("fromDate", event.target.value)}
            />
          </div>

          <div className="filter-item">
            <TextInput
              label="Au"
              type="date"
              value={filters.toDate}
              onChange={(event) => updateFilter("toDate", event.target.value)}
            />
          </div>

          <div className="filter-item">
            <Select
              label="Statut"
              value={filters.status}
              onChange={(event) => updateFilter("status", event.target.value)}
              options={statusOptions}
            />
          </div>
        </div>

        <div className="filters-footer">
          <Button variant="secondary" onClick={handleReset} disabled={loading}>
            Réinitialiser
          </Button>

          <Button
            variant="primary"
            onClick={handleSearch}
            disabled={loading || constantsLoading}
          >
            {loading ? "Recherche..." : "Rechercher"}
          </Button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <DataTable
        data={olivePurchases.items}
        columns={columns}
        pageNumber={olivePurchases.pageNumber}
        pageSize={olivePurchases.pageSize}
        totalCount={olivePurchases.totalCount}
        onPageChange={handlePageChange}
      />

      {(loading || constantsLoading) && (
        <div className="loading">
          {constantsLoading
            ? "Chargement des constantes..."
            : "Chargement des achats d’olives..."}
        </div>
      )}
    </div>
  );
}
