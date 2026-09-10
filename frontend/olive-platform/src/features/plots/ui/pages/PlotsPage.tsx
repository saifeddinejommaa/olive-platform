// src/features/production/plots/presentation/pages/PlotsPage.tsx

import { useEffect } from "react";
import DataTable from "../../../../common/widgets/tables/OrdersTable";
import Button from "../../../../common/widgets/button/Button";
import TextInput from "../../../../common/widgets/textInput/TextInput";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import type { PlotsRequestFilter } from "../../domain/entities/PlotsRequestFilter";
import { usePlotsStore } from "../stores/UsePlotsStore";
import type { PlotForList } from "../../domain/entities/PlotForList";
import ProgressBar from "../../../../common/widgets/progressBar/ProgressBar";

export default function PlotsPage() {
    const navigate = useNavigate();

    const { fetchPlots, error, setFilter, Plots, filters, loading } = usePlotsStore();

    useEffect(() => {
        fetchPlots();
    }, []);

    const updateFilter = (field: keyof PlotsRequestFilter, value: string) => {
        setFilter(field, value);
    };

    const handleSearch = async () => {
        await fetchPlots();
    };

    const handleReset = async () => {
        setFilter("reference", "");
        setFilter("name", "");
        setFilter("pageNumber", 1);
        await fetchPlots();
    };

    const handlePageChange = async (pageNumber: number) => {
        setFilter("pageNumber", pageNumber);
        await fetchPlots();
    };

    const handleOpenDetails = (id: number) => {
        navigate(`/plots/plot-details/${id}`);
    };

    const handleLaunchHarvest = (id: number) => {
        navigate(`/production/plots/${id}/launch-harvest`);
    };

    const columns = [
        {
            key: "reference" as keyof PlotForList,
            label: "Référence",
        },
        {
            key: "name" as keyof PlotForList,
            label: "Nom",
        },
        {
            key: "numberOfTrees" as keyof PlotForList,
            label: "Nbr Totale",
        },
        {
            key: "harvestedTreesPercentage" as keyof PlotForList,
            label: "% Récolté",
            render: (item: PlotForList) => (
                <ProgressBar value={item.harvestedTreesPercentage}
                    secondaryValue={item.plannedTreesPercentage}
                    showValue />
            ),
        },
        {
            key: "id" as keyof PlotForList,
            label: "Actions",
            render: (item: PlotForList) => (
                <div style={{ display: "flex", gap: "4px" }}>
                    <button
                        type="button"
                        title="Modifier la parcelle"
                        aria-label="Modifier la parcelle"
                        onClick={() => handleOpenDetails(item.id)}
                        style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            padding: "6px",
                        }}
                    >
                        <EditIcon fontSize="small" sx={{ color: "var(--color-olive-900)" }} />
                    </button>
                    {item.canLaunchHarvest && (
                        <button
                            type="button"
                            title="Lancer la pression"
                            aria-label="Lancer la pression"
                            onClick={() => { }}
                            style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                padding: "6px",
                            }}
                        >
                            <PlayArrowIcon
                                fontSize="small"
                                sx={{
                                    color: "var(--color-olive-900)",
                                }}
                            />
                        </button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="feature-page">
            <div className="page-header">
                <div className="page-header-content">
                    <p className="page-description">
                        Gestion des parcelles et suivi de l'avancement des récoltes.
                    </p>
                </div>
            </div>

            <div className="filters">
                <div className="filters-header">
                    <div>
                        <h3>Filtres de recherche</h3>
                        <span>Rechercher une parcelle</span>
                    </div>
                </div>

                <div className="filters-content">
                    <div className="filter-item">
                        <TextInput
                            label="Référence"
                            placeholder="PLOT-2026-001"
                            value={filters.reference}
                            onChange={(event) => updateFilter("reference", event.target.value)}
                        />
                    </div>

                    <div className="filter-item">
                        <TextInput
                            label="Nom"
                            placeholder="Parcelle Nord"
                            value={filters.name}
                            onChange={(event) => updateFilter("name", event.target.value)}
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

            <DataTable
                data={Plots?.items ?? []}
                columns={columns}
                pageNumber={Plots?.pageNumber ?? 1}
                pageSize={Plots?.pageSize ?? 10}
                totalCount={Plots?.totalCount ?? 0}
                onPageChange={handlePageChange}
            />
        </div>
    );
}