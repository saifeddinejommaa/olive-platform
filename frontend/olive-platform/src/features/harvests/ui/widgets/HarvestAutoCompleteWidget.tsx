import { useState } from "react";
import { Autocomplete } from "../../../../common/widgets/autoComplete/AutoComplete";
import { useHarvestsAutocomplete } from "../../../harvests/ui/hooks/UseHarvestsAutoComplete";
import { useHarvestDetails } from "../../../harvests/ui/hooks/UseHarvestDetails";
import type { SourceOption } from "../../../production/ui/widgets/SourceReference";

type HarvestOption = {
  id: number;
  reference: string;
};

type Props = {
  onSelect: (source: SourceOption) => void;
};

export default function HarvestAutoCompleteWidget({ onSelect }: Props) {
  const [selectedHarvestId, setSelectedHarvestId] = useState<number | null>(
    null,
  );
  const [selectedHarvestReference, setSelectedHarvestReference] = useState("");
  const [selectedStockIds, setSelectedStockIds] = useState<number[]>([]);

  const { harvest, loading: loadingStocks } =
    useHarvestDetails(selectedHarvestId);
  const stocks = harvest?.stocks ?? [];

  const handleSelectHarvest = (option: HarvestOption) => {
    setSelectedHarvestId(option.id);
    setSelectedHarvestReference(option.reference);
    setSelectedStockIds([]);

    onSelect({
      id: option.id,
      reference: option.reference,
      harvestStockIds: [],
    });
  };

  const emitSelection = (stockIds: number[]) => {
    const selectedStocks = stocks.filter((stock) =>
      stockIds.includes(stock.id),
    );
    const quantityKg = selectedStocks.reduce(
      (total, stock) => total + Number(stock.quantityKg ?? 0),
      0,
    );

    if (selectedHarvestId) {
      onSelect({
        id: selectedHarvestId,
        reference: selectedHarvestReference,
        harvestStockIds: stockIds,
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
      selectedStockIds.length === stocks.length
        ? []
        : stocks.map((stock) => stock.id);

    setSelectedStockIds(next);
    emitSelection(next);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <Autocomplete
        useSearch={useHarvestsAutocomplete}
        getLabel={(harvest) => harvest.reference}
        onSelect={handleSelectHarvest}
        placeholder="Rechercher une récolte..."
        width={400}
      />

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
              Aucun stock trouvé pour cette récolte.
            </div>
          )}

          {!loadingStocks && stocks.length > 0 && (
            <div>
              {stocks.map((stock) => {
                const isSelected = selectedStockIds.includes(stock.id);

                return (
                  <label
                    key={stock.id}
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
                        onChange={() => handleToggleStock(stock.id)}
                        style={{
                          width: "18px",
                          height: "18px",
                          cursor: "pointer",
                        }}
                      />
                    </div>

                    <div style={{ fontWeight: 600 }}>{stock.id}</div>

                    <div style={{ fontWeight: 500 }}>{stock.reference}</div>

                    <div
                      style={{
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                        textAlign: "right",
                      }}
                    >
                      {stock.quantityKg} kg
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
                {selectedStockIds.length === stocks.length
                  ? "Tout désélectionner"
                  : "Tout sélectionner"}
              </button>

              <strong>
                {selectedStockIds.length} sélectionné
                {selectedStockIds.length > 1 ? "s" : ""}
              </strong>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
