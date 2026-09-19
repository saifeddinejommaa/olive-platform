import { useEffect } from "react";

import DataTable from "../../../../common/widgets/tables/OrdersTable";
import { usePaymentsHistoryStore } from "../stores/UsePaymentsHistoryStore";
import type { ProcessedPayment } from "../../domain/entities/ProcessedPayment";
import PaymentHistoryFilterComponent from "../components/PaymentHistoryFilterComponent";
import { getPaymentMethodLabel } from "../../../appConstants/helper/AppConstantsHelper";

export default function PaymentHistoryTab() {
  const {
    payments,
    loading,
    error,
    fetchPayments,
  } = usePaymentsHistoryStore();

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
    usePaymentsHistoryStore
      .getState()
      .setFilter("pageNumber", page);

    await fetchPayments();
  };

  /*
   * Colonnes du tableau
   */
  const columns = [
    {
      key: "recipientName" as keyof ProcessedPayment,
      label: "Destinataire",
      render: (item: ProcessedPayment) =>
        item.recipientName ?? "—",
    },

    {
      key: "paymentDate" as keyof ProcessedPayment,
      label: "Date",
      render: (item: ProcessedPayment) =>
        item.paymentDate
          ? new Date(
              item.paymentDate,
            ).toLocaleDateString("fr-FR")
          : "—",
    },

    {
      key: "amount" as keyof ProcessedPayment,
      label: "Montant",
      render: (item: ProcessedPayment) =>
        item.amount.toLocaleString("fr-FR", {
          style: "currency",
          currency: "EUR",
        }),
    },

    {
      key: "paymentMethod" as keyof ProcessedPayment,
      label: "Moyen de paiement",
      render: (item: ProcessedPayment) =>
        getPaymentMethodLabel(item.paymentMethod) ?? "—",
    },
  ];

  return (
    <div className="feature-page">

      <PaymentHistoryFilterComponent
      />

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <DataTable
        data={payments.items}
        columns={columns}
        pageNumber={payments.pageNumber}
        pageSize={payments.pageSize}
        totalCount={payments.totalCount}
        onPageChange={handlePageChange}
      />

      {loading && (
        <div className="loading">
          Chargement de l'historique des paiements...
        </div>
      )}
    </div>
  );
}