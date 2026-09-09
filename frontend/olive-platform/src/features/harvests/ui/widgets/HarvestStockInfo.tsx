import InfoFieldWidget from "../../../../common/widgets/InfoFieldWidget";

import type { HarvestStockDetails } from "../../domain/entities/HarvestStockDetails";

type Props = {
  stock: HarvestStockDetails;
};

const formatKg = (value: number) =>
  `${value.toLocaleString("fr-FR")} kg`;

export default function HarvestStockInfo({ stock }: Props) {
  return (
    <div className="filters-content">
      <InfoFieldWidget
        label="Référence"
        value={stock.reference}
      />

      <InfoFieldWidget
        label="Quantité"
        value={formatKg(stock.quantityKg)}
      />

      <InfoFieldWidget
        label="Statut"
        value={stock.status.toString()}
      />

      <InfoFieldWidget
        label="Créé le"
        value={new Date(stock.createdAt).toLocaleString("fr-FR")}
      />

      <InfoFieldWidget
        label="Modifié le"
        value={new Date(stock.updatedAt).toLocaleString("fr-FR")}
      />
    </div>
  );
}