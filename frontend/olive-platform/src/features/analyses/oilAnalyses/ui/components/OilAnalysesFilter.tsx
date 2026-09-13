

import Button from "../../../../../common/widgets/button/Button";
import Card from "../../../../../common/widgets/card/Card";
import ProductionStatusSelector from "../../../../../common/widgets/ProductionStatusSelector";
import TextInput from "../../../../../common/widgets/textInput/TextInput";
import type { ProductionStatus } from "../../../../production/domain/entities/ProductionStatus";
import { useOilAnalysesListStore } from "../stores/UseAnalysesListStore";

export default function OilAnalysesFilter() {
    const {
        filters,
        loading,
        setFilters,
        fetchList,
        clear,
    } = useOilAnalysesListStore();

    const handleSearch = async () => {
        await fetchList();
    };

    const handleReset = async () => {
        clear();
        await fetchList();
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
                            Rechercher une analyse d'huile
                        </span>
                    </div>
                </div>

                <div className="filters-content filters-content-row">
                    <div className="filter-item">
                        <TextInput
                            label="Référence"
                            placeholder="ANA-HUILE-2026-001"
                            value={filters.reference}
                            onChange={(event) =>
                                setFilters({
                                    reference: event.target.value,
                                })
                            }
                        />
                    </div>

                    <div className="filter-item">
                        <TextInput
                            label="Date d'analyse"
                            type="date"
                            value={filters.analysisDate}
                            onChange={(event) =>
                                setFilters({
                                    analysisDate: event.target.value,
                                })
                            }
                        />
                    </div>

                    <div className="filter-item">
                        <ProductionStatusSelector label="Statut" value={filters.status} onChange={(event) =>
                            setFilters({
                                status: event as ProductionStatus
                            })

                        }></ProductionStatusSelector>
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