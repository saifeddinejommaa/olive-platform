import TextInput from "../../../../common/widgets/textInput/TextInput";
import Select from "../../../../common/widgets/select/Select";
import Button from "../../../../common/widgets/button/Button";
import Card from "../../../../common/widgets/card/Card";
import { useOliveLotsStore } from "@olive-platform/core/features/oliveLots/stores/OliveLotsStore";
import { oliveLotPressStatusConfig } from "../../../../common/status/OliveLotPressStatusConfig";

const sourceOptions = [
  { value: "1", label: "Récolte" },
  { value: "2", label: "Achat" },
];

// États proposés au filtre (hors « Clôturé », non utilisé).
const statusOptions = [1, 2, 3, 4].map((status) => ({
  value: String(status),
  label: oliveLotPressStatusConfig[status as 1 | 2 | 3 | 4].label,
}));

export default function OliveLotsFilterComponent() {
  const { filter, loading, setFilter, clearFilter, fetchLots } =
    useOliveLotsStore();

  const handleReset = async () => {
    clearFilter();
    await fetchLots();
  };

  return (
    <Card>
      <div className="filters">
        <div className="filters-header">
          <div>
            <h3 className="filter-title">Filtres de recherche</h3>
            <span className="filter-subtitle">Rechercher un lot d'olives</span>
          </div>
        </div>

        <div className="filters-content filters-content-row">
          <div className="filter-item">
            <TextInput
              label="Référence"
              placeholder="Lot, récolte ou achat"
              value={filter.search}
              onChange={(event) => setFilter("search", event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") fetchLots();
              }}
            />
          </div>

          <div className="filter-item">
            <Select
              label="Source"
              placeholder="Toutes"
              options={sourceOptions}
              value={filter.sourceType ? String(filter.sourceType) : ""}
              onChange={(event) =>
                setFilter(
                  "sourceType",
                  event.target.value ? Number(event.target.value) : undefined,
                )
              }
            />
          </div>

          <div className="filter-item">
            <Select
              label="État"
              placeholder="Tous"
              options={statusOptions}
              value={filter.status ? String(filter.status) : ""}
              onChange={(event) =>
                setFilter(
                  "status",
                  event.target.value ? Number(event.target.value) : undefined,
                )
              }
            />
          </div>
        </div>

        <div className="filters-footer">
          <Button variant="secondary" onClick={handleReset} disabled={loading}>
            Réinitialiser
          </Button>
          <Button variant="primary" onClick={fetchLots} disabled={loading}>
            {loading ? "Recherche..." : "Rechercher"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
