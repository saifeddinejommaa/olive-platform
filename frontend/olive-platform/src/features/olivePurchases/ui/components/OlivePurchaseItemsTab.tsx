import { useEffect } from "react";
import OlivePurchaseItemCardWidget from "../widgets/OlivePurchaseItemCardWidget";
import { useOlivePurchaseItemsStore } from "../stores/OlivePurchaseItemsStore";

type Props = {
  purchaseId: number;
};

export default function OlivePurchaseItemsTab({ purchaseId }: Props) {
  const { items, fetchItems } = useOlivePurchaseItemsStore();

  useEffect(() => {
    console.log("Fetching items for purchaseId:", purchaseId);
    fetchItems(purchaseId);
  }, [purchaseId, fetchItems]);

  return (
    <div className="filters">
      <div className="filters-header">
        <div>
          <h3>Olives</h3>
          <span>Détail des lots liés à cet achat</span>
        </div>
      </div>

      <div className="filters-content">
        {items.map((item) => (
          <OlivePurchaseItemCardWidget key={item.id} item={item} />
        ))}

        {items.length === 0 && (
          <div className="filter-item">
            <span className="filter-item-value">Aucun lot pour cet achat.</span>
          </div>
        )}
      </div>
    </div>
  );
}
