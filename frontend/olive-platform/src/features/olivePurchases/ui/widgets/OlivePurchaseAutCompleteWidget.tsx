import { useEffect, useState } from "react";
import { Autocomplete } from "../../../../common/widgets/autoComplete/AutoComplete";
import { UseOlivePurchaseAutoComplete } from "../../../olivePurchases/ui/hooks/UseOlivePurchaseAutoComplete";
import { GetOlivePurchaseItems } from "../../../olivePurchases/domain/usecases/GetOlivePurchaseItems";
import { getOliveVarietyLabel } from "../../../appConstants/helper/AppConstantsHelper";
import type { SourceOption } from "../../../production/ui/widgets/SourceReference";
import type { OlivePurchaseItemDetails } from "../../domain/entities/OlivePurchaseItemDetails";

type PurchaseOption = {
  id: number;
  reference: string;
};

type Props = {
  onSelect: (source: SourceOption) => void;
};

export default function OlivePurchaseAutoCompleteWidget({ onSelect }: Props) {
  const [selectedPurchaseId, setSelectedPurchaseId] = useState<number | null>(null);
  const [selectedPurchaseReference, setSelectedPurchaseReference] = useState("");
  const [purchaseItems, setPurchaseItems] = useState<OlivePurchaseItemDetails[]>([]);
  const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);

  useEffect(() => {
    if (!selectedPurchaseId) return;

    let cancelled = false;

    const loadItems = async () => {
      setLoadingItems(true);

      try {
        const data = await GetOlivePurchaseItems(selectedPurchaseId);
        if (!cancelled) setPurchaseItems(data);
      } catch {
        if (!cancelled) setPurchaseItems([]);
      } finally {
        if (!cancelled) setLoadingItems(false);
      }
    };

    loadItems();

    return () => {
      cancelled = true;
    };
  }, [selectedPurchaseId]);

  const handleSelectPurchase = (purchase: PurchaseOption) => {
    setSelectedPurchaseId(purchase.id);
    setSelectedPurchaseReference(purchase.reference);
    setSelectedItemIds([]);
    setPurchaseItems([]);

    onSelect({
      id: purchase.id,
      reference: purchase.reference,
      purchaseItemIds: [],
    });
  };

  const emitSelection = (itemIds: number[]) => {
    const selectedItems = purchaseItems.filter((item) => itemIds.includes(item.id));
    const quantityKg = selectedItems.reduce(
      (total, item) => total + Number(item.agreedQuantityKg ?? 0),
      0,
    );

    if (selectedPurchaseId) {
      onSelect({
        id: selectedPurchaseId,
        reference: selectedPurchaseReference,
        purchaseItemIds: itemIds,
        quantityKg,
      });
    }
  };

  const handleToggleItem = (itemId: number) => {
    setSelectedItemIds((current) => {
      const next = current.includes(itemId)
        ? current.filter((id) => id !== itemId)
        : [...current, itemId];

      emitSelection(next);
      return next;
    });
  };

  const handleSelectAll = () => {
    const next =
      selectedItemIds.length === purchaseItems.length
        ? []
        : purchaseItems.map((item) => item.id);

    setSelectedItemIds(next);
    emitSelection(next);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <Autocomplete
        useSearch={UseOlivePurchaseAutoComplete}
        getLabel={(purchase) => purchase.reference}
        onSelect={handleSelectPurchase}
        placeholder="Rechercher un achat..."
        width={400}
      />

      {selectedPurchaseId && (
        <div
          style={{
            width: "100%",
            border: "1px solid #ddd",
            borderRadius: "8px",
            overflow: "hidden",
            background: "#fff",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "50px 70px minmax(0, 1fr) 120px",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              background: "#f7f7f7",
              borderBottom: "1px solid #ddd",
              fontSize: "13px",
              fontWeight: 600,
              color: "#555",
            }}
          >
            <div style={{ textAlign: "center" }}>Sélection</div>
            <div>ID</div>
            <div>Description / Variété</div>
            <div style={{ textAlign: "right" }}>Quantité</div>
          </div>

          {loadingItems && (
            <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
              Chargement des lots...
            </div>
          )}

          {!loadingItems && purchaseItems.length === 0 && (
            <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
              Aucun lot trouvé pour cet achat.
            </div>
          )}

          {!loadingItems && purchaseItems.length > 0 && (
            <div>
              {purchaseItems.map((item) => {
                const isSelected = selectedItemIds.includes(item.id);
                const varietyLabel = getOliveVarietyLabel(item.variety);

                return (
                  <label
                    key={item.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "50px 70px minmax(0, 1fr) 120px",
                      alignItems: "center",
                      gap: "12px",
                      padding: "14px 16px",
                      borderBottom: "1px solid #eee",
                      cursor: "pointer",
                      background: isSelected ? "#f5f5f5" : "#fff",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleItem(item.id)}
                        style={{ width: "18px", height: "18px", cursor: "pointer" }}
                      />
                    </div>

                    <div style={{ fontWeight: 600 }}>{item.reference}</div>

                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "3px",
                        minWidth: 0,
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 500,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.notes ?? varietyLabel ?? "Lot"}
                      </span>

                      {varietyLabel && item.notes && (
                        <span style={{ fontSize: "12px", color: "#777" }}>{varietyLabel}</span>
                      )}
                    </div>

                    <div style={{ fontWeight: 600, whiteSpace: "nowrap", textAlign: "right" }}>
                      {item.agreedQuantityKg} kg
                    </div>
                  </label>
                );
              })}
            </div>
          )}

          {!loadingItems && purchaseItems.length > 0 && (
            <div
              style={{
                padding: "12px 16px",
                background: "#fafafa",
                borderTop: "1px solid #ddd",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: "13px", color: "#666" }}>
                {purchaseItems.length} lot{purchaseItems.length > 1 ? "s" : ""}
              </span>

              <button
                type="button"
                onClick={handleSelectAll}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: 500,
                }}
              >
                {selectedItemIds.length === purchaseItems.length
                  ? "Tout désélectionner"
                  : "Tout sélectionner"}
              </button>

              <strong>
                {selectedItemIds.length} sélectionné{selectedItemIds.length > 1 ? "s" : ""}
              </strong>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
