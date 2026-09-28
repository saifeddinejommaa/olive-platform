import ListSlot from "../../../../common/widgets/ListSlot";
import { useEffect, useRef, useState } from "react";
import { Autocomplete } from "../../../../common/widgets/autoComplete/AutoComplete";
import { UseOlivePurchaseAutoComplete } from "@olive-platform/core/features/olivePurchases/hooks/UseOlivePurchaseAutoComplete";
import { GetOlivePurchaseItems } from "@olive-platform/core/features/olivePurchases/domain/usecases/GetOlivePurchaseItems";
import type { SourceOption } from "../../../production/ui/widgets/SourceReference";
import type { InitialSource } from "../../../production/ui/widgets/InputTypes";
import type { OlivePurchaseItemDetails } from "@olive-platform/core/features/olivePurchases/domain/entities/OlivePurchaseItemDetails";
import { getOliveVarietyLabel } from "@olive-platform/core/features/appConstants/helper/AppConstantsHelper";
import { SkipOliveLotAnalysis } from "@olive-platform/core/features/oliveLots/domain/usecases/SkipOliveLotAnalysis";

type PurchaseOption = {
  id: number;
  reference: string;
};

type Props = {
  onSelect: (source: SourceOption) => void;
  // Emplacement de la liste (ex. pleine largeur de la carte). Absent : sous la recherche.
  listContainer?: HTMLElement | null;
  // Achat présélectionné : ses lots pressables sont cochés au chargement.
  initialSource?: InitialSource;
};

