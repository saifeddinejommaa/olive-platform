import { useEffect, useState } from "react";

import Button from "../../../../common/widgets/button/Button";
import Drawer from "../../../../common/widgets/drawer/Drawer";
import DrawerInfoCard from "../../../../common/widgets/drawerInfoCard/DrawerInfoCard";
import DrawerSummarySection from "../../../../common/widgets/DrawerSummarySection";
import DrawerSummaryRow from "../../../../common/widgets/DrawerSummaryRow";
import DrawerConfirmationNotice from "../../../../common/widgets/DrawerConfirmationNotice";
import PaymentMethodSelector from "../../../../common/widgets/PaymentMethodSelector";
import TextInput from "../../../../common/widgets/textInput/TextInput";
import { formatAmount, formatQuantity, formatSaleDate } from "../OilSaleFormat";
import "../../../tanks/ui/Tanks.css";

import type {
  DeliveryPaymentParams,
  OilSaleDetails,
} from "@olive-platform/core/features/oilSales/domain/entities/OilSale";
import { TankType, type Tank } from "@olive-platform/core/features/tanks/domain/entities/Tank";
import { GetTanks } from "@olive-platform/core/features/tanks/domain/usecases/GetTanks";

type Props = {
  open: boolean;
  saving: boolean;
  sale: OilSaleDetails;
  onClose: () => void;
  // Paiement reçu à l'enlèvement ; undefined = le client paiera plus tard.
  onConfirm: (payment?: DeliveryPaymentParams) => void;
};

// Modes de paiement (table payment_method).
const PAYMENT_CHEQUE = 2;
const PAYMENT_TRANSFER = 3;

const toNumber = (value: string) => {
  const number = Number(value.replace(",", "."));
  return value.trim() !== "" && Number.isFinite(number) ? number : NaN;
};

/**
 * Validation de la sortie de citerne d'une vente : ce qui sort de chaque
 * citerne et ce qui y restera.
 */
