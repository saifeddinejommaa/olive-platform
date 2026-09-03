import { useEffect, useState } from "react";
import TextEditor from "../../../../common/widgets/textEditor/TextEditor";
import type { OlivePurchaseDetails } from "../../domain/entities/OlivePurchaseDetails";
import InfoFieldWidget from "../../../../common/widgets/InfoFieldWidget";

type Props = {
  purchase: OlivePurchaseDetails;
};

const formatDate = (value: string) => {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("fr-FR");
};

const formatDateTime = (value?: string) => {
  if (!value) return "-";
  return new Date(value).toLocaleString("fr-FR");
};

export default function OlivePurchaseGeneralTab({ purchase }: Props) {
  const [notes, setNotes] = useState(purchase.notes ?? "");

  useEffect(() => {
    setNotes(purchase.notes ?? "");
  }, [purchase]);

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
        <InfoFieldWidget label="Date d'achat" value={formatDate(purchase.purchaseDate)} />
        <InfoFieldWidget label="Créé le" value={formatDateTime(purchase.createdAt)} />
        <InfoFieldWidget label="Modifié le" value={formatDateTime(purchase.updatedAt)} />

        <div className="filter-item" style={{ gridColumn: "1 / -1" }}>
          <span className="filter-item-label">Notes</span>
          <TextEditor
            value={notes}
            placeholder="Notes concernant l'achat..."
            onChange={setNotes}
          />
        </div>
      </div>
    </div>
  );
}
