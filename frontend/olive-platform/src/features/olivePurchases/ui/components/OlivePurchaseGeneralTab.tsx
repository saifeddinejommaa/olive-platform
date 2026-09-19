import TextEditor from "../../../../common/widgets/textEditor/TextEditor";
import InfoFieldWidget from "../../../../common/widgets/InfoFieldWidget";
import type { OlivePurchaseDetails } from "../../domain/entities/OlivePurchaseDetails";
import {
  formatDate,
  formatStringToDateTime,
} from "../../../shared/utils/DatesUtils";
import Card from "../../../../common/widgets/card/Card";

type Props = {
  purchase: OlivePurchaseDetails;
  onNotesChange: (notes: string) => void;
};

export default function OlivePurchaseGeneralTab({
  purchase,
  onNotesChange,
}: Props) {
  return (
    <Card>
    <div className="info-grid">
      <InfoFieldWidget label="Fournisseur" 
      value={purchase.supplierDetails?purchase.supplierDetails?.name: "-"} />
      <InfoFieldWidget
        label="Quantité (kg)"
        value={purchase.totalQuantity?.toString()}
      />
      <InfoFieldWidget
        label="Prix total (en DT)"
        value={purchase.totalAmount?.toString()}
      />
      <InfoFieldWidget
        label="Date d'achat"
        value={formatDate(purchase.purchaseDate)}
      />
      <InfoFieldWidget
        label="Créé le"
        value={formatStringToDateTime(purchase.createdAt)}
      />
      <InfoFieldWidget
        label="Modifié le"
        value={formatStringToDateTime(purchase.updatedAt)}
      />

      <div style={{ gridColumn: "1 / -1" }}>
        <span className="filter-item-label">Notes</span>
        <TextEditor
          value={purchase.notes ?? ""}
          placeholder="Notes concernant l'achat..."
          onChange={onNotesChange}
        />
      </div>
    </div>
    </Card>
  );
}