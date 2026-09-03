
import Button from "../../../../common/widgets/button/Button";
import Drawer from "../../../../common/widgets/drawer/Drawer";

import { getOliveVarietyLabel } from "../../../appConstants/helper/AppConstantsHelper";

import { formatDate, formatNumber } from "../utils/OlivePurchase.utils";

import { renderStatus } from "../../../shared/utils/StatusUtils";
import { purchaseStatusConfig } from "../../../shared/status/PurchaseStatusConfig";
import type { OlivePurchaseForm } from "../types/OlivePurchase.types";

type ValidatePurchaseDrawerProps = {
  open: boolean;
  saving: boolean;
  form: OlivePurchaseForm;
  totalQuantity: number;
  totalAmount: number;
  onClose: () => void;
  onValidate: () => void;
};

export default function ValidatePurchaseDrawer({
  open,
  saving,
  form,
  totalQuantity,
  totalAmount,
  onClose,
  onValidate,
}: ValidatePurchaseDrawerProps) {
  return (
    <Drawer
      open={open}
      title="Valider l'achat d'olives"
      description="Vérifiez les informations de l'achat avant de confirmer sa validation."
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
            onClick={onValidate}
            disabled={saving}
          >
            {saving ? "Validation..." : "Confirmer et valider"}
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
        <div
          style={{
            padding: "16px",
            borderRadius: "8px",
            background: "#f8f9fa",
          }}
        >
          <strong>Référence de l'achat</strong>

          <div style={{ marginTop: "4px" }}>
            {form.reference || "-"}
          </div>
        </div>

        <div
          style={{
            padding: "16px",
            borderRadius: "8px",
            background: "#f8f9fa",
          }}
        >
          <strong>Fournisseur</strong>

          <div style={{ marginTop: "4px" }}>
            {form.supplierName || "-"}
          </div>
        </div>

        <div
          style={{
            padding: "16px",
            borderRadius: "8px",
            background: "#f8f9fa",
          }}
        >
          <strong>Date d'achat</strong>

          <div style={{ marginTop: "4px" }}>
            {formatDate(form.purchaseDate)}
          </div>
        </div>

        <div
          style={{
            padding: "16px",
            borderRadius: "8px",
            background: "#f8f9fa",
          }}
        >
          <strong>Statut actuel</strong>

          <div style={{ marginTop: "8px" }}>
            {renderStatus(form.status, purchaseStatusConfig)}
          </div>
        </div>

        <div
          style={{
            padding: "16px",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            background: "#fafafa",
          }}
        >
          <div style={{ marginBottom: "16px" }}>
            <strong>Lignes d'achat</strong>

            <div
              style={{
                marginTop: "4px",
                fontSize: "13px",
                color: "#6b7280",
              }}
            >
              Résumé des olives achetées.
            </div>
          </div>

          {form.items.map((item, index) => (
            <div
              key={item.id ?? `drawer-item-${index}`}
              style={{
                padding: "12px 0",
                borderBottom:
                  index < form.items.length - 1
                    ? "1px solid #e5e7eb"
                    : undefined,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "6px",
                }}
              >
                <strong>
                  {getOliveVarietyLabel(item.varietyId)}
                </strong>

                <strong>
                  {formatNumber(
                    item.agreedQuantityKg * item.pricePerKg,
                  )}{" "}
                  €
                </strong>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "13px",
                  color: "#6b7280",
                }}
              >
                <span>
                  Quantité : {formatNumber(item.agreedQuantityKg)} kg
                </span>

                <span>
                  Prix : {formatNumber(item.pricePerKg)} €/kg
                </span>
              </div>

              {item.analysis && (
                <div
                  style={{
                    marginTop: "8px",
                    fontSize: "13px",
                  }}
                >
                  Analyse :{" "}
                  <strong>{item.analysis.reference}</strong>
                </div>
              )}
            </div>
          ))}

          <div
            style={{
              marginTop: "15px",
              paddingTop: "15px",
              borderTop: "1px solid #e5e7eb",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "6px 0",
              }}
            >
              <span>Quantité totale</span>

              <strong>{formatNumber(totalQuantity)} kg</strong>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "6px 0",
              }}
            >
              <span>Montant total</span>

              <strong>{formatNumber(totalAmount)} €</strong>
            </div>
          </div>
        </div>

        {form.notes && (
          <div
            style={{
              padding: "16px",
              borderRadius: "8px",
              background: "#f8f9fa",
            }}
          >
            <strong>Notes</strong>

            <div
              style={{
                marginTop: "6px",
                whiteSpace: "pre-wrap",
              }}
            >
              {form.notes}
            </div>
          </div>
        )}

        <div
          style={{
            padding: "16px",
            borderRadius: "8px",
            background: "#fff8e1",
            border: "1px solid #f0d98c",
          }}
        >
          <strong>Confirmation</strong>

          <div
            style={{
              marginTop: "6px",
              fontSize: "13px",
            }}
          >
            Une fois l'achat validé, son statut passera à{" "}
            <strong>Approuvé</strong>.
          </div>
        </div>
      </div>
    </Drawer>
  );
}
