import TextInput from "../../../../common/widgets/textInput/TextInput";
import Button from "../../../../common/widgets/button/Button";
import Card from "../../../../common/widgets/card/Card";

import { usePaymentsHistoryStore } from "@olive-platform/core/features/payments/stores/UsePaymentsHistoryStore";
import type { PaymentHistoryFilter } from "@olive-platform/core/features/payments/domain/entities/PaymentHistoryFilter";

export default function PaymentHistoryFilterComponent() {
  const {
    filters,
    loading,
    setFilter,
    clearFilters,
    fetchPayments,
  } = usePaymentsHistoryStore();

  const updateFilter = (
    field: keyof PaymentHistoryFilter,
    value: string | number | undefined,
  ) => {
    setFilter(field, value);
  };

  const handleSearch = async () => {
    setFilter("pageNumber", 1);
    await fetchPayments();
  };

  const handleReset = async () => {
    clearFilters();
    await fetchPayments();
  };

  return (
    <Card>
      <div className="filters">

        <div className="filters-header">
          <div>
            <h3 className="filter-title">
              Filtres de recherche
            </h3>

            <span className="filter-subtitle">
              Rechercher dans l'historique des paiements
            </span>
          </div>
        </div>

        <div className="filters-content filters-content-row">
          <div className="filter-item">
            <TextInput
              label="Destinataire"
              placeholder="Nom du destinataire"
              value={filters.recipientName ?? ""}
              onChange={(event) =>
                updateFilter(
                  "recipientName",
                  event.target.value || undefined,
                )
              }
            />
          </div>

          <div className="filter-item">
            <TextInput
              label="Montant minimum"
              placeholder="Ex. 100"
              type="number"
              value={
                filters.minAmount !== undefined
                  ? String(filters.minAmount)
                  : ""
              }
              onChange={(event) =>
                updateFilter(
                  "minAmount",
                  event.target.value
                    ? Number(event.target.value)
                    : undefined,
                )
              }
            />
          </div>

          <div className="filter-item">
            <TextInput
              label="Montant maximum"
              placeholder="Ex. 1000"
              type="number"
              value={
                filters.maxAmount !== undefined
                  ? String(filters.maxAmount)
                  : ""
              }
              onChange={(event) =>
                updateFilter(
                  "maxAmount",
                  event.target.value
                    ? Number(event.target.value)
                    : undefined,
                )
              }
            />
          </div>

          <div className="filter-item">
            <TextInput
              label="Du"
              type="date"
              value={filters.paymentDateFrom ?? ""}
              onChange={(event) =>
                updateFilter(
                  "paymentDateFrom",
                  event.target.value || undefined,
                )
              }
            />
          </div>

          <div className="filter-item">
            <TextInput
              label="Au"
              type="date"
              value={filters.paymentDateTo ?? ""}
              onChange={(event) =>
                updateFilter(
                  "paymentDateTo",
                  event.target.value || undefined,
                )
              }
            />
          </div>
        </div>

        <div className="filters-footer">
          <Button
            variant="secondary"
            onClick={handleReset}
            disabled={loading}
          >
            Réinitialiser
          </Button>

          <Button
            variant="primary"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? "Recherche..." : "Rechercher"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
