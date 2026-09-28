import InfoFieldWidget from "../../../../common/widgets/InfoFieldWidget";
import Button from "../../../../common/widgets/button/Button";
import { renderStatus } from "../../../../common/status/StatusUtils";
import { harvestStockStatusConfig } from "../../../../common/status/HarvestStockStatusConfig";

import type { HarvestStockDetails } from "@olive-platform/core/features/harvests/domain/entities/HarvestStockDetails";

type Props = {
  stock: HarvestStockDetails;
  // « Passer sans analyse » (affiché si l'analyse est requise et non terminée).
  onSkipAnalysis?: (stockId: number) => void;
  skipping?: boolean;
};

const formatKg = (value: number) =>
  `${value.toLocaleString("fr-FR")} kg`;

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString("fr-FR");

const analysisLabel = (stock: HarvestStockDetails) =>
  stock.isAnalyzed
    ? "Terminée"
    : stock.toAnalysis
      ? "En attente d'analyse"
      : "Non requise";

// Même grille que les formulaires (Informations générales).
export default function HarvestStockInfo({ stock, onSkipAnalysis, skipping }: Props) {
  return (
    <div className="info-grid harvest-stock-grid">
      <InfoFieldWidget
        label="Référence"
        value={stock.reference}
      />

      <InfoFieldWidget
        label="Quantité"
        value={formatKg(stock.quantityKg)}
      />

      <InfoFieldWidget
        label="Restant"
        value={formatKg(stock.remainingKg)}
      />

      <div className="filter-item">
        <span className="filter-item-label">Statut</span>
        {renderStatus(stock.status, harvestStockStatusConfig)}
      </div>

      <div className="filter-item">
        <span className="filter-item-label">Analyse</span>
        <span className="filter-item-value">{analysisLabel(stock)}</span>

        {stock.toAnalysis && onSkipAnalysis && (
          <div style={{ marginTop: "6px" }}>
            <Button
              variant="secondary"
              size="sm"
              disabled={skipping}
              onClick={() => onSkipAnalysis(stock.id)}
            >
              {skipping ? "..." : "Passer sans analyse"}
            </Button>
          </div>
        )}
      </div>

      <InfoFieldWidget
        label="Créé le"
        value={formatDateTime(stock.createdAt)}
      />

      <InfoFieldWidget
        label="Modifié le"
        value={formatDateTime(stock.updatedAt)}
      />
    </div>
  );
}
