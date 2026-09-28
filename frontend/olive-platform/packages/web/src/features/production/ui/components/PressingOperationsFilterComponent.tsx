// src/features/production/pressingOperations/presentation/components/PressingOperationsFilterComponent.tsx

import TextInput from "../../../../common/widgets/textInput/TextInput";
import Button from "../../../../common/widgets/button/Button";
import Card from "../../../../common/widgets/card/Card";
import { usePressingOperationsStore } from "@olive-platform/core/features/production/stores/pressingOperationStore";
import type { PressingOperationFilters } from "@olive-platform/core/features/production/domain/entities/PressingOperationFilters";

export default function PressingOperationsFilterComponent() {
  const { filters, loading, setFilter, clearFilters, fetchPressingOperations } =
    usePressingOperationsStore();

  const updateFilter = (
    field: keyof PressingOperationFilters,
    value: string,
  ) => {
    setFilter(field, value);
  };

  const handleSearch = async () => {
    setFilter("pageNumber", 1);
    await fetchPressingOperations();
  };

  const handleReset = async () => {
    clearFilters();
    await fetchPressingOperations();
  };

  return (
    <Card>
      <div className="filters">
        <div className="filters-header">
          <div>
            <h3 className="filter-title">Filtres de recherche</h3>
            <span className="filter-subtitle">
              Rechercher une opération de pression
            </span>
          </div>
        </div>

        <div className="filters-content filters-content-row">
          <div className="filter-item">
            <TextInput
              label="Référence"
              placeholder="PRESS-2026-001"
              value={filters.operationNumber ?? ""}
              onChange={(event) =>
                updateFilter("operationNumber", event.target.value)
              }
            />
          </div>

          <div className="filter-item">
            <TextInput
              label="Début à partir du"
              type="date"
              value={filters.fromDate ?? ""}
              onChange={(event) =>
                updateFilter("fromDate", event.target.value)
              }
            />
          </div>

          <div className="filter-item">
            <TextInput
              label="Fin jusqu'au"
              type="date"
              value={filters.toDate ?? ""}
              onChange={(event) =>
                updateFilter("toDate", event.target.value)
              }
            />
          </div>

          <div className="filter-item">
            <TextInput
              label="Réf. récolte"
              placeholder="HARV-2026-001"
              value={filters.harvestNumber ?? ""}
              onChange={(event) =>
                updateFilter("harvestNumber", event.target.value)
              }
            />
          </div>

          <div className="filter-item">
            <TextInput
              label="Réf. achat"
              placeholder="ACH-2026-001"
              value={filters.purchaseNumber ?? ""}
              onChange={(event) =>
                updateFilter("purchaseNumber", event.target.value)
              }
            />
          </div>
        </div>

        <div className="filters-footer">
          <Button variant="secondary" onClick={handleReset}>
            Réinitialiser
          </Button>
          <Button variant="primary" onClick={handleSearch}>
            {loading ? "Recherche..." : "Rechercher"}
          </Button>
        </div>
      </div>
    </Card>
  );
}