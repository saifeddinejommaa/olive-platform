// src/features/production/oliveAnalyses/presentation/components/OliveAnalysesFilters.tsx

import TextInput from "../../../../../common/widgets/textInput/TextInput";
import Select from "../../../../../common/widgets/select/Select";
import Button from "../../../../../common/widgets/button/Button";
import type { OliveAnalysesFilters as OliveAnalysesFiltersType } from "../../domain/entities/OliveAnalysesFilter";

type Props = {
  filter: OliveAnalysesFiltersType;
  loading: boolean;
  onFilterChange: (
    field: keyof OliveAnalysesFiltersType,
    value: string | number | null,
  ) => void;
  onSearch: () => void;
  onReset: () => void;
};

export default function OliveAnalysesFilterComponent({
  filter,
  loading,
  onFilterChange,
  onSearch,
  onReset,
}: Props) {
  return (
    <div className="filters">
      <div className="filters-header">
        <div>
          <h3>Filtres de recherche</h3>
          <span>Rechercher une analyse d'olive</span>
        </div>
      </div>

      <div className="filters-content">
        <div className="filter-item">
          <TextInput
            label="Référence"
            placeholder="ANA-2026-001"
            value={filter.reference ?? ""}
            onChange={(event) => onFilterChange("reference", event.target.value)}
          />
        </div>

        <div className="filter-item">
          <TextInput
            label="Ref de la Récolte:"
            placeholder="Ref de la Récolte"
            type="number"
            min="1"
            value={
              filter.harvestReference !== null && filter.harvestReference !== undefined
                ? String(filter.harvestReference)
                : ""
            }
            onChange={(event) =>
              onFilterChange(
                "harvestReference",
                event.target.value ? Number(event.target.value) : null,
              )
            }
          />
        </div>

        <div className="filter-item">
          <TextInput
            label="Ref de la Parcelle"
            placeholder="Ref de la Parcelle"
            type="number"
            min="1"
            value={
              filter.plotReference !== null && filter.plotReference !== undefined
                ? String(filter.plotReference)
                : ""
            }
            onChange={(event) =>
              onFilterChange(
                "plotReference",
                event.target.value ? Number(event.target.value) : null,
              )
            }
          />
        </div>

        <div className="filter-item">
          <Select
            label="Statut"
            value={filter.status ?? ""}
            onChange={(event) => onFilterChange("status", event.target.value)}
            options={[
              { value: "", label: "Tous les statuts" },
              { value: "Planned", label: "Planifiée" },
              { value: "InProgress", label: "En cours" },
              { value: "Completed", label: "Clôturée" },
              { value: "Cancelled", label: "Annulée" },
            ]}
          />
        </div>
      </div>

      <div className="filters-footer">
        <Button variant="secondary" onClick={onReset} disabled={loading}>
          Réinitialiser
        </Button>

        <Button variant="primary" onClick={onSearch} disabled={loading}>
          {loading ? "Recherche..." : "Rechercher"}
        </Button>
      </div>
    </div>
  );
}