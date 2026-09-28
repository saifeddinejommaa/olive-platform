// src/features/production/olivePurchases/presentation/pages/OlivePurchasesPage.tsx

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import DataTable from "../../../../common/widgets/tables/OrdersTable";
import ActionCard from "../../../../common/widgets/actionCard/ActionCard";
import OlivePurchasesFilterComponent from "../components/OlivePurchasesFilterComponent";
import { usePageTitle } from "../../../../common/hooks/usePageTitle";

import { useOlivePurchasesStore } from "@olive-platform/core/features/olivePurchases/stores/OlivePurchaseStore";
import { useConstantsStore } from "../../../../stores/ConstantsStore";
import type { OlivePurchaseForList } from "@olive-platform/core/features/olivePurchases/domain/entities/OlivePurchaseForList";
import Button from "../../../../common/widgets/button/Button";
import { IconPlus } from "@tabler/icons-react";
import { renderStatus } from "../../../../common/status/StatusUtils";
import { productionStatusConfig } from "../../../../common/status/ProductionStatusConfig";
import { purchaseStatusConfig } from "../../../../common/status/PurchaseStatusConfig";

export default function OlivePurchasesPage() {
  const navigate = useNavigate();

  usePageTitle(
    "Achats d'olives",
    "Gestion des achats d'olives auprès des fournisseurs.",
  );

  const {
    olivePurchases,
    loading,
    error,
    fetchOlivePurchases,
  } = useOlivePurchasesStore();

  const { loading: constantsLoading, fetchConstants } = useConstantsStore();

  useEffect(() => {
    fetchConstants();
  }, [fetchConstants]);

  useEffect(() => {
    fetchOlivePurchases();
  }, [fetchOlivePurchases]);

  const handlePageChange = async (page: number) => {
    useOlivePurchasesStore.getState().setFilter("pageNumber", page);
    await fetchOlivePurchases();
  };

  const handleOpenDetails = (id: number) => {
    navigate(`/olive-purchases/${id}`);
  };

  // Ouvre « Nouvelle pression » avec l'achat et ses lots pressables présélectionnés.
  const handleLaunchPressing = (purchaseId: number) => {
    navigate(`/production/new?purchaseId=${purchaseId}`);
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
        <div style={{ display: "flex", gap: "4px" }}>
          {item.canBePressed && (
            <ActionCard
              type="press"
              title="Lancer la pression"
              onClick={() => handleLaunchPressing(item.id)}
            />
          )}
        </div>
      ),
    },
  ];

  const handleCreate = () => {
    navigate("/olive-purchases/new");
  };

  return (
    <div className="feature-page">

      <div className="page-header page-header-actions">
              <Button
                variant="primary"
                onClick={handleCreate}
              >
                <IconPlus size={18} stroke={2} />
                Nouvel Achat
              </Button>
            </div>
      <OlivePurchasesFilterComponent />

      {error && <div className="error-message">{error}</div>}

      <DataTable
        data={olivePurchases.items}
        columns={columns}
        onRowClick={(item) => handleOpenDetails(item.id)}
        pageNumber={olivePurchases.pageNumber}
        pageSize={olivePurchases.pageSize}
        totalCount={olivePurchases.totalCount}
        onPageChange={handlePageChange}
      />

      {(loading || constantsLoading) && (
        <div className="loading">
          {constantsLoading
            ? "Chargement des constantes..."
            : "Chargement des achats d'olives..."}
        </div>
      )}
    </div>
  );
}