export default function OlivePurchaseAutoCompleteWidget({
  onSelect,
  listContainer,
  initialSource,
}: Props) {
  const [selectedPurchaseId, setSelectedPurchaseId] = useState<number | null>(
    initialSource?.id ?? null,
  );
  const [selectedPurchaseReference, setSelectedPurchaseReference] = useState(
    initialSource?.reference ?? "",
  );
  // Cochage automatique fait une seule fois, au premier chargement des lots.
  const autoSelectDone = useRef(!initialSource);
  const [purchaseItems, setPurchaseItems] = useState<
    OlivePurchaseItemDetails[]
  >([]);
  const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [skippingId, setSkippingId] = useState<number | null>(null);
  // Incrémenté pour recharger les lots (ex. après « Passer sans analyse »).
  const [version, setVersion] = useState(0);

  // Lots avec du restant (statut Disponible / Partiellement utilisé). Ceux dont
  // l'analyse n'est pas terminée sont affichés grisés (non sélectionnables).
  const lots = purchaseItems.filter(
    (item) => item.remainingQuantityKg > 0 && (item.status === 1 || item.status === 2),
  );
  const pressableLots = lots.filter((item) => item.isPressable);

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
  }, [selectedPurchaseId, version]);

  const handleSelectPurchase = (purchase: PurchaseOption) => {
    setSelectedPurchaseId(purchase.id);
    setSelectedPurchaseReference(purchase.reference);
    setSelectedItemIds([]);
    setPurchaseItems([]);

    onSelect({
      id: purchase.id,
      reference: purchase.reference,
      lots: [],
    });
  };

  const emitSelection = (itemIds: number[]) => {
    const selectedItems = pressableLots.filter((item) =>
      itemIds.includes(item.id),
    );
    const quantityKg = selectedItems.reduce(
      (total, item) => total + Number(item.remainingQuantityKg ?? 0),
      0,
    );

    if (selectedPurchaseId) {
      onSelect({
        id: selectedPurchaseId,
        reference: selectedPurchaseReference,
        lots: selectedItems.map((item) => ({
          id: item.id,
          reference: item.reference,
          quantityKg: Number(item.remainingQuantityKg ?? 0),
        })),
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
      selectedItemIds.length === pressableLots.length
        ? []
        : pressableLots.map((item) => item.id);

    setSelectedItemIds(next);
    emitSelection(next);
  };

  // Achat présélectionné : tous ses lots pressables sont cochés.
  useEffect(() => {
    if (autoSelectDone.current || loadingItems || purchaseItems.length === 0) return;

    autoSelectDone.current = true;
    const ids = pressableLots.map((item) => item.id);

    setSelectedItemIds(ids);
    emitSelection(ids);
    // Déclenché uniquement à l'arrivée des lots.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [purchaseItems, loadingItems]);

  // « Passer sans analyse » : le lot devient sélectionnable.
  const handleSkipAnalysis = async (itemId: number) => {
    setSkippingId(itemId);

    try {
      await SkipOliveLotAnalysis(itemId);
      setVersion((current) => current + 1);
    } finally {
      setSkippingId(null);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <Autocomplete
        useSearch={UseOlivePurchaseAutoComplete}
        getLabel={(purchase) => purchase.reference}
        onSelect={handleSelectPurchase}
        defaultLabel={initialSource?.reference}
        placeholder="Rechercher un achat..."
        width="100%"
      />

      <ListSlot container={listContainer}>
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
            <div
              style={{ padding: "20px", textAlign: "center", color: "#666" }}
            >
              Chargement des lots...
            </div>
          )}

          {!loadingItems && lots.length === 0 && (
            <div
              style={{ padding: "20px", textAlign: "center", color: "#666" }}
            >
              Aucun lot disponible pour cet achat.
            </div>
          )}

          {!loadingItems && lots.length > 0 && (
            <div>
              {lots.map((item) => {
                const isSelected = selectedItemIds.includes(item.id);
                const isBlocked = !item.isPressable;
                const varietyLabel = getOliveVarietyLabel(item.variety);

                return (
                  <label
                    key={item.id}
                    title={isBlocked ? "En attente d'analyse" : undefined}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "50px 70px minmax(0, 1fr) 120px",
                      alignItems: "center",
                      gap: "12px",
                      padding: "14px 16px",
                      borderBottom: "1px solid #eee",
                      cursor: isBlocked ? "not-allowed" : "pointer",
                      background: isBlocked
                        ? "#fafafa"
                        : isSelected
                          ? "#f5f5f5"
                          : "#fff",
                      color: isBlocked ? "#999" : undefined,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        disabled={isBlocked}
                        onChange={() => handleToggleItem(item.id)}
                        style={{
                          width: "18px",
                          height: "18px",
                          cursor: isBlocked ? "not-allowed" : "pointer",
                        }}
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
                        <span style={{ fontSize: "12px", color: "#777" }}>
                          {varietyLabel}
                        </span>
                      )}

                      {isBlocked && (
                        <span
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "12px",
                              padding: "2px 8px",
                              borderRadius: "999px",
                              background: "#fff4e5",
                              color: "#b26a00",
                            }}
                          >
                            En attente d'analyse
                          </span>

                          <button
                            type="button"
                            disabled={skippingId === item.id}
                            onClick={(event) => {
                              event.preventDefault();
                              handleSkipAnalysis(item.id);
                            }}
                            style={{
                              border: "1px solid #ccc",
                              borderRadius: "6px",
                              background: "#fff",
                              padding: "2px 8px",
                              fontSize: "12px",
                              cursor: "pointer",
                              color: "#333",
                            }}
                          >
                            {skippingId === item.id
                              ? "..."
                              : "Passer sans analyse"}
                          </button>
                        </span>
                      )}
                    </div>

                    <div
                      style={{
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                        textAlign: "right",
                      }}
                    >
                      {item.remainingQuantityKg < item.agreedQuantityKg
                        ? `${item.remainingQuantityKg} / ${item.agreedQuantityKg} kg`
                        : `${item.agreedQuantityKg} kg`}
                    </div>
                  </label>
                );
              })}
            </div>
          )}

          {!loadingItems && lots.length > 0 && (
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
                {lots.length} lot{lots.length > 1 ? "s" : ""}
              </span>

              {pressableLots.length > 0 ? (
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
                {selectedItemIds.length === pressableLots.length
                  ? "Tout désélectionner"
                  : "Tout sélectionner"}
              </button>
              ) : (
                <span />
              )}

              <strong>
                {selectedItemIds.length} sélectionné
                {selectedItemIds.length > 1 ? "s" : ""}
              </strong>
            </div>
          )}
        </div>
      )}
      </ListSlot>
    </div>
  );
}
