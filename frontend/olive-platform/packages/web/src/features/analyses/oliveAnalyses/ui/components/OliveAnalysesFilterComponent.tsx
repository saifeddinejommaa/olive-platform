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
              placeholder="OLIV_ANALYSE-2026-001"
              value={filter.reference ?? ""}
              onChange={(event) =>
                setParams({ reference: event.target.value })
              }
            />
          </div>

          <div className="filter-item">
            <TextInput
              label="Réf. récolte"
              placeholder="HARV-2026-001"
              value={filter.harvestReference ?? ""}
              onChange={(event) =>
                setParams({ harvestReference: event.target.value })
              }
            />
          </div>

          <div className="filter-item">
            <TextInput
              label="Réf. achat"
              placeholder="Réf. de l'achat"
              value={filter.purchaseReference ?? ""}
              onChange={(event) =>
                setParams({ purchaseReference: event.target.value })
              }
            />
          </div>

          <div className="filter-item">
            <TextInput
              label="Début à partir du"
              type="date"
              value={filter.fromDate ?? ""}
              onChange={(event) =>
                setParams({ fromDate: event.target.value })
              }
            />
          </div>

          <div className="filter-item">
            <TextInput
              label="Fin jusqu'au"
              type="date"
              value={filter.toDate ?? ""}
              onChange={(event) =>
                setParams({ toDate: event.target.value })
              }
            />
          </div>

          <div className="filter-item">
            <ProductionStatusSelector
              label="Statut"
              value={filter.status ?? null}
              onChange={(value) =>
                setParams({ status: value as ProductionStatus | null })
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
