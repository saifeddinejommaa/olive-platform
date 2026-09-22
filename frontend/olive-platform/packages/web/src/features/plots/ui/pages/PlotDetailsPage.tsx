// src/features/production/plots/presentation/pages/PlotDetailPage.tsx

import { useEffect } from "react";
import ProgressBar from "../../../../common/widgets/progressBar/ProgressBar";
import Card from "../../../../common/widgets/card/Card";

import { usePlotDetailStore } from "@olive-platform/core/features/plots/stores/UsePlotDetailStore";
import { formatStringToDateTime } from "@olive-platform/core/features/shared/utils/DatesUtils";
import PlotVarietyCardWidget from "../widgets/PlotVarietyCardWidget";
import { usePageTitle } from "../../../../common/hooks/usePageTitle";
import InfoFieldWidget from "../../../../common/widgets/InfoFieldWidget";
import { useParams } from "react-router-dom";

export default function PlotDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { plot, loading, error, fetchPlotDetail, reset } = usePlotDetailStore();

  const plotId = Number(id);

  usePageTitle(
    plot?.name,
    plot ? `Référence : ${plot.reference}` : "-",
  );

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

  if (loading) {
    return (
      <div className="feature-page">
        <h2 className="section-title">Informations générales</h2>
        <Card>
          <span>Chargement des informations de la parcelle...</span>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="feature-page">
        <h2 className="section-title">Informations générales</h2>
        <Card>
          <span>{error}</span>
        </Card>
      </div>
    );
  }

  if (!plot) {
    return null;
  }

  return (
    <div className="feature-page">
      <div>
        <h2 className="section-title">Suivi de récolte</h2>
        <p className="section-subtitle">Avancement global sur la parcelle</p>
      </div>
      <Card>
        <div className="progress-header">
          <span className="progress-label">Progression</span>
          <span className="progress-value">
            {plot.harvestedTreesPercentage.toFixed(0)}% récolté
            {plot.plannedTreesPercentage !== undefined &&
              ` · ${plot.plannedTreesPercentage.toFixed(0)}% planifié`}
          </span>
        </div>
        <ProgressBar
          value={plot.harvestedTreesPercentage}
          secondaryValue={plot.plannedTreesPercentage}
          showValue={false}
        />
      </Card>

      <h2 className="section-title">Informations générales</h2>
      <Card>
        <div className="info-grid">
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
            <div style={{ gridColumn: "1 / -1" }}>
              <InfoFieldWidget label="Notes" value={plot.notes} />
            </div>
          )}
        </div>
      </Card>

      <h2 className="section-title">Variétés</h2>
      <div className="variety-list">
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
  );
}