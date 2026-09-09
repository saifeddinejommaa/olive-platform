import InfoFieldWidget from "../../../../common/widgets/InfoFieldWidget";
import type { OliveAnalysisDetails } from "../../../analyses/oliveAnalyses/domain/entities/OliveAnalysisDetails";
import { productionStatusConfig } from "../../../shared/status/ProductionStatusConfig";
import { formatStringToDateTime } from "../../../shared/utils/DatesUtils";
import { renderStatus } from "../../../shared/utils/StatusUtils";

type Props = {
  analysis: OliveAnalysisDetails;
};

const formatPercentage = (value?: number | null) => {
  return value != null ? `${value.toLocaleString("fr-FR")} %` : "-";
};

export default function OliveAnalysisInfoWidget({ analysis }: Props) {
  return (
    <div>
      <h4 style={{ marginBottom: "12px" }}>Analyse {renderStatus(analysis.status, productionStatusConfig)}  </h4>

      <div className="filters-content">
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
