import { useEffect, useMemo, useState } from "react";
import Button from "../../../../common/widgets/button/Button";
import Drawer from "../../../../common/widgets/drawer/Drawer";
import TextInput from "../../../../common/widgets/textInput/TextInput";
import DrawerInfoCard from "../../../../common/widgets/drawerInfoCard/DrawerInfoCard";
import DrawerConfirmationNotice from "../../../../common/widgets/DrawerConfirmationNotice";
import DrawerSummarySection from "../../../../common/widgets/DrawerSummarySection";
import { renderStatus } from "../../../../common/status/StatusUtils";
import { productionStatusConfig } from "../../../../common/status/ProductionStatusConfig";
import TankPicker from "../../../../common/widgets/tankPicker/TankPicker";
import FinishPressingInputSummaryRow from "../widgets/FinishPressingInputSummaryRow";
import { formatDate } from "@olive-platform/core/features/shared/utils/DatesUtils";
import {
  formatFlowRate,
  formatMinutes,
  formatSpeed,
  formatTemperature,
  formatWaterQuantity,
} from "@olive-platform/core/features/shared/utils/formatter";
import type { PressingOperationDetails } from "@olive-platform/core/features/production/domain/entities/PressingOperationDetails";
import type { PressingOperationInputDetails } from "@olive-platform/core/features/production/domain/entities/PressingOperationInputDetails";
import type { Tank } from "@olive-platform/core/features/tanks/domain/entities/Tank";
import { GetBufferTanks } from "@olive-platform/core/features/tanks/domain/usecases/GetBufferTanks";

type Props = {
  open: boolean;
  saving: boolean;
  operation: PressingOperationDetails;
  inputs: PressingOperationInputDetails[];
  onClose: () => void;
  onConfirm: (oilQuantityLiters: number, bufferTankId: number) => void;
};

// Citerne tampon affichée dans la jauge.
type BufferTank = Tank & { levelLiters: number };

const formatLiters = (value: number | null | undefined) =>
  value !== null && value !== undefined
    ? `${value.toLocaleString("fr-FR", { maximumFractionDigits: 1 })} L`
    : "-";

// Densité de l'huile d'olive (kg / L), pour le rendement en kg.
const OLIVE_OIL_DENSITY = 0.916;

