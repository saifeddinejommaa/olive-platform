import InfoFieldWidget from "../../../../common/widgets/InfoFieldWidget";
import { getOliveVarietyLabel } from "../../../appConstants/helper/AppConstantsHelper";
import type { OlivePurchaseItemDetails } from "../../domain/entities/OlivePurchaseItemDetails";

type Props = {
  item: OlivePurchaseItemDetails;
};

const formatKg = (value: number) => `${value.toLocaleString("fr-FR")} kg`;
const formatPrice = (value: number) => `${value.toLocaleString("fr-FR")} DT`;

export default function OlivePurchaseItemInfo({ item }: Props) {
  return (
    <div className="filters-content">
      <InfoFieldWidget label="Référence" value={item.reference} />
      <InfoFieldWidget
        label="Variété"
        value={getOliveVarietyLabel(item.variety)}
      />
      <InfoFieldWidget
        label="Qté convenue"
        value={formatKg(item.agreedQuantityKg)}
      />
      <InfoFieldWidget label="Prix / kg" value={formatPrice(item.pricePerKg)} />
      <InfoFieldWidget
        label="Montant total"
        value={item.totalAmount !== null ? formatPrice(item.totalAmount) : "-"}
      />
      <InfoFieldWidget label="Notes" value={item.notes ?? "-"} fullWidth />
    </div>
  );
}
