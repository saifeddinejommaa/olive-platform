import InfoFieldWidget from "../../../../common/widgets/InfoFieldWidget";
import Button from "../../../../common/widgets/button/Button";
import { renderStatus } from "../../../../common/status/StatusUtils";
import { harvestStockStatusConfig } from "../../../../common/status/HarvestStockStatusConfig";
import { getOliveVarietyLabel } from "@olive-platform/core/features/appConstants/helper/AppConstantsHelper";
import type { OlivePurchaseItemDetails } from "@olive-platform/core/features/olivePurchases/domain/entities/OlivePurchaseItemDetails";
import type { HarvestStockStatus } from "@olive-platform/core/features/harvests/domain/entities/HarvestStockStatus";

type Props = {
  item: OlivePurchaseItemDetails;
  // « Passer sans analyse » (affiché si l'analyse est requise et non terminée).
  onSkipAnalysis?: (itemId: number) => void;
  skipping?: boolean;
};

const formatKg = (value: number) => `${value.toLocaleString("fr-FR")} kg`;
const formatPrice = (value: number) => `${value.toLocaleString("fr-FR")} DT`;

const analysisLabel = (item: OlivePurchaseItemDetails) =>
  item.isAnalyzed
    ? "Terminée"
    : item.toAnalysis
      ? "En attente d'analyse"
      : "Non requise";

export default function OlivePurchaseItemInfo({ item, onSkipAnalysis, skipping }: Props) {
  return (
    <div className="info-grid">
      <InfoFieldWidget label="Référence" value={item.reference} />
      <InfoFieldWidget
        label="Variété"
        value={getOliveVarietyLabel(item.variety)}
      />
      <InfoFieldWidget
        label="Qté convenue"
        value={formatKg(item.agreedQuantityKg)}
      />
      <InfoFieldWidget
        label="Restant"
        value={formatKg(item.remainingQuantityKg)}
      />
      <div className="filter-item">
        <span className="filter-item-label">Statut</span>
        {renderStatus(item.status as HarvestStockStatus, harvestStockStatusConfig)}
      </div>
      <div className="filter-item">
        <span className="filter-item-label">Analyse</span>
        <span className="filter-item-value">{analysisLabel(item)}</span>

        {item.toAnalysis && onSkipAnalysis && (
          <div style={{ marginTop: "6px" }}>
            <Button
              variant="secondary"
              size="sm"
              disabled={skipping}
              onClick={() => onSkipAnalysis(item.id)}
            >
              {skipping ? "..." : "Passer sans analyse"}
            </Button>
          </div>
        )}
      </div>
      <InfoFieldWidget label="Prix / kg" value={formatPrice(item.pricePerKg)} />
      <InfoFieldWidget
        label="Montant total"
        value={item.totalAmount !== null ? formatPrice(item.totalAmount) : "-"}
      />
      <InfoFieldWidget label="Notes" value={item.notes ?? "-"} fullWidth />
    </div>
  );
}
