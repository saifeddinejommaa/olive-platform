import InfoFieldWidget from "../../../../common/widgets/InfoFieldWidget";
import type { OliveAnalysisDetails } from "@olive-platform/core/features/analyses/oliveAnalyses/domain/entities/OliveAnalysisDetails";
import { productionStatusConfig } from "../../../../common/status/ProductionStatusConfig";
import { formatStringToDateTime } from "@olive-platform/core/features/shared/utils/DatesUtils";
import { renderStatus } from "../../../../common/status/StatusUtils";

type Props = {
  analysis: OliveAnalysisDetails;
};

const formatPercentage = (value?: number | null) => {
  return value != null ? `${value.toLocaleString("fr-FR")} %` : "-";
};

export default function OliveAnalysisInfoWidget({ analysis }: Props) {
  return (
    <div className="analysis-block">
      <h4 className="analysis-title">Analyse</h4>

      {renderStatus(analysis.status, productionStatusConfig)}

      <div className="info-grid">
        <InfoFieldWidget label="Référence" value={analysis.reference} />
        <InfoFieldWidget
          label="Taux d'humidité"
          value={formatPercentage(analysis.humidityPercentage)}
        />
        <InfoFieldWidget
          label="Taux d'eau"
          value={formatPercentage(analysis.waterPercentage)}
        />
        <InfoFieldWidget
          label="Taux d'huile"
          value={formatPercentage(analysis.oilPercentage)}
        />
        <InfoFieldWidget
          label="Taux d'acidité"
          value={formatPercentage(analysis.acidityPercentage)}
        />
        <InfoFieldWidget
          label="Date d'analyse"
          value={formatStringToDateTime(analysis.analysisDate)}
        />
      </div>
    </div>
  );
}