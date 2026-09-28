import TextInput from "../../../../common/widgets/textInput/TextInput";
import Button from "../../../../common/widgets/button/Button";
import Card from "../../../../common/widgets/card/Card";
import { useHarvestsStore } from "@olive-platform/core/features/harvests/stores/HarvestsStore";
import type { HarvestFilters } from "@olive-platform/core/features/harvests/domain/entities/HarvestsFilters";
import type { ProductionStatus } from "@olive-platform/core/features/production/domain/entities/ProductionStatus";
import ProductionStatusSelector from "../../../../common/widgets/ProductionStatusSelector";

export default function HarvestsFilterComponent() {
  const { filters, loading, setFilter, clearFilters, fetchHarvests } =
    useHarvestsStore();

  const updateFilter = (
    field: keyof HarvestFilters,
    value: string | number | null,
  ) => {
    setFilter(field, value);
  };

  const handleSearch = async () => {
    setFilter("pageNumber", 1);
    await fetchHarvests();
  };

  const handleReset = async () => {
    clearFilters();
    await fetchHarvests();
  };

  return (
    <Card>
      <div className="filters">
        <div className="filters-header">
          <div>
            <h3 className="filter-title">Filtres de recherche</h3>
            <span className="filter-subtitle">Rechercher une récolte</span>
          </div>
        </div>

        <div className="filters-content filters-content-row">
          <div className="filter-item">
            <TextInput
              label="N° Récolte"
              placeholder="HARV-2026-001"
              value={filters.harvestNumber ?? ""}
              onChange={(event) =>
                updateFilter("harvestNumber", event.target.value)
              }
            />
          </div>

          <div className="filter-item">
            <TextInput
              label="Référence parcelle"
              placeholder="PLOT-001"
              value={filters.plotReference ?? ""}
              onChange={(event) =>
                updateFilter("plotReference", event.target.value)
              }
            />
          </div>

          <div className="filter-item">
            <TextInput
              label="Début à partir du"
              type="date"
              value={filters.fromDate ?? ""}
              onChange={(event) => updateFilter("fromDate", event.target.value)}
            />
          </div>

          <div className="filter-item">
            <TextInput
              label="Fin jusqu'au"
              type="date"
              value={filters.toDate ?? ""}
              onChange={(event) => updateFilter("toDate", event.target.value)}
            />
          </div>

          <div className="filter-item">
            <ProductionStatusSelector
              label="Statut"
              value={filters.status ?? null}
              onChange={(value) =>
                updateFilter("status", value as ProductionStatus | null)
              }
            />
          </div>
        </div>

        <div className="filters-footer">
          <Button variant="secondary" onClick={handleReset} disabled={loading}>
            Réinitialiser
          </Button>

          <Button variant="primary" onClick={handleSearch} disabled={loading}>
            {loading ? "Recherche..." : "Rechercher"}
          </Button>
        </div>
      </div>
    </Card>
  );
}