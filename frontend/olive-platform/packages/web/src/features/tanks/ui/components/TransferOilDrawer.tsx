import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Button from "../../../../common/widgets/button/Button";
import Drawer from "../../../../common/widgets/drawer/Drawer";
import DrawerInfoCard from "../../../../common/widgets/drawerInfoCard/DrawerInfoCard";
import TextInput from "../../../../common/widgets/textInput/TextInput";
import TankPicker from "../../../../common/widgets/tankPicker/TankPicker";
import OilGradeBadge from "../../../../common/widgets/oilGradeBadge/OilGradeBadge";
import { formatLiters, tankTitle } from "../TankFormat";

import { OIL_GRADE_LABELS } from "@olive-platform/core/features/oilQuality/OilGrade";
import { TankType, type Tank } from "@olive-platform/core/features/tanks/domain/entities/Tank";
import { GetTanks } from "@olive-platform/core/features/tanks/domain/usecases/GetTanks";
import {
  bufferOilState,
  GRADE_CATEGORIES,
  tankGrade,
} from "@olive-platform/core/features/tanks/domain/OilType";
import {
  TransferOilBetweenTanks,
  TransferOilToStorage,
} from "@olive-platform/core/features/oilMovements/domain/usecases/OilMovementUseCases";

type Props = {
  // Citerne d'origine ; null = tiroir fermé.
  tank: Tank | null;
  onClose: () => void;
  // Rechargement des citernes après le transfert.
  onTransferred: () => void;
};

type DestinationTank = Tank & { levelLiters: number };

/**
 * Transfert d'huile depuis une citerne :
 * - tampon analysée : toute l'huile vers le stockage de sa catégorie ;
 * - stockage : une quantité vers une autre citerne de la même catégorie.
 */