export default function DeliverOilSaleDrawer({ open, saving, sale, onClose, onConfirm }: Props) {
  const [tanks, setTanks] = useState<Tank[]>([]);
  const [loading, setLoading] = useState(false);

  // Paiement à l'enlèvement : coché par défaut, montant TTC.
  const [paid, setPaid] = useState(true);
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<number | null>(1);
  const [reference, setReference] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Contenu actuel des citernes, pour montrer le niveau après la sortie.
  useEffect(() => {
    if (!open) return;

    setPaid(true);
    setAmount(String(Number(sale.totalAmount)));
    setPaymentMethod(1);
    setReference("");
    setPaymentDate(new Date().toISOString().split("T")[0]);
    setPaymentError(null);

    let cancelled = false;

    setLoading(true);

    GetTanks({ tankType: TankType.Storage })
      .then((items) => {
        if (!cancelled) setTanks(items);
      })
      .catch(() => {
        if (!cancelled) setTanks([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open]);

  const rows = sale.lines.map((line) => {
    const tank = tanks.find((item) => item.id === line.tankId);
    const current = tank ? Number(tank.currentQuantityLiters) : null;
    const after = current !== null ? current - Number(line.quantityLiters) : null;

    return { line, tank, current, after };
  });

  // Le stock a pu bouger depuis la création de la vente.
  const shortage = rows.find((row) => row.after !== null && row.after < 0);

  const total = Number(sale.totalAmount);
  const paidAmount = toNumber(amount);
  const remaining = paid && !Number.isNaN(paidAmount) ? Math.max(total - paidAmount, 0) : total;

  const handleConfirm = () => {
    if (!paid) {
      onConfirm(undefined);
      return;
    }

    if (Number.isNaN(paidAmount) || paidAmount <= 0) {
      setPaymentError("Renseignez le montant encaissé.");
      return;
    }

    if (paidAmount > total) {
      setPaymentError(`Le montant encaissé dépasse le total de la vente (${formatAmount(total)}).`);
      return;
    }

    if (!paymentMethod) {
      setPaymentError("Choisissez le mode de paiement.");
      return;
    }

    setPaymentError(null);

    onConfirm({
      amount: paidAmount,
      paymentMethod,
      reference: reference.trim() || undefined,
      paymentDate: paymentDate ? new Date(`${paymentDate}T12:00:00`).toISOString() : undefined,
    });
  };

  const referenceLabel =
    paymentMethod === PAYMENT_CHEQUE
      ? "N° de chèque"
      : paymentMethod === PAYMENT_TRANSFER
        ? "Référence du virement"
        : "Référence (facultatif)";

  return (
    <Drawer
      open={open}
      width={560}
      title="Livrer la vente"
      description="Validez la sortie de l'huile des citernes pour cette vente."
      onClose={() => {
        if (!saving) onClose();
      }}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Annuler
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={saving || loading || !!shortage}
          >
            {saving ? "Livraison..." : "Confirmer la sortie"}
          </Button>
        </>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <DrawerInfoCard label="Vente">
          {sale.reference} · {formatSaleDate(sale.saleDate)}
        </DrawerInfoCard>

        <DrawerInfoCard label="Client">
          {sale.customerName} — {sale.customerReference}
        </DrawerInfoCard>

        <DrawerSummarySection
          title="Sortie des citernes"
          description="Quantité qui sort de chaque citerne et contenu restant après la livraison."
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {rows.map(({ line, tank, current, after }) => {
              const capacity = tank ? Number(tank.capacityLiters) : null;
              const beforePct = capacity && current !== null ? (current / capacity) * 100 : 0;
              const afterPct = capacity && after !== null ? (Math.max(after, 0) / capacity) * 100 : 0;

              return (
                <div key={line.id} className="oil-location" style={{ cursor: "default" }}>
                  <div className="oil-location__header">
                    <strong>
                      {line.tankCode}
                      {line.tankName ? ` · ${line.tankName}` : ""}
                    </strong>
                    <span className="oil-location__tag">{line.oilCategoryLabel}</span>
                  </div>

                  {/* Jauge : contenu actuel (clair) et contenu restant (olive). */}
                  <div className="tank-gauge__bar" style={{ position: "relative" }}>
                    <div
                      className="tank-gauge__fill"
                      style={{ position: "absolute", width: `${beforePct}%`, opacity: 0.3 }}
                    />
                    <div className="tank-gauge__fill" style={{ position: "absolute", width: `${afterPct}%` }} />
                  </div>

                  <span className="tank-gauge__caption">
                    {loading || current === null ? (
                      "Chargement du contenu de la citerne..."
                    ) : (
                      <>
                        <strong>{formatQuantity(current, "L")}</strong> −{" "}
                        {formatQuantity(line.quantityLiters, "L")} →{" "}
                        <strong>{formatQuantity(Math.max(after ?? 0, 0), "L")}</strong> restants
                        {capacity ? ` / ${formatQuantity(capacity, "L")}` : ""}
                      </>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </DrawerSummarySection>

        <DrawerSummarySection title="Montants" description="Récapitulatif de la vente.">
          <DrawerSummaryRow label="Quantité" value={formatQuantity(sale.quantityLiters, "L")} />
          {sale.quantityKg !== null && (
            <DrawerSummaryRow label="Poids" value={formatQuantity(sale.quantityKg, "kg")} />
          )}
          <DrawerSummaryRow label="Total HT" value={formatAmount(sale.subtotal)} />
          <DrawerSummaryRow
            label={`TVA (${Number(sale.taxRate).toLocaleString("fr-FR")} %)`}
            value={formatAmount(sale.taxAmount)}
          />
          <DrawerSummaryRow label="Total TTC" value={formatAmount(sale.totalAmount)} withBorder={false} />
        </DrawerSummarySection>

        {/* ==================== PAIEMENT ==================== */}
        <DrawerSummarySection
          title="Paiement"
          description="Argent reçu du client à l'enlèvement : enregistré avec la sortie de l'huile."
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <input
                type="checkbox"
                checked={paid}
                onChange={(event) => {
                  setPaid(event.target.checked);
                  setPaymentError(null);
                }}
                disabled={saving}
              />
              Paiement reçu à l'enlèvement
            </label>

            {paid ? (
              <>
                <PaymentMethodSelector
                  label="Mode de paiement *"
                  value={paymentMethod}
                  onChange={(value) => {
                    setPaymentMethod(value);
                    setPaymentError(null);
                  }}
                  disabled={saving}
                />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <TextInput
                    label="Montant encaissé (DT) *"
                    type="number"
                    min="0"
                    step="0.001"
                    value={amount}
                    onChange={(event) => {
                      setAmount(event.target.value);
                      setPaymentError(null);
                    }}
                    disabled={saving}
                  />
                  <TextInput
                    label="Date du paiement"
                    type="date"
                    value={paymentDate}
                    onChange={(event) => setPaymentDate(event.target.value)}
                    disabled={saving}
                  />
                </div>

                <TextInput
                  label={referenceLabel}
                  value={reference}
                  onChange={(event) => setReference(event.target.value)}
                  disabled={saving}
                />

                <DrawerSummaryRow
                  label="Reste à payer après encaissement"
                  value={formatAmount(remaining)}
                  withBorder={false}
                />
              </>
            ) : (
              <div className="close-step__note">
                Le client paiera plus tard : la vente restera « Livrée » avec{" "}
                {formatAmount(total)} à encaisser.
              </div>
            )}

            {paymentError && <span className="field-error">{paymentError}</span>}
          </div>
        </DrawerSummarySection>

        {shortage ? (
          <div className="close-step__note close-step__note--warning">
            {shortage.line.tankCode} ne contient plus que {formatQuantity(shortage.current, "L")} :
            la vente ne peut pas être livrée telle quelle.
          </div>
        ) : (
          <DrawerConfirmationNotice title="Confirmation">
            L'huile sortira des citernes et la vente passera à « Livrée ». Cette action est
            définitive : une vente livrée ne peut plus être annulée.
          </DrawerConfirmationNotice>
        )}
      </div>
    </Drawer>
  );
}
