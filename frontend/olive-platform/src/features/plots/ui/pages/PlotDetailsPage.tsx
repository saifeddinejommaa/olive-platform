// src/features/production/plots/presentation/pages/PlotDetailPage.tsx

import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Button from "../../../../common/widgets/button/Button";
import InfoFieldWidget from "../../../../common/widgets/InfoFieldWidget";
import ProgressBar from "../../../../common/widgets/progressBar/ProgressBar";

import { usePlotDetailStore } from "../stores/UsePlotDetailStore";
import { formatStringToDateTime } from "../../../shared/utils/DatesUtils";
import PlotVarietyCardWidget from "../widgets/PlotVarietyCardWidget";

export default function PlotDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { plot, loading, error, fetchPlotDetail, reset } = usePlotDetailStore();

    const plotId = Number(id);

    useEffect(() => {
        if (!id) {
            return;
        }

        fetchPlotDetail(plotId);
    }, [id, plotId, fetchPlotDetail]);

    useEffect(() => {
        return () => {
            reset();
        };
    }, [reset]);

    const handleLaunchHarvest = () => {
        if (plot) {
            navigate(`/production/plots/${plot.id}/launch-harvest`);
        }
    };

    if (loading) {
        return (
            <div className="filters">
                <div className="filters-header">
                    <div>
                        <h3>Informations générales</h3>
                        <span>Informations relatives à la parcelle</span>
                    </div>
                </div>

                <div className="filters-content">
                    <div className="filter-item" style={{ gridColumn: "1 / -1" }}>
                        <span className="filter-item-label">Chargement</span>
                        <span>Chargement des informations de la parcelle...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="filters">
                <div className="filters-header">
                    <div>
                        <h3>Informations générales</h3>
                        <span>Informations relatives à la parcelle</span>
                    </div>
                </div>

                <div className="filters-content">
                    <div className="filter-item" style={{ gridColumn: "1 / -1" }}>
                        <span className="filter-item-label">Erreur</span>
                        <span>{error}</span>
                    </div>
                </div>
            </div>
        );
    }

    if (!plot) {
        return null;
    }

    return (
        <div className="feature-page">
            <div className="page-header">
                <div className="page-header-content">
                    <h1 className="page-title">{plot.name}</h1>
                    <span>Référence : {plot.reference}</span>
                </div>

                {plot.canLaunchHarvest && (
                    <Button variant="primary" onClick={handleLaunchHarvest}>
                        Lancer la récolte
                    </Button>
                )}
            </div>

            <div className="filters">
                <div className="filters-header">
                    <div>
                        <h3>Suivi de récolte</h3>
                        <span>Avancement global de la récolte sur la parcelle</span>
                    </div>
                </div>

                <div className="filters-content">
                    <div className="filter-item" style={{ gridColumn: "1 / -1" }}>
                        <ProgressBar value={plot.harvestedTreesPercentage} showValue />
                    </div>
                </div>
            </div>

            <div className="filters">
                <div className="filters-header">
                    <div>
                        <h3>Informations générales</h3>
                        <span>Informations relatives à la parcelle</span>
                    </div>
                </div>

                <div className="filters-content">
                    <InfoFieldWidget label="Localisation" value={plot.location ?? "-"} />

                    <InfoFieldWidget
                        label="Superficie"
                        value={plot.areaHectares !== null ? `${plot.areaHectares} ha` : "-"}
                    />

                    <InfoFieldWidget
                        label="Année de plantation"
                        value={plot.plantingYear ? plot.plantingYear.toString() : "-"}
                    />

                    <InfoFieldWidget
                        label="Nombre d'arbres"
                        value={plot.numberOfTrees.toLocaleString("fr-FR")}
                    />

                    <InfoFieldWidget
                        label="Créée le"
                        value={formatStringToDateTime(plot.createdAt)}
                    />

                    {plot.notes && (
                        <div className="filter-item" style={{ gridColumn: "1 / -1" }}>
                            <span className="filter-item-label">Notes</span>
                            <span>{plot.notes}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="filters">
                <div className="filters-header">
                    <div>
                        <h3>Variétés</h3>
                        <span>Répartition et avancement de récolte par variété</span>
                    </div>
                </div>
                <div className="filters-content">
                    {plot.varieties.map((variety) => (
                        <PlotVarietyCardWidget
                            key={variety.varietyId}
                            plotId={plot.id}
                            variety={variety}
                            onHarvestLaunched={() => fetchPlotDetail(plotId)}
                        />
                    ))}
                </div>
            </div>

            <div className="filters-footer">
                <Button variant="secondary" onClick={() => navigate("/production/plots")}>
                    Retour
                </Button>
            </div>
        </div>
    );
}