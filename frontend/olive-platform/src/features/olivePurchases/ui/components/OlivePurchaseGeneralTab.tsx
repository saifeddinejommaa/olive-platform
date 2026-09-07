import TextEditor from "../../../../common/widgets/textEditor/TextEditor";
import InfoFieldWidget from "../../../../common/widgets/InfoFieldWidget";
import type { OlivePurchaseDetails } from "../../domain/entities/OlivePurchaseDetails";
import {
  formatDate,
  formatStringToDateTime,
} from "../../../shared/utils/DatesUtils";

type Props = {
  purchase: OlivePurchaseDetails;
  onNotesChange: (notes: string) => void;
};

export default function OlivePurchaseGeneralTab({
  purchase,
  onNotesChange,
}: Props) {
  return (
    <div className="filters">
      <div className="filters-header">
        <div>
          <h3>Informations générales</h3>
          <span>Informations relatives à l'achat d'olives</span>
        </div>
      </div>

      <div className="filters-content">
        <InfoFieldWidget label="Référence" value={purchase.reference} />
        <InfoFieldWidget label="Fournisseur" value={purchase.supplierName} />
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

        <div className="filter-item" style={{ gridColumn: "1 / -1" }}>
          <span className="filter-item-label">Notes</span>
          <TextEditor
            value={purchase.notes ?? ""}
            placeholder="Notes concernant l'achat..."
            onChange={onNotesChange}
          />
        </div>
      </div>
    </div>
  );
}
