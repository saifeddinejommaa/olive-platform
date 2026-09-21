import { useEffect, useState } from "react";

import DataTable from "../../../../common/widgets/tables/OrdersTable";
import ActionCard from "../../../../common/widgets/actionCard/ActionCard";

import { usePendingPaymentsStore } from "@olive-platform/core/features/payments/stores/UsePendingPaymentsStore";

import PendingPaymentFilterComponent from "../components/PendingPaymentFilterComponent";
import PendingPaymentDetailsDrawer from "../components/PendingPaymentDetailsDrawer";

import type { PendingPayment } from "@olive-platform/core/features/payments/domain/entities/PandingPayment";
import { getCostTypeLabel } from "@olive-platform/core/features/appConstants/helper/AppConstantsHelper";

export default function PendingPaymentTab() {
  const {
    payments,
    loading,
    error,
    setFilter,
    fetchPayments,
  } = usePendingPaymentsStore();

  /*
   * Paiement sélectionné pour afficher les détails
   */
  const [selectedPayment, setSelectedPayment] =
    useState<PendingPayment | null>(null);

  /*
   * Chargement initial
   */
  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  /*
   * Pagination
   */
  const handlePageChange = async (page: number) => {
    setFilter("pageNumber", page);

    await fetchPayments();
  };

  /*
   * Détails
   */
  const handleOpenDetails = (payment: PendingPayment) => {
    setSelectedPayment(payment);
  };

  /*
   * Fermeture du drawer
   */
  const handleCloseDetails = () => {
    setSelectedPayment(null);
  };
  /*
   * Colonnes du tableau
   */
  const columns = [
    {
      key: "recipientName" as keyof PendingPayment,
      label: "Destinataire",
      render: (item: PendingPayment) =>
        item.recipientName ?? "—",
    },

    {
      key: "sourceType" as keyof PendingPayment,
      label: "Type de service",
      render: (item: PendingPayment) =>
        getCostTypeLabel(item.sourceType) ?? "—",
    },

    {
      key: "amountDue" as keyof PendingPayment,
      label: "Montant",
      render: (item: PendingPayment) =>
        item.amountDue.toLocaleString("fr-FR", {
          style: "currency",
          currency: "EUR",
        }),
    },

    {
      key: "paymentSourcesLength" as keyof PendingPayment,
      label: "Nombre d'opérations",
      render: (item: PendingPayment) =>
        item.paymentSources.length,
    },

    {
      key: "paymentSources" as keyof PendingPayment,
      label: "Actions",
      render: (item: PendingPayment) => (
        <div
          style={{
            display: "flex",
            gap: "4px",
          }}
        >
          <ActionCard
            type="edit"
            title="Détails"
            onClick={() => handleOpenDetails(item)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="feature-page">
      {/* =====================================================
          FILTRES
          ===================================================== */}

      <PendingPaymentFilterComponent />

      {/* =====================================================
          ERREUR
          ===================================================== */}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* =====================================================
          TABLEAU
          ===================================================== */}

      <DataTable
        data={payments.items}
        columns={columns}
        pageNumber={payments.pageNumber}
        pageSize={payments.pageSize}
        totalCount={payments.totalCount}
        onPageChange={handlePageChange}
      />

      {/* =====================================================
          CHARGEMENT
          ===================================================== */}

      {loading && (
        <div className="loading">
          Chargement des paiements...
        </div>
      )}

      {/* =====================================================
          DRAWER DÉTAILS
          ===================================================== */}

      <PendingPaymentDetailsDrawer
        open={selectedPayment !== null}
        payment={selectedPayment}
        onClose={handleCloseDetails}
        onPaymentSuccess={()=>fetchPayments()}
      />
    </div>
  );
}