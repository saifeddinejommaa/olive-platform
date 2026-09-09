import { useEffect } from "react";

import CollapsibleCard from "../../../../common/widgets/collapsibleCard/CollapsibleCard";

import { useHarvestStocksStore } from "../stores/HarvestStocksStore";
import { useHarvestOliveAnalysisStore } from "../stores/HarvestOliveAnalysisStore";

import HarvestStockInfo from "../widgets/HarvestStockInfo";
import OliveAnalysisInfoWidget from "../../../olivePurchases/ui/widgets/OliveAnalysisInfoWidget";

type Props = {
    harvestId: number;
};

export default function HarvestStocksTab({ harvestId }: Props) {
    const {
        stocks,
        loading: stocksLoading,
        error: stocksError,
        fetchStocksList,
    } = useHarvestStocksStore();

    const {
        analysis,
        loading: analysisLoading,
        error: analysisError,
        fetchAnalysis,
    } = useHarvestOliveAnalysisStore();

    useEffect(() => {
        fetchStocksList(harvestId);
    }, [harvestId, fetchStocksList]);

    useEffect(() => {
        if (stocks.length > 0) {
            fetchAnalysis(harvestId);
        }
    }, [harvestId, stocks.length, fetchAnalysis]);

    const hasStocks = stocks.length > 0;

    return (
        <>
            <div className="filters">
                <div className="filters-header">
                    <div>
                        <h3>Stocks</h3>

                        <span>
                            Détail des stocks issus de cette récolte
                        </span>
                    </div>
                </div>

                <div className="filters-content">
                    {stocksLoading && (
                        <div
                            className="filter-item"
                            style={{ gridColumn: "1 / -1" }}
                        >
                            <span className="filter-item-value">
                                Chargement des stocks...
                            </span>
                        </div>
                    )}

                    {!stocksLoading && stocksError && (
                        <div
                            className="filter-item"
                            style={{ gridColumn: "1 / -1" }}
                        >
                            <span className="filter-item-label">
                                Erreur
                            </span>

                            <span className="filter-item-value">
                                {stocksError}
                            </span>
                        </div>
                    )}

                    {!stocksLoading &&
                        !stocksError &&
                        stocks.map((stock) => (
                            <CollapsibleCard
                                key={stock.id}
                                title={stock.reference}
                            >
                                <HarvestStockInfo stock={stock} />
                            </CollapsibleCard>
                        ))}

                    {!stocksLoading &&
                        !stocksError &&
                        !hasStocks && (
                            <div
                                className="filter-item"
                                style={{ gridColumn: "1 / -1" }}
                            >
                                <span className="filter-item-value">
                                    Aucun stock pour cette récolte.
                                </span>
                            </div>
                        )}
                </div>
            </div>

            {!stocksLoading && !stocksError && hasStocks && (
                <div
                    className="filters"
                    style={{ marginTop: "20px" }}
                >
                    <div className="filters-header">
                        <div>
                            <h3>Analyse des olives</h3>

                            <span>
                                Résultats de l'analyse portant sur
                                l'ensemble du stock de la récolte
                            </span>
                        </div>
                    </div>

                    {analysisLoading && (
                        <div className="filter-item">
                            <span className="filter-item-value">
                                Chargement de l'analyse...
                            </span>
                        </div>
                    )}

                    {!analysisLoading && analysisError && (
                        <div className="filter-item">
                            <span className="filter-item-label">
                                Erreur
                            </span>

                            <span className="filter-item-value">
                                {analysisError}
                            </span>
                        </div>
                    )}

                    {!analysisLoading &&
                        !analysisError &&
                        analysis && (
                            <OliveAnalysisInfoWidget
                                analysis={analysis}
                            />
                        )}

                    {!analysisLoading &&
                        !analysisError &&
                        !analysis && (
                            <div className="filter-item">
                                <span className="filter-item-value">
                                    Aucune analyse disponible pour cette
                                    récolte.
                                </span>
                            </div>
                        )}
                </div>
            )}
        </>
    );
}