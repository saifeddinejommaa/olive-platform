import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import Button from "../../../../../common/widgets/button/Button";
import Card from "../../../../../common/widgets/card/Card";
import TankPicker from "../../../../../common/widgets/tankPicker/TankPicker";
import OilCategoryBadge from "../../../../../common/widgets/oilCategoryBadge/OilCategoryBadge";
import TextInput from "../../../../../common/widgets/textInput/TextInput";
import { formatLiters } from "../../../../tanks/ui/TankFormat";

import type { OilLocation } from "@olive-platform/core/features/analyses/oilAnalyses/domain/entities/OilLocation";
import {
  OIL_CATEGORY_LABELS,
  TankType,
  type OilCategory,
  type Tank,
} from "@olive-platform/core/features/tanks/domain/entities/Tank";
import { GetTanks } from "@olive-platform/core/features/tanks/domain/usecases/GetTanks";
import { TransferOilToStorage } from "@olive-platform/core/features/oilMovements/domain/usecases/OilMovementUseCases";

type Props = {
  oilAnalysisId: number;
  // Catégorie officielle de l'huile, fixée par l'API à la clôture de l'analyse.
  category: OilCategory | null;
  // Citernes contenant l'huile analysée.
  locations: OilLocation[];
  // Rechargement de l'analyse après le transfert.
  onTransferred: () => void;
};

type StorageTank = Tank & { levelLiters: number };

/**
 * Après l'analyse d'une pression : transfert de son huile de la citerne
 * tampon vers une citerne de stockage de la catégorie obtenue.
 */
export default function OilStorageTransferCard({
  oilAnalysisId,
  category,
  locations,
  onTransferred,
}: Props) {

  // Huile encore en citerne tampon : c'est elle qui est transférée.
  const bufferLocations = locations.filter(
    (location) => location.tankType === TankType.Buffer,
  );
  const quantity = bufferLocations.reduce(
    (total, location) => total + Number(location.quantityLiters),
    0,
  );

  const [tanks, setTanks] = useState<StorageTank[]>([]);
  const [loading, setLoading] = useState(false);
  const [tankId, setTankId] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  // Citernes de stockage actives de la catégorie de l'huile.
  useEffect(() => {
    if (!category || quantity <= 0) return;

    let cancelled = false;

    setLoading(true);

    GetTanks({
      tankType: TankType.Storage,
      oilCategory: category,
      status: "active",
    })
      .then((items) => {
        if (!cancelled) {
          setTanks(items.map((tank) => ({ ...tank, levelLiters: Number(tank.currentQuantityLiters) })));
        }
      })
      .catch(() => {
        if (!cancelled) toast.error("Impossible de charger les citernes de stockage.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [category, quantity]);

  const unavailableReason = (tank: StorageTank) =>
    Number(tank.availableCapacityLiters) < quantity ? "place insuffisante" : null;

  // Les plus remplies avec assez de place d'abord (moins d'air, moins d'oxydation).
  const sortedTanks = useMemo(
    () =>
      [...tanks].sort((a, b) => {
        const fits = (tank: StorageTank) =>
          Number(tank.availableCapacityLiters) >= quantity ? 0 : 1;
        return fits(a) - fits(b) || Number(b.fillPercentage) - Number(a.fillPercentage);
      }),
    [tanks, quantity],
  );

  const suggested =
    sortedTanks.find((tank) => Number(tank.availableCapacityLiters) >= quantity) ?? null;

  useEffect(() => {
    setTankId(suggested?.id ?? null);
  }, [suggested?.id]);

  // Rien à transférer : l'huile n'est plus en citerne tampon.
  if (quantity <= 0) return null;

  const handleTransfer = async () => {
    if (!tankId || saving) return;

    const tank = tanks.find((item) => item.id === tankId);

    setSaving(true);

    try {
      await TransferOilToStorage({
        oilAnalysisId,
        destinationTankId: tankId,
        notes: notes.trim() || undefined,
      });

      toast.success(
        `${formatLiters(quantity)} transférés vers ${tank?.code ?? "la citerne de stockage"}.`,
      );

      onTransferred();
    } catch (error) {
      toast.error(
        error instanceof Error && error.message
          ? error.message
          : "Impossible de transférer l'huile.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <div className="filters">
        <div className="filters-header">
          <div>
            <h3>Stockage de l'huile</h3>
            <span>
              Transfert de {formatLiters(quantity)} depuis{" "}
              {bufferLocations.map((location) => location.tankCode).join(", ")} vers une
              citerne de stockage de la catégorie obtenue.
            </span>
          </div>

          <OilCategoryBadge category={category}>
            {category ? `Catégorie : ${OIL_CATEGORY_LABELS[category]}` : "Catégorie inconnue"}
          </OilCategoryBadge>
        </div>

        {!category ? (
          <div className="close-step__note close-step__note--warning">
            Cette analyse n'a pas de catégorie d'huile : elle doit être clôturée avec son acidité.
          </div>
        ) : loading ? (
          <div className="close-step__note">Chargement des citernes de stockage...</div>
        ) : (
          <>
            {!suggested && (
              <div className="close-step__note close-step__note--warning">
                {tanks.length === 0
                  ? `Aucune citerne de stockage « ${OIL_CATEGORY_LABELS[category]} » active.`
                  : `Aucune citerne « ${OIL_CATEGORY_LABELS[category]} » ne peut recevoir ${formatLiters(quantity)}.`}
              </div>
            )}

            <TankPicker
              tanks={sortedTanks}
              addedLiters={quantity}
              selectedTankId={tankId}
              suggestedTankId={suggested?.id}
              tagOf={(tank) => tank.oilCategoryLabel}
              unavailableReason={unavailableReason}
              disabled={saving}
              onSelect={setTankId}
            />

            <TextInput
              label="Notes (optionnel)"
              placeholder="Remarque sur le transfert..."
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              disabled={saving}
            />

            <div className="filters-footer">
              <Button
                variant="primary"
                onClick={handleTransfer}
                disabled={!tankId || saving}
              >
                {saving ? "Transfert..." : "Transférer vers le stockage"}
              </Button>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