export default function FinishPressingOperationDrawer({
  open,
  saving,
  operation,
  inputs,
  onClose,
  onConfirm,
}: Props) {
  const [oilQuantity, setOilQuantity] = useState("");
  const [bufferTankId, setBufferTankId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [bufferTanks, setBufferTanks] = useState<BufferTank[]>([]);
  const [loadingTanks, setLoadingTanks] = useState(false);
  const [tanksError, setTanksError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    setOilQuantity("");
    setBufferTankId(null);
    setError(null);
    setTanksError(null);
    setLoadingTanks(true);

    let cancelled = false;

    // Citernes tampon réelles, avec leur contenu actuel.
    GetBufferTanks()
      .then((tanks) => {
        if (cancelled) return;
        setBufferTanks(
          tanks.map((tank) => ({ ...tank, levelLiters: tank.currentQuantityLiters })),
        );
      })
      .catch(() => {
        if (!cancelled) setTanksError("Impossible de charger les citernes tampon.");
      })
      .finally(() => {
        if (!cancelled) setLoadingTanks(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open]);

  const oliveQuantityKg = inputs.reduce(
    (total, input) => total + Number(input.quantityKg ?? 0),
    0,
  );

  const expectedOilLiters = operation.expectedOilLiters ?? null;
  const parameters = operation.parameters;

  const enteredOilQuantity = Number(oilQuantity.replace(",", "."));
  const hasValidEntry =
    oilQuantity !== "" && Number.isFinite(enteredOilQuantity) && enteredOilQuantity > 0;
  const addedLiters = hasValidEntry ? enteredOilQuantity : 0;

  const deviation = useMemo(() => {
    if (expectedOilLiters === null || !hasValidEntry) return null;
    return enteredOilQuantity - expectedOilLiters;
  }, [expectedOilLiters, hasValidEntry, enteredOilQuantity]);

  const deviationPercentage =
    deviation !== null && expectedOilLiters
      ? (deviation / expectedOilLiters) * 100
      : null;

  // Rendement en kg d'huile pour 100 kg d'olives.
  const yieldPercentage =
    hasValidEntry && oliveQuantityKg > 0
      ? ((enteredOilQuantity * OLIVE_OIL_DENSITY) / oliveQuantityKg) * 100
      : null;

  // Citernes tampon : une seule pression par citerne (l'analyse doit la concerner seule),
  // donc seule une citerne vide peut recevoir l'huile.
  const unavailableReason = (tank: BufferTank) => {
    if (tank.currentQuantityLiters > 0) {
      return tank.pendingPressingNumber
        ? `occupée : ${tank.pendingPressingNumber} en attente d'analyse`
        : "occupée";
    }
    if (tank.capacityLiters < addedLiters) return "place insuffisante";
    return null;
  };

  // Les citernes vides et assez grandes d'abord.
  const sortedBufferTanks = [...bufferTanks].sort((a, b) => {
    const score = (tank: BufferTank) =>
      (tank.currentQuantityLiters > 0 ? 2 : 0) + (tank.capacityLiters < addedLiters ? 1 : 0);
    return score(a) - score(b) || a.code.localeCompare(b.code);
  });

  const suggestedBuffer =
    sortedBufferTanks.find((tank) => !unavailableReason(tank)) ?? null;

  // Présélection : la première citerne tampon vide et assez grande.
  useEffect(() => {
    const selected = bufferTanks.find((tank) => tank.id === bufferTankId);

    if (!selected || unavailableReason(selected)) {
      setBufferTankId(suggestedBuffer?.id ?? null);
    }
    // Recalculé quand le volume ou les citernes changent.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addedLiters, bufferTanks]);

  const handleConfirm = () => {
    if (!hasValidEntry) {
      setError("Veuillez renseigner une quantité d'huile produite valide.");
      return;
    }

    if (!bufferTankId) {
      setError("Aucune citerne tampon vide : libérez-en une avant de clôturer.");
      return;
    }

    setError(null);

    // L'analyse d'huile est planifiée par l'API : c'est elle qui décide de la citerne finale.
    onConfirm(enteredOilQuantity, bufferTankId);
  };

  return (
    <Drawer
      open={open}
      width={560}
      title="Clôturer la pression"
      description="Vérifiez les olives utilisées et la configuration, renseignez l'huile obtenue et la citerne tampon qui la reçoit."
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Annuler
          </Button>

          <Button variant="primary" onClick={handleConfirm} disabled={saving}>
            {saving ? "Clôture..." : "Confirmer et clôturer"}
          </Button>
        </>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <DrawerInfoCard label="Opération">
          {operation.operationNumber || "-"}
        </DrawerInfoCard>

        <DrawerInfoCard label="Date de pression">
          {formatDate(operation.plannedDate)}
        </DrawerInfoCard>

        <DrawerInfoCard label="Statut actuel">
          {renderStatus(operation.status, productionStatusConfig)}
        </DrawerInfoCard>

        <DrawerSummarySection
          title="Olives utilisées"
          description="Résumé des sources d'olives et de leurs analyses."
        >
          {inputs.length === 0 && (
            <div style={{ padding: "12px 0", color: "var(--color-muted)", fontSize: "13px" }}>
              Aucune source d'olives.
            </div>
          )}

          {inputs.map((input) => (
            <FinishPressingInputSummaryRow key={input.id} input={input} />
          ))}

          {inputs.length > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                paddingTop: "12px",
                marginTop: "4px",
              }}
            >
              <span>Quantité totale d'olives</span>
              <strong>{oliveQuantityKg.toLocaleString("fr-FR")} kg</strong>
            </div>
          )}
        </DrawerSummarySection>

        <DrawerSummarySection
          title="Configuration de pression"
          description="Paramètres utilisés pendant l'opération de pression."
        >
          {!parameters ? (
            <div style={{ padding: "12px 0", color: "var(--color-muted)", fontSize: "13px" }}>
              Aucune configuration de pression renseignée.
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: "12px 20px",
              }}
            >
              <DrawerInfoCard label="Température de malaxage">
                {formatTemperature(parameters.malaxingTemperatureC)}
              </DrawerInfoCard>
              <DrawerInfoCard label="Durée de malaxage">
                {formatMinutes(parameters.malaxingDurationMinutes)}
              </DrawerInfoCard>
              <DrawerInfoCard label="Vitesse de malaxage">
                {formatSpeed(parameters.malaxingSpeedRpm)}
              </DrawerInfoCard>
              <DrawerInfoCard label="Débit d'alimentation">
                {formatFlowRate(parameters.feedRateKgH)}
              </DrawerInfoCard>
              <DrawerInfoCard label="Vitesse du décanteur">
                {formatSpeed(parameters.decanterSpeedRpm)}
              </DrawerInfoCard>
              <DrawerInfoCard label="Différentiel du décanteur">
                {formatSpeed(parameters.decanterDifferentialRpm)}
              </DrawerInfoCard>
              <DrawerInfoCard label="Vitesse de la centrifugeuse">
                {formatSpeed(parameters.centrifugeSpeedRpm)}
              </DrawerInfoCard>
              <DrawerInfoCard label="Eau ajoutée">
                {formatWaterQuantity(parameters.addedWaterLiters)}
              </DrawerInfoCard>
              <DrawerInfoCard label="Température de l'eau">
                {formatTemperature(parameters.waterTemperatureC)}
              </DrawerInfoCard>
              <DrawerInfoCard label="Temps d'attente avant extraction">
                {formatMinutes(parameters.waitingTimeBeforeExtractionMinutes)}
              </DrawerInfoCard>

              {parameters.notes && (
                <div style={{ gridColumn: "1 / -1" }}>
                  <DrawerInfoCard label="Notes de configuration">
                    {parameters.notes}
                  </DrawerInfoCard>
                </div>
              )}
            </div>
          )}
        </DrawerSummarySection>

        {/* 1. PRODUCTION */}
        <div className="close-step">
          <div className="close-step__title">
            <span className="close-step__number">1</span>
            Production
          </div>

          <TextInput
            label="Huile produite (L)"
            type="number"
            min="0"
            step="0.1"
            placeholder="0"
            value={oilQuantity}
            onChange={(event) => {
              setOilQuantity(event.target.value);
              if (error) setError(null);
            }}
            disabled={saving}
          />

          <div className="close-step__metrics">
            <span>
              Huile attendue : <strong>{formatLiters(expectedOilLiters)}</strong>
            </span>

            {deviation !== null && (
              <span>
                Écart :{" "}
                <strong
                  style={{
                    color:
                      deviation >= 0 ? "var(--color-olive-700)" : "var(--color-rust-600)",
                  }}
                >
                  {deviation >= 0 ? "+" : ""}
                  {formatLiters(deviation)}
                  {deviationPercentage !== null &&
                    ` (${deviationPercentage >= 0 ? "+" : ""}${deviationPercentage.toFixed(1)} %)`}
                </strong>
              </span>
            )}

            {yieldPercentage !== null && (
              <span>
                Rendement : <strong>{yieldPercentage.toFixed(1)} %</strong> (kg d'huile
                / 100 kg d'olives)
              </span>
            )}
          </div>
        </div>

        {/* 2. CITERNE TAMPON */}
        <div className="close-step">
          <div className="close-step__title">
            <span className="close-step__number">2</span>
            Citerne tampon
          </div>
          <div className="close-step__subtitle">
            L'huile attend ici son analyse, sans être mélangée à une autre pression.
          </div>

          {loadingTanks && (
            <div className="close-step__note">Chargement des citernes tampon...</div>
          )}

          {tanksError && (
            <div className="close-step__note close-step__note--warning">{tanksError}</div>
          )}

          {!loadingTanks && !tanksError && !suggestedBuffer && (
            <div className="close-step__note close-step__note--warning">
              {bufferTanks.length === 0
                ? "Aucune citerne tampon active : créez-en une avant de clôturer."
                : `Aucune citerne tampon vide${
                    addedLiters > 0 ? ` pouvant recevoir ${formatLiters(addedLiters)}` : ""
                  } : transférez d'abord l'huile d'une pression analysée.`}
            </div>
          )}

          {!loadingTanks && (
            <TankPicker
              tanks={sortedBufferTanks}
              addedLiters={addedLiters}
              selectedTankId={bufferTankId}
              suggestedTankId={suggestedBuffer?.id}
              tagOf={(tank) => tank.tankTypeLabel}
              unavailableReason={unavailableReason}
              disabled={saving}
              onSelect={setBufferTankId}
            />
          )}

          <div className="close-step__note">
            Une <strong>analyse d'huile</strong> sera planifiée automatiquement pour
            cette pression. Une fois terminée, elle proposera la citerne de stockage
            selon la catégorie obtenue.
          </div>
        </div>

        {error && <span className="field-error">{error}</span>}

        <DrawerConfirmationNotice title="Confirmation">
          Une fois la pression clôturée, elle ne pourra plus être modifiée.
        </DrawerConfirmationNotice>
      </div>
    </Drawer>
  );
}
