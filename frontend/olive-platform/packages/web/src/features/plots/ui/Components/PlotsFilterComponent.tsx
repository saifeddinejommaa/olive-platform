import TextInput from "../../../../common/widgets/textInput/TextInput";
import Select from "../../../../common/widgets/select/Select";
import Button from "../../../../common/widgets/button/Button";
import Card from "../../../../common/widgets/card/Card";
import { usePlotsStore } from "@olive-platform/core/features/plots/stores/UsePlotsStore";
import {
  getPlotHarvestStateOptions,
  type PlotHarvestState,
} from "@olive-platform/core/features/plots/domain/entities/PlotHarvestState";

export default function PlotsFilterComponent() {
  const { filters, loading, setFilter, clearFilters, fetchPlots } =
    usePlotsStore();

  const handleSearch = async () => {
    setFilter("pageNumber", 1);
    await fetchPlots();
  };

  const handleReset = async () => {
    clearFilters();
    await fetchPlots();
  };

  return (
    <Card>
      <div className="filters">
        <div className="filters-header">
          <div>
            <h3 className="filter-title">Filtres de recherche</h3>
            <span className="filter-subtitle">Rechercher une parcelle</span>
          </div>
        </div>

        <div className="filters-content filters-content-row">
          <div className="filter-item">
            <TextInput
              label="Référence"
              placeholder="PLOT-001"
              value={filters.reference ?? ""}
              onChange={(event) => setFilter("reference", event.target.value)}
            />
          </div>

          <div className="filter-item">
            <TextInput
              label="Nom de la parcelle"
              placeholder="Lahmeda"
              value={filters.name ?? ""}
              onChange={(event) => setFilter("name", event.target.value)}
            />
          </div>

          <div className="filter-item">
            <Select
              label="État de récolte (campagne)"
              placeholder="Toutes"
              options={getPlotHarvestStateOptions().map((option) => ({
                value: String(option.value),
                label: option.label,
              }))}
              value={filters.harvestState ? String(filters.harvestState) : ""}
              onChange={(event) =>
                setFilter(
                  "harvestState",
                  event.target.value
                    ? (Number(event.target.value) as PlotHarvestState)
                    : null,
                )
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
