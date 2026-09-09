import { useEffect, useMemo, useState } from "react";

import Button from "../../../../common/widgets/button/Button";
import Drawer from "../../../../common/widgets/drawer/Drawer";
import DrawerConfirmationNotice from "../../../../common/widgets/DrawerConfirmationNotice";
import DrawerInfoCard from "../../../../common/widgets/drawerInfoCard/DrawerInfoCard";
import TextInput from "../../../../common/widgets/textInput/TextInput";

import type { HarvestDetails } from "../../domain/entities/HarvestDetails";

import { formatDate } from "../../../shared/utils/DatesUtils";
import type { HarvestStockParams } from "../../domain/params/HarvestStockParams";
import CheckboxField from "../../../../common/widgets/checkBoxField/CheckboxField";

type Props = {
    open: boolean;
    saving: boolean;
    harvest: HarvestDetails;
    onClose: () => void;
    onConfirm: (
        stocks: HarvestStockParams[],
        proceedAnalyse: boolean,
    ) => void;
};

export default function CloseHarvestDrawer({
    open,
    saving,
    harvest,
    onClose,
    onConfirm,
}: Props) {
    const [stocks, setStocks] = useState<HarvestStockParams[]>([]);
    const [proceedAnalyse, setProceedAnalyse] = useState(false);

    useEffect(() => {
        if (!open) {
            return;
        }

        setStocks([
            {
                quantityKg: harvest.quantityKg ?? 0,
            },
        ]);

        setProceedAnalyse(false);
    }, [open, harvest]);

    const totalQuantityKg = harvest.quantityKg ?? 0;

    const distributedQuantityKg = useMemo(() => {
        return stocks.reduce(
            (total, stock) => total + (Number(stock.quantityKg) || 0),
            0,
        );
    }, [stocks]);

    const remainingQuantityKg =
        totalQuantityKg - distributedQuantityKg;

    const isDistributionValid =
        distributedQuantityKg === totalQuantityKg &&
        stocks.length > 0 &&
        stocks.every(
            (stock) =>
                Number.isFinite(stock.quantityKg) &&
                stock.quantityKg > 0,
        );

    const handleStockQuantityChange = (
        index: number,
        value: string,
    ) => {
        const quantity = value === "" ? 0 : Number(value);

        setStocks((currentStocks) =>
            currentStocks.map((stock, stockIndex) =>
                stockIndex === index
                    ? {
                          ...stock,
                          quantityKg: Number.isNaN(quantity)
                              ? 0
                              : quantity,
                      }
                    : stock,
            ),
        );
    };

    const handleAddStock = () => {
        setStocks((currentStocks) => [
            ...currentStocks,
            {
                quantityKg: 0,
            },
        ]);
    };

    const handleRemoveStock = (index: number) => {
        setStocks((currentStocks) =>
            currentStocks.filter(
                (_, stockIndex) => stockIndex !== index,
            ),
        );
    };

    const handleConfirm = () => {
        if (!isDistributionValid) {
            return;
        }
        
        onConfirm(stocks, proceedAnalyse);
    };

    return (
        <Drawer
            open={open}
            title="Clôturer la récolte"
            description="Vérifiez les informations de la récolte et répartissez la quantité d'olives dans les stocks avant de confirmer sa clôture."
            onClose={onClose}
            footer={
                <>
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        disabled={saving}
                    >
                        Annuler
                    </Button>

                    <Button
                        variant="primary"
                        onClick={handleConfirm}
                        disabled={saving || !isDistributionValid}
                    >
                        {saving
                            ? "Clôture..."
                            : "Confirmer et clôturer"}
                    </Button>
                </>
            }
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                }}
            >
                <DrawerInfoCard label="Référence de la récolte">
                    {harvest.reference || "-"}
                </DrawerInfoCard>

                <DrawerInfoCard label="Parcelle">
                    {harvest.plotId || "-"}
                </DrawerInfoCard>

                <DrawerInfoCard label="Variété">
                    {harvest.variety?.toString() || "-"}
                </DrawerInfoCard>

                <DrawerInfoCard label="Date de récolte">
                    {harvest.harvestDate
                        ? formatDate(harvest.harvestDate)
                        : "-"}
                </DrawerInfoCard>

                <DrawerInfoCard label="Arbres prévus">
                    {harvest.plannedTrees?.toLocaleString("fr-FR") ||
                        "-"}
                </DrawerInfoCard>

                <DrawerInfoCard label="Arbres récoltés">
                    {harvest.harvestedTrees?.toLocaleString("fr-FR") ||
                        "-"}
                </DrawerInfoCard>

                <DrawerInfoCard label="Quantité récoltée (kg)">
                    {harvest.quantityKg != null
                        ? harvest.quantityKg.toLocaleString("fr-FR")
                        : "-"}
                </DrawerInfoCard>

                <DrawerInfoCard label="Heure de début">
                    {harvest.startTime || "-"}
                </DrawerInfoCard>

                <DrawerInfoCard label="Heure de fin">
                    {harvest.endTime || "-"}
                </DrawerInfoCard>

                {/* Distribution dans les stocks */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <div>
                            <span
                                style={{
                                    display: "block",
                                    fontWeight: 600,
                                    marginBottom: "4px",
                                }}
                            >
                                Répartition dans les stocks
                            </span>

                            <span>
                                Répartissez la quantité totale récoltée
                                entre les stocks.
                            </span>
                        </div>

                        <Button
                            variant="secondary"
                            onClick={handleAddStock}
                            disabled={saving}
                        >
                            + Ajouter un stock
                        </Button>
                    </div>

                    {/* Résumé de la distribution */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(3, minmax(0, 1fr))",
                            gap: "12px",
                        }}
                    >
                        <DrawerInfoCard label="Quantité totale">
                            {totalQuantityKg.toLocaleString("fr-FR")} kg
                        </DrawerInfoCard>

                        <DrawerInfoCard label="Quantité distribuée">
                            {distributedQuantityKg.toLocaleString(
                                "fr-FR",
                            )}{" "}
                            kg
                        </DrawerInfoCard>

                        <DrawerInfoCard label="Quantité restante">
                            {remainingQuantityKg.toLocaleString(
                                "fr-FR",
                            )}{" "}
                            kg
                        </DrawerInfoCard>
                    </div>

                    {/* Stocks */}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "12px",
                        }}
                    >
                        {stocks.map((stock, index) => (
                            <div
                                key={index}
                                style={{
                                    display: "flex",
                                    alignItems: "flex-end",
                                    gap: "12px",
                                }}
                            >
                                <div
                                    style={{
                                        flex: 1,
                                    }}
                                >
                                    <TextInput
                                        label={`Stock ${index + 1} (kg)`}
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={
                                            stock.quantityKg === 0
                                                ? ""
                                                : stock.quantityKg.toString()
                                        }
                                        onChange={(event) =>
                                            handleStockQuantityChange(
                                                index,
                                                event.target.value,
                                            )
                                        }
                                    />
                                </div>

                                <Button
                                    variant="secondary"
                                    onClick={() =>
                                        handleRemoveStock(index)
                                    }
                                    disabled={
                                        saving || stocks.length === 1
                                    }
                                >
                                    Supprimer
                                </Button>
                            </div>
                        ))}
                    </div>

                    {/* Message de validation */}
                    {!isDistributionValid && (
                        <div
                            style={{
                                padding: "12px",
                                borderRadius: "6px",
                            }}
                        >
                            {remainingQuantityKg > 0 ? (
                                <span>
                                    Il reste{" "}
                                    <strong>
                                        {remainingQuantityKg.toLocaleString(
                                            "fr-FR",
                                        )}{" "}
                                        kg
                                    </strong>{" "}
                                    à répartir dans les stocks.
                                </span>
                            ) : remainingQuantityKg < 0 ? (
                                <span>
                                    La quantité distribuée dépasse la
                                    quantité récoltée de{" "}
                                    <strong>
                                        {Math.abs(
                                            remainingQuantityKg,
                                        ).toLocaleString("fr-FR")}{" "}
                                        kg
                                    </strong>
                                    .
                                </span>
                            ) : (
                                <span>
                                    Chaque stock doit contenir une
                                    quantité supérieure à 0 kg.
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Demande d'analyse */}
                <CheckboxField
                    label="Procéder à une analyse"
                    description="Une analyse des olives sera lancée après la clôture de la récolte."
                    checked={proceedAnalyse}
                    onChange={setProceedAnalyse}
                    disabled={saving}
                />

                <DrawerConfirmationNotice title="Confirmation">
                    Une fois la récolte clôturée, elle ne pourra plus
                    être modifiée.
                </DrawerConfirmationNotice>
            </div>
        </Drawer>
    );
}