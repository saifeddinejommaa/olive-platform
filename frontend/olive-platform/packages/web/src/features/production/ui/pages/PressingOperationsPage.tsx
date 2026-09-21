// src/features/production/pressingOperations/presentation/pages/PressingOperationsPage.tsx

import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import DataTable from "../../../../common/widgets/tables/OrdersTable";
import ActionCard from "../../../../common/widgets/actionCard/ActionCard";
import PressingOperationsFilterComponent from "../components/PressingOperationsFilterComponent";
import { usePageTitle } from "../../../../common/hooks/usePageTitle";

import { usePressingOperationsStore } from "@olive-platform/core/features/production/stores/pressingOperationStore";
import type { PressingOperation } from "@olive-platform/core/features/production/domain/entities/PressingOperation";
import { formatDateTime } from "@olive-platform/core/features/shared/utils/DatesUtils";
import { productionStatusConfig } from "../../../../common/status/ProductionStatusConfig";
import { renderStatus } from "../../../../common/status/StatusUtils";
import Button from "../../../../common/widgets/button/Button";
import { IconPlus } from "@tabler/icons-react";

export default function PressingOperationsPage() {
  const navigate = useNavigate();

  usePageTitle(
    "Opérations de pression",
    "Gestion des opérations de pression des olives et de la production d'huile.",
  );

  const { PressingOperations, setFilter, fetchPressingOperations } =
    usePressingOperationsStore();

  useEffect(() => {
    fetchPressingOperations();
  }, []);

  const handlePageChange = async (pageNumber: number) => {
    setFilter("pageNumber", pageNumber);
    await fetchPressingOperations();
  };

  const handleOpenDetails = (id: number) => {
    navigate(`/production/pressing-operations/${id}`);
  };

  const columns = [
    {
      key: "operationNumber" as keyof PressingOperation,
      label: "N° Pression",
    },
    {
      key: "createdAt" as keyof PressingOperation,
      label: "Date",
      render: (item: PressingOperation) => formatDateTime(item.createdAt),
    },
    {
      key: "status" as keyof PressingOperation,
      label: "Statut",
      render: (item: PressingOperation) =>
        renderStatus(item.status, productionStatusConfig),
    },
    {
      key: "oilQuantityLiters" as keyof PressingOperation,
      label: "Huile produite",
      render: (item: PressingOperation) =>
        item.oilQuantityLiters !== null
          ? `${item.oilQuantityLiters.toLocaleString()} L`
          : "—",
    },
    {
      key: "id" as keyof PressingOperation,
      label: "Actions",
      render: (item: PressingOperation) => (
        <ActionCard
          type="edit"
          title="Détails"
          onClick={() => handleOpenDetails(item.id)}
        />
      ),
    },
  ];

  const handleCreate = () => {
    navigate("/production/new");
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
      <PressingOperationsFilterComponent />

      <DataTable
        data={PressingOperations?.items ?? []}
        columns={columns}
        pageNumber={PressingOperations?.pageNumber ?? 1}
        pageSize={PressingOperations?.pageSize ?? 10}
        totalCount={PressingOperations?.totalCount ?? 0}
        onPageChange={handlePageChange}
      />
    </div>
  );
}