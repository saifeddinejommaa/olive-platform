import TextInput from "../../../../common/widgets/textInput/TextInput";
import Button from "../../../../common/widgets/button/Button";
import Card from "../../../../common/widgets/card/Card";

import { usePendingPaymentsStore } from "@olive-platform/core/features/payments/stores/UsePendingPaymentsStore";
import type { PendingPaymentFilter } from "@olive-platform/core/features/payments/domain/entities/PendingPaymentFilter";

export default function PendingPaymentFilterComponent() {
  const {
    filters,
    loading,
    setFilter,
    clearFilters,
    fetchPayments,
  } = usePendingPaymentsStore();

  const updateFilter = (
    field: keyof PendingPaymentFilter,
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
        {/* =====================================================
            HEADER
            ===================================================== */}

        <div className="filters-header">
          <div>
            <h3 className="filter-title">
              Filtres de recherche
            </h3>

            <span className="filter-subtitle">
              Rechercher les paiements en attente
            </span>
          </div>
        </div>

        {/* =====================================================
            CONTENT
            ===================================================== */}

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
        </div>

        {/* =====================================================
            FOOTER
            ===================================================== */}

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
