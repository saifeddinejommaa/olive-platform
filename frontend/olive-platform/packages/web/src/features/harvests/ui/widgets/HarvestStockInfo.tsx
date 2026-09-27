import InfoFieldWidget from "../../../../common/widgets/InfoFieldWidget";
import { renderStatus } from "../../../../common/status/StatusUtils";
import { harvestStockStatusConfig } from "../../../../common/status/HarvestStockStatusConfig";

import type { HarvestStockDetails } from "@olive-platform/core/features/harvests/domain/entities/HarvestStockDetails";

type Props = {
  stock: HarvestStockDetails;
};

const formatKg = (value: number) =>
  `${value.toLocaleString("fr-FR")} kg`;

const formatDateTime = (value: string) =>
  new Date(value).toLocaleString("fr-FR");

// Même grille que les formulaires (Informations générales).
export default function HarvestStockInfo({ stock }: Props) {
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

      <div className="filter-item">
        <span className="filter-item-label">Statut</span>
        {renderStatus(stock.status, harvestStockStatusConfig)}
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