export default function TransferOilDrawer({ tank, onClose, onTransferred }: Props) {
  const navigate = useNavigate();

  const open = tank !== null;
  const isBuffer = tank?.tankType === TankType.Buffer;
  const bufferState = tank && isBuffer ? bufferOilState(tank) : null;

  // Catégorie de l'huile transférée : résultat de l'analyse (tampon) ou catégorie du stockage.
  const grade =
    bufferState?.kind === "analysed" ? bufferState.grade : tank && !isBuffer ? tankGrade(tank) : null;

  // En tampon, l'analyse doit être terminée.
  const blockedReason =
    bufferState && bufferState.kind !== "analysed"
      ? "L'huile de cette citerne tampon doit d'abord être analysée : sa catégorie décide de la citerne de stockage."
      : null;

  const available = Number(tank?.currentQuantityLiters ?? 0);

  const [destinations, setDestinations] = useState<DestinationTank[]>([]);
  const [loading, setLoading] = useState(false);
  const [destinationId, setDestinationId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Citernes de stockage actives de la même catégorie (hors citerne d'origine).
  useEffect(() => {
    if (!tank) return;

    setDestinationId(null);
    setQuantity(String(available));
    setNotes("");
    setError(null);
    setDestinations([]);

    if (!grade || blockedReason) return;

    let cancelled = false;

    setLoading(true);

    GetTanks({ tankType: TankType.Storage, oilCategory: GRADE_CATEGORIES[grade], status: "active" })
      .then((items) => {
        if (cancelled) return;
        setDestinations(
          items
            .filter((item) => item.id !== tank.id)
            .map((item) => ({ ...item, levelLiters: Number(item.currentQuantityLiters) })),
        );
      })
      .catch(() => {
        if (!cancelled) setError("Impossible de charger les citernes de stockage.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // Rechargé à chaque ouverture sur une citerne.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tank?.id]);

  // La tampon se vide entièrement ; le stockage transfère la quantité saisie.
  const liters = isBuffer ? available : Number(quantity.replace(",", "."));
  const validLiters = Number.isFinite(liters) && liters > 0 && liters <= available;

  const unavailableReason = (destination: DestinationTank) =>
    Number(destination.availableCapacityLiters) < (validLiters ? liters : 0)
      ? "place insuffisante"
      : null;

  // Les plus remplies avec assez de place d'abord (moins d'air, moins d'oxydation).
  const sortedDestinations = useMemo(
    () =>
      [...destinations].sort((a, b) => {
        const fits = (item: DestinationTank) =>
          Number(item.availableCapacityLiters) >= (validLiters ? liters : 0) ? 0 : 1;
        return fits(a) - fits(b) || Number(b.fillPercentage) - Number(a.fillPercentage);
      }),
    [destinations, liters, validLiters],
  );

  const suggested = sortedDestinations.find((item) => !unavailableReason(item)) ?? null;

  // Présélection : la citerne conseillée, tant que le choix courant ne convient pas.
  useEffect(() => {
    const selected = destinations.find((item) => item.id === destinationId);

    if (!selected || unavailableReason(selected)) {
      setDestinationId(suggested?.id ?? null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suggested?.id, destinations]);

  const handleConfirm = async () => {
    if (!tank || saving) return;

    if (!validLiters) {
      setError(`Renseignez une quantité entre 0 et ${formatLiters(available)}.`);
      return;
    }

    if (!destinationId) {
      setError("Choisissez la citerne de destination.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (isBuffer && tank.pendingOilAnalysisId) {
        await TransferOilToStorage({
          oilAnalysisId: tank.pendingOilAnalysisId,
          destinationTankId: destinationId,
          notes: notes.trim() || undefined,
        });
      } else {
        await TransferOilBetweenTanks({
          sourceTankId: tank.id,
          destinationTankId: destinationId,
          quantityLiters: liters,
          notes: notes.trim() || undefined,
        });
      }

      const destination = destinations.find((item) => item.id === destinationId);

      toast.success(
        `${formatLiters(liters)} transférés de ${tank.code} vers ${destination?.code ?? "la citerne"}.`,
      );

      onTransferred();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error && err.message ? err.message : "Impossible de transférer l'huile.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Drawer
      open={open}
      width={560}
      title="Transférer l'huile"
      description="Mouvement d'huile vers une citerne de stockage de la même catégorie."
      onClose={() => {
        if (!saving) onClose();
      }}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Annuler
          </Button>

          {blockedReason && tank?.pendingOilAnalysisId ? (
            <Button
              variant="primary"
              onClick={() => navigate(`/oil-analyses/${tank.pendingOilAnalysisId}`)}
            >
              Ouvrir l'analyse
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleConfirm}
              disabled={saving || !!blockedReason || !destinationId}
            >
              {saving ? "Transfert..." : "Confirmer le transfert"}
            </Button>
          )}
        </>
      }
    >
      {tank && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <DrawerInfoCard label="Citerne d'origine">{tankTitle(tank)}</DrawerInfoCard>

          <DrawerInfoCard label="Contenu">{formatLiters(available)}</DrawerInfoCard>

          <DrawerInfoCard label="Huile">
            {blockedReason ? (
              <OilGradeBadge grade={null}>
                {bufferState?.kind === "pending" ? bufferState.label : "En attente d'analyse"}
              </OilGradeBadge>
            ) : (
              <OilGradeBadge grade={grade} />
            )}
            {tank.pendingPressingNumber && ` · ${tank.pendingPressingNumber}`}
          </DrawerInfoCard>

          {blockedReason ? (
            <div className="close-step__note close-step__note--warning">{blockedReason}</div>
          ) : (
            <>
              {isBuffer ? (
                <div className="close-step__note">
                  Toute l'huile de la citerne tampon est transférée : elle redevient libre.
                </div>
              ) : (
                <TextInput
                  label="Quantité à transférer (L)"
                  type="number"
                  min="0"
                  step="0.1"
                  value={quantity}
                  onChange={(event) => {
                    setQuantity(event.target.value);
                    setError(null);
                  }}
                  disabled={saving}
                />
              )}

              {loading ? (
                <div className="close-step__note">Chargement des citernes de stockage...</div>
              ) : sortedDestinations.length === 0 ? (
                <div className="close-step__note close-step__note--warning">
                  Aucune autre citerne de stockage « {grade ? OIL_GRADE_LABELS[grade] : "-"} »
                  active.
                </div>
              ) : (
                <TankPicker
                  tanks={sortedDestinations}
                  addedLiters={validLiters ? liters : 0}
                  selectedTankId={destinationId}
                  suggestedTankId={suggested?.id}
                  tagOf={(item) => item.oilCategoryLabel}
                  unavailableReason={unavailableReason}
                  disabled={saving}
                  onSelect={setDestinationId}
                />
              )}

              <TextInput
                label="Notes (optionnel)"
                placeholder="Remarque sur le transfert..."
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                disabled={saving}
              />
            </>
          )}

          {error && <span className="field-error">{error}</span>}
        </div>
      )}
    </Drawer>
  );
}
