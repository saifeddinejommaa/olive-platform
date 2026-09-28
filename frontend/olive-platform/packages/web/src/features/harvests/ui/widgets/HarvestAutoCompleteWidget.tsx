import ListSlot from "../../../../common/widgets/ListSlot";
import { useEffect, useRef, useState } from "react";
import { Autocomplete } from "../../../../common/widgets/autoComplete/AutoComplete";
import { useHarvestsAutocomplete } from "@olive-platform/core/features/harvests/hooks/UseHarvestsAutoComplete";
import type { SourceOption } from "../../../production/ui/widgets/SourceReference";
import type { InitialSource } from "../../../production/ui/widgets/InputTypes";
import { useHarvestStocks } from "@olive-platform/core/features/harvests/hooks/UseHarvestStock";
import { HarvestStockStatus } from "@olive-platform/core/features/harvests/domain/entities/HarvestStockStatus";
import { SkipOliveLotAnalysis } from "@olive-platform/core/features/oliveLots/domain/usecases/SkipOliveLotAnalysis";

type HarvestOption = {
  id: number;
  reference: string;
};

type Props = {
  onSelect: (source: SourceOption) => void;
  // Emplacement de la liste (ex. pleine largeur de la carte). Absent : sous la recherche.
  listContainer?: HTMLElement | null;
  // Récolte présélectionnée : ses lots pressables sont cochés au chargement.
  initialSource?: InitialSource;
};

export default function HarvestAutoCompleteWidget({
  onSelect,
  listContainer,
  initialSource,
}: Props) {
  const [selectedHarvestId, setSelectedHarvestId] = useState<number | null>(
    initialSource?.id ?? null,
  );
  const [selectedHarvestReference, setSelectedHarvestReference] = useState(
    initialSource?.reference ?? "",
  );
  // Cochage automatique fait une seule fois, au premier chargement des lots.
  const autoSelectDone = useRef(!initialSource);
  const [selectedStockIds, setSelectedStockIds] = useState<number[]>([]);
  const [skippingId, setSkippingId] = useState<number | null>(null);

  const { HarvestStock, loading: loadingStocks, reload } =
    useHarvestStocks(selectedHarvestId);
  // Lots avec du restant, non réservés en totalité ni vidés. Ceux dont
  // l'analyse n'est pas terminée sont affichés grisés (non sélectionnables).
  const stocks = (HarvestStock ?? []).filter(
    (stock) =>
      stock.remainingKg > 0 &&
      (stock.status === HarvestStockStatus.Available ||
        stock.status === HarvestStockStatus.PartiallyUsed),
  );
  const pressableStocks = stocks.filter((stock) => stock.isPressable);

  const handleSelectHarvest = (option: HarvestOption) => {
    setSelectedHarvestId(option.id);
    setSelectedHarvestReference(option.reference);
    setSelectedStockIds([]);

    onSelect({
      id: option.id,
      reference: option.reference,
    });
  };

  const emitSelection = (stockIds: number[]) => {
    const selectedStocks = pressableStocks.filter((stock) =>
      stockIds.includes(stock.id),
    );
    const quantityKg = selectedStocks.reduce(
      (total, stock) => total + Number(stock.remainingKg ?? 0),
      0,
    );

    if (selectedHarvestId) {
      onSelect({
        id: selectedHarvestId,
        reference: selectedHarvestReference,
        lots: selectedStocks.map((stock) => ({
          id: stock.id,
          reference: stock.reference,
          quantityKg: Number(stock.remainingKg ?? 0),
        })),
        quantityKg,
      });
    }
  };

  const handleToggleStock = (stockId: number) => {
    setSelectedStockIds((current) => {
      const next = current.includes(stockId)
        ? current.filter((id) => id !== stockId)
        : [...current, stockId];

      emitSelection(next);
      return next;
    });
  };

  const handleSelectAll = () => {
    const next =
      selectedStockIds.length === pressableStocks.length
        ? []
        : pressableStocks.map((stock) => stock.id);

    setSelectedStockIds(next);
    emitSelection(next);
  };

  // Récolte présélectionnée : tous ses lots pressables sont cochés.
  useEffect(() => {
    if (autoSelectDone.current || loadingStocks || !HarvestStock) return;

    autoSelectDone.current = true;
    const ids = pressableStocks.map((stock) => stock.id);

    setSelectedStockIds(ids);
    emitSelection(ids);
    // Déclenché uniquement à l'arrivée des lots.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [HarvestStock, loadingStocks]);

  // « Passer sans analyse » : le lot devient sélectionnable.
  const handleSkipAnalysis = async (stockId: number) => {
    setSkippingId(stockId);

    try {
      await SkipOliveLotAnalysis(stockId);
      reload();
    } finally {
      setSkippingId(null);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <Autocomplete
        useSearch={useHarvestsAutocomplete}
        getLabel={(harvest) => harvest.reference}
        onSelect={handleSelectHarvest}
        defaultLabel={initialSource?.reference}
        placeholder="Rechercher une récolte..."
        width="100%"
      />

      <ListSlot container={listContainer}>
      {selectedHarvestId && (
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
            <div>Référence</div>
            <div style={{ textAlign: "right" }}>Quantité</div>
          </div>

          {loadingStocks && (
            <div
              style={{ padding: "20px", textAlign: "center", color: "#666" }}
            >
              Chargement des stocks...
            </div>
          )}

          {!loadingStocks && stocks.length === 0 && (
            <div
              style={{ padding: "20px", textAlign: "center", color: "#666" }}
            >
              Aucun stock disponible pour cette récolte.
            </div>
          )}

          {!loadingStocks && stocks.length > 0 && (
            <div>
              {stocks.map((stock) => {
                const isSelected = selectedStockIds.includes(stock.id);
                const isBlocked = !stock.isPressable;

                return (
                  <label
                    key={stock.id}
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
                        onChange={() => handleToggleStock(stock.id)}
                        style={{
                          width: "18px",
                          height: "18px",
                          cursor: isBlocked ? "not-allowed" : "pointer",
                        }}
                      />
                    </div>

                    <div style={{ fontWeight: 600 }}>{stock.id}</div>

                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        gap: "8px",
                        fontWeight: 500,
                      }}
                    >
                      <span>{stock.reference}</span>

                      {isBlocked && (
                        <>
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
                            disabled={skippingId === stock.id}
                            onClick={(event) => {
                              event.preventDefault();
                              handleSkipAnalysis(stock.id);
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
                            {skippingId === stock.id
                              ? "..."
                              : "Passer sans analyse"}
                          </button>
                        </>
                      )}
                    </div>

                    <div
                      style={{
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                        textAlign: "right",
                      }}
                    >
                      {stock.remainingKg < stock.quantityKg
                        ? `${stock.remainingKg} / ${stock.quantityKg} kg`
                        : `${stock.quantityKg} kg`}
                    </div>
                  </label>
                );
              })}
            </div>
          )}

          {!loadingStocks && stocks.length > 0 && (
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
                {stocks.length} stock{stocks.length > 1 ? "s" : ""}
              </span>

              {pressableStocks.length > 0 ? (
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
                {selectedStockIds.length === pressableStocks.length
                  ? "Tout désélectionner"
                  : "Tout sélectionner"}
              </button>
              ) : (
                <span />
              )}

              <strong>
                {selectedStockIds.length} sélectionné
                {selectedStockIds.length > 1 ? "s" : ""}
              </strong>
            </div>
          )}
        </div>
      )}
      </ListSlot>
    </div>
  );
}
