import TextInput from "../../../../common/widgets/textInput/TextInput";
import Button from "../../../../common/widgets/button/Button";
import type { PlotsRequestFilter } from "../../domain/entities/PlotsRequestFilter";
import Card from "../../../../common/widgets/card/Card";

type Props = {
  filters: PlotsRequestFilter;
  loading: boolean;
  onFilterChange: (field: keyof PlotsRequestFilter, value: string) => void;
  onSearch: () => void;
  onReset: () => void;
};

export default function PlotsFilterComponent({
  filters,
  loading,
  onFilterChange,
  onSearch,
  onReset,
}: Props) {
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
            placeholder="PLOT-2026-001"
            value={filters.reference}
            onChange={(event) => onFilterChange("reference", event.target.value)}
          />
        </div>

        <div className="filter-item">
          <TextInput
            label="Nom"
            placeholder="Parcelle Nord"
            value={filters.name}
            onChange={(event) => onFilterChange("name", event.target.value)}
          />
        </div>
      </div>

      <div className="filters-footer">
        <Button variant="secondary" onClick={onReset}>
          Réinitialiser
        </Button>
        <Button variant="primary" onClick={onSearch}>
          {loading ? "Recherche..." : "Rechercher"}
        </Button>
      </div>
    </div>
    </Card>
  );
}