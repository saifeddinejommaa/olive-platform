import TextInput from "../../../../../common/widgets/textInput/TextInput";
import Button from "../../../../../common/widgets/button/Button";
import Card from "../../../../../common/widgets/card/Card";
import { useOliveAnalysesStore } from "@olive-platform/core/features/analyses/oliveAnalyses/store/OliveAnalysesStore";
import ProductionStatusSelector from "../../../../../common/widgets/ProductionStatusSelector";
import type { ProductionStatus } from "@olive-platform/core/features/production/domain/entities/ProductionStatus";

export default function OliveAnalysesFilterComponent() {
  const {
    filter,
    loading,
    setParams,
    fetchAnalyses,
    clear,
  } = useOliveAnalysesStore();

  const handleSearch = async () => {
    await fetchAnalyses({
      pageNumber: 1,
    });
  };

  const handleReset = async () => {
    clear();

    await fetchAnalyses({
      pageNumber: 1,
      pageSize: 10,
    });
  };

  return (
    <Card>
      <div className="filters">
        <div className="filters-header">
          <div>
            <h3 className="filter-title">Filtres de recherche</h3>
            <span className="filter-subtitle">
              Rechercher une analyse d'olive
            </span>
          </div>
        </div>

        <div className="filters-content filters-content-row">
          <div className="filter-item">
            <TextInput
              label="Référence"
              placeholder="ANA-2026-001"
              value={filter.reference ?? ""}
              onChange={(event) =>
                setParams({
                  reference: event.target.value,
                })
              }
            />
          </div>

          <div className="filter-item">
            <TextInput
              label="Ref de la Récolte"
              placeholder="Ref de la Récolte"
              min="1"
              value={
                filter.harvestReference !== null &&
                filter.harvestReference !== undefined
                  ? String(filter.harvestReference)
                  : ""
              }
              onChange={(event) =>
                setParams({
                  harvestReference: event.target.value
                })
              }
            />
          </div>

          <div className="filter-item">
            <TextInput
              label="Ref de la Parcelle"
              placeholder="Ref de la Parcelle"
              min="1"
              value={
                filter.plotReference !== null &&
                filter.plotReference !== undefined
                  ? String(filter.plotReference)
                  : ""
              }
              onChange={(event) =>
                setParams({
                  plotReference: event.target.value
                })
              }
            />
          </div>

          <div className="filter-item">
            <ProductionStatusSelector
              label="Statut"
              value={filter.status}
              onChange={(event) =>
                setParams({
                  status: event as ProductionStatus,
                })
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