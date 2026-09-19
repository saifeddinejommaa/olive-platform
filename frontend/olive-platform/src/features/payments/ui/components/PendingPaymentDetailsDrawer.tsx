import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import Drawer from "../../../../common/widgets/drawer/Drawer";
import DrawerInfoCard from "../../../../common/widgets/drawerInfoCard/DrawerInfoCard";
import Button from "../../../../common/widgets/button/Button";

import type { PendingPayment } from "../../domain/entities/PandingPayment";
import { usePendingPaymentDetailsStore } from "../stores/UsePendingPaymentDetailsStore";
import { usePendingPaymentsStore } from "../stores/UsePendingPaymentsStore";

import { getCostTypeLabel } from "../../../appConstants/helper/AppConstantsHelper";
import TextInput from "../../../../common/widgets/textInput/TextInput";
import PaymentMethodSelector from "../../../../common/widgets/PaymentMethodSelector";
import type { PaymentMethod } from "../../domain/entities/PaymentMethod";

type Props = {
  open: boolean;
  payment: PendingPayment | null;
  onClose: () => void;
  onPaymentSuccess: () => void;
};

export default function PendingPaymentDetailsDrawer({
  open,
  payment,
  onClose,
}: Props) {
  const {
    details,
    loading,
    error,
    fetchDetails,
    clearDetails,
  } = usePendingPaymentDetailsStore();

  const { payPayment } = usePendingPaymentsStore();

  const [isPaymentMode, setIsPaymentMode] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(1 as PaymentMethod);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    if (!open || !payment) {
      clearDetails();
      setIsPaymentMode(false);
      setPaymentAmount("");
      return;
    }

    fetchDetails(
      payment.sourceType,
      payment.paymentSources,
    );
  }, [
    open,
    payment,
    fetchDetails,
    clearDetails,
  ]);

  const handleClose = () => {
    clearDetails();
    setIsPaymentMode(false);
    setPaymentAmount("");
    onClose();
  };

  const handleStartPayment = () => {
    setPaymentAmount("");
    setIsPaymentMode(true);
  };

  const handleCancelPayment = () => {
    setPaymentAmount("");
    setIsPaymentMode(false);
  };

  if (!payment) {
    return null;
  }

  const amountToPay = Number(paymentAmount) || 0;

  const remainingAmount = Math.max(
    payment.amountDue - amountToPay,
    0,
  );

  const isPaymentAmountValid =
    amountToPay > 0 &&
    amountToPay <= payment.amountDue;

  const handleConfirmPayment = async () => {
    if (!isPaymentAmountValid || !details?.details?.length) {
      return;
    }

    try {
      setPaying(true);

      const sourceIds = details.details.map(
        (detail) => detail.sourceId,
      );

      await payPayment(
        amountToPay,
        sourceIds,
        details.type,
        paymentMethod
      );

      toast.success("Paiement effectué avec succès.");

      clearDetails();
      setIsPaymentMode(false);
      setPaymentAmount("");

      onClose();
    } catch {
      toast.error(
        "Impossible d'effectuer le paiement.",
      );
    } finally {
      setPaying(false);
    }
  };

  return (
    <Drawer
      open={open}
      title="Détails du paiement"
      description="Consultez les informations relatives aux opérations à payer."
      onClose={handleClose}
      footer={
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "8px",
          }}
        >
          {!isPaymentMode ? (
            <Button
              variant="primary"
              onClick={handleStartPayment}
              disabled={
                loading ||
                payment.amountDue <= 0
              }
            >
              Régler
            </Button>
          ) : (
            <>
              <Button
                variant="secondary"
                onClick={handleCancelPayment}
                disabled={paying}
              >
                Annuler
              </Button>

              <Button
                variant="primary"
                onClick={handleConfirmPayment}
                disabled={
                  !isPaymentAmountValid ||
                  paying
                }
              >
                {paying
                  ? "Paiement..."
                  : "Confirmer le paiement"}
              </Button>
            </>
          )}
        </div>
      }
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        {/* ============================================================
            INFORMATIONS DU PAIEMENT
        ============================================================ */}

        <DrawerInfoCard label="Destinataire">
          {payment.recipientName || "-"}
        </DrawerInfoCard>

        <DrawerInfoCard label="Montant total à payer">
          {payment.amountDue.toLocaleString("fr-FR", {
            style: "currency",
            currency: "EUR",
          })}
        </DrawerInfoCard>

        <DrawerInfoCard label="Nombre d'opérations">
          {payment.paymentSources.length}
        </DrawerInfoCard>

        {/* ============================================================
            FORMULAIRE DE REGLEMENT
        ============================================================ */}



        {/* ============================================================
            CHARGEMENT
        ============================================================ */}

        {loading && (
          <div className="loading">
            Chargement des détails...
          </div>
        )}

        {/* ============================================================
            ERREUR
        ============================================================ */}

        {!loading && error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* ============================================================
            DETAILS DES OPERATIONS
        ============================================================ */}

        {!loading &&
          !error &&
          details &&
          details.details?.length > 0 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <h3 style={{ margin: 0 }}>
                Détails des opérations
              </h3>

              {details.details.map((detail) => (
                <div
                  key={detail.sourceId}
                  style={{
                    border:
                      "1px solid #e5e7eb",
                    borderRadius: "8px",
                    padding: "16px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  {/* En-tête */}

                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <strong>
                      Opération #
                      {detail.sourceReference}
                    </strong>

                    <span>
                      {getCostTypeLabel(
                        detail.costLineType,
                      ) ?? "—"}
                    </span>
                  </div>

                  {/* Informations principales */}

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "1fr 1fr",
                      gap: "12px",
                    }}
                  >
                    <DrawerInfoCard label="Type">
                      {getCostTypeLabel(
                        detail.costLineType,
                      ) ?? "—"}
                    </DrawerInfoCard>

                    <DrawerInfoCard label="Date">
                      {new Date(
                        detail.operationDate,
                      ).toLocaleDateString(
                        "fr-FR",
                      )}
                    </DrawerInfoCard>

                    <DrawerInfoCard label="Montant total">
                      {detail.totalAmount.toLocaleString(
                        "fr-FR",
                        {
                          style: "currency",
                          currency: "EUR",
                        },
                      )}
                    </DrawerInfoCard>

                    <DrawerInfoCard label="Montant restant">
                      {detail.amountDue.toLocaleString(
                        "fr-FR",
                        {
                          style: "currency",
                          currency: "EUR",
                        },
                      )}
                    </DrawerInfoCard>
                  </div>

                  {/* Notes */}

                  <DrawerInfoCard label="Notes">
                    {detail.notes ||
                      "Aucune note"}
                  </DrawerInfoCard>
                </div>
              ))}
            </div>
          )}
        {isPaymentMode && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              padding: "16px",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
            }}
          >
            <h3 style={{ margin: 0 }}>
              Régler le paiement
            </h3>

            <div>
              <label
                htmlFor="paymentAmount"
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: 500,
                }}
              >
                Montant à régler
              </label>

              <TextInput
                id="paymentAmount"
                type="number"
                min={0}
                max={payment.amountDue}
                step={0.01}
                value={paymentAmount}
                onChange={(event) => setPaymentAmount(event.target.value)}
                placeholder="0.00"
                disabled={paying}
              />
            </div>
            <div>
              <label
                htmlFor="paymentAmount"
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: 500,
                }}
              >
                Moyen de Paiement
              </label>

              <PaymentMethodSelector
                value={paymentMethod}
                onChange={(event) => setPaymentMethod(event as PaymentMethod)}
                disabled={paying}
              />
            </div>

            {/* Montant restant */}

            <DrawerInfoCard label="Montant restant">
              {remainingAmount.toLocaleString(
                "fr-FR",
                {
                  style: "currency",
                  currency: "EUR",
                },
              )}
            </DrawerInfoCard>

            {/* Erreur montant trop élevé */}

            {amountToPay > payment.amountDue && (
              <div className="error-message">
                Le montant à régler ne peut pas
                dépasser{" "}
                {payment.amountDue.toLocaleString(
                  "fr-FR",
                  {
                    style: "currency",
                    currency: "EUR",
                  },
                )}
                .
              </div>
            )}

            {/* Erreur montant invalide */}

            {paymentAmount !== "" &&
              amountToPay <= 0 && (
                <div className="error-message">
                  Le montant doit être supérieur
                  à 0.
                </div>
              )}
          </div>
        )}

        {/* ============================================================
            AUCUN DETAIL
        ============================================================ */}

        {!loading &&
          !error &&
          details &&
          details.details?.length === 0 && (
            <div>
              Aucun détail disponible pour
              ce paiement.
            </div>
          )}
      </div>
    </Drawer>
  );
}