// src/features/production/olivePurchases/presentation/pages/OlivePurchasesPage.tsx

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import DataTable from "../../../../common/widgets/tables/OrdersTable";
import ActionCard from "../../../../common/widgets/actionCard/ActionCard";
import OlivePurchasesFilterComponent from "../components/OlivePurchasesFilterComponent";
import { usePageTitle } from "../../../../common/hooks/usePageTitle";

import { useOlivePurchasesStore } from "@olive-platform/core/features/olivePurchases/stores/OlivePurchaseStore";
import { useConstantsStore } from "@olive-platform/core/features/appConstants/ConstantsStore";
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
    launchPressing,
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

  const handleLaunchPressing = async (purchaseId: number) => {
    try {
      const id = await launchPressing(purchaseId);
      toast.success("Opération de pression créée avec succès.");
      navigate(`/production/pressing-operations/${id}`);
    } catch {
      toast.error("Impossible de créer l'opération de pression.");
    }
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