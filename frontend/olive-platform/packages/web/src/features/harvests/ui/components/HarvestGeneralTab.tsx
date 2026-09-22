import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import TextEditor from "../../../../common/widgets/textEditor/TextEditor";
import InfoFieldWidget from "../../../../common/widgets/InfoFieldWidget";
import Button from "../../../../common/widgets/button/Button";
import TextInput from "../../../../common/widgets/textInput/TextInput";
import Card from "../../../../common/widgets/card/Card";

import {
  formatDate,
  formatStringToDateTime,
  formatTime,
} from "@olive-platform/core/features/shared/utils/DatesUtils";

import { getHarvestTypeLabel, getOliveVarietyLabel } from "@olive-platform/core/features/appConstants/helper/AppConstantsHelper";
import { ProductionStatus } from "@olive-platform/core/features/production/domain/entities/ProductionStatus";

import { useHarvestDetailsStore } from "@olive-platform/core/features/harvests/stores/HarvestDetailsStore";
import HarvestCostsWidget from "../widgets/HarvestCostsWidget";
import HarvestTypeSelector from "../../../../common/widgets/HarvestTypeSelector";

type Props = {
  harvestId: number;
  onNotesChange: (notes: string) => void;
};

export default function HarvestGeneralTab({
  harvestId,
  onNotesChange,
}: Props) {
  const {
    harvest,
    loading,
    saving,
    error,
    fetchHarvest,
    update,
  } = useHarvestDetailsStore();

  const [quantityKg, setQuantityKg] = useState("");
  const [harvestedTrees, setHarvestedTrees] = useState("");
  const [harvestType, setHarvestType] = useState(0);

  useEffect(() => {
    if (!harvestId) {
      return;
    }

    fetchHarvest(harvestId);
  }, [harvestId, fetchHarvest]);

  useEffect(() => {
    if (!harvest) {
      return;
    }

    setQuantityKg(
      harvest.quantityKg !== null
        ? harvest.quantityKg.toString()
        : "",
    );

    setHarvestedTrees(
      harvest.harvestedTrees.toString(),
    );

    setHarvestType(harvest.harvestType);
  }, [harvest]);

  const isInProgress =
    harvest?.status === ProductionStatus.InProgress;

  const handleSave = async () => {
    if (!harvest || !isInProgress) {
      return;
    }

    const parsedQuantityKg =
      quantityKg.trim() === ""
        ? undefined
        : Number(quantityKg);

    const parsedHarvestedTrees =
      harvestedTrees.trim() === ""
        ? 0
        : Number(harvestedTrees);

    if (
      parsedQuantityKg !== undefined &&
      (Number.isNaN(parsedQuantityKg) ||
        parsedQuantityKg < 0)
    ) {
      toast.error(
        "La quantité doit être un nombre positif.",
      );
      return;
    }

    if (
      Number.isNaN(parsedHarvestedTrees) ||
      parsedHarvestedTrees < 0
    ) {
      toast.error(
        "Le nombre d'arbres récoltés doit être un nombre positif.",
      );
      return;
    }

    try {
      await update(harvest.id, {
        quantityKg: parsedQuantityKg,
        harvestedTrees: parsedHarvestedTrees,
        harvestType: harvestType,
      });

      await fetchHarvest(harvest.id);

      toast.success(
        "Les informations de la récolte ont été mises à jour avec succès.",
      );
    } catch {
      toast.error(
        "Une erreur est survenue lors de la mise à jour de la récolte.",
      );
    }
  };

  if (loading) {
    return (
      <div className="filters">
        <div className="filters-header">
          <div>
            <h3>Informations générales</h3>
            <span>
              Informations relatives à la récolte
            </span>
          </div>
        </div>

        <div className="filters-content">
          <div
            className="filter-item"
            style={{ gridColumn: "1 / -1" }}
          >
            <span className="filter-item-label">
              Chargement
            </span>

            <span>
              Chargement des informations de la récolte...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="filters">
        <div className="filters-header">
          <div>
            <h3>Informations générales</h3>
            <span>
              Informations relatives à la récolte
            </span>
          </div>
        </div>

        <div className="filters-content">
          <div
            className="filter-item"
            style={{ gridColumn: "1 / -1" }}
          >
            <span className="filter-item-label">
              Erreur
            </span>

            <span>{error}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!harvest) {
    return (
      <div className="filters">
        <div className="filters-header">
          <div>
            <h3>Informations générales</h3>
            <span>
              Informations relatives à la récolte
            </span>
          </div>
        </div>

        <div className="filters-content">
          <div
            className="filter-item"
            style={{ gridColumn: "1 / -1" }}
          >
            <span className="filter-item-label">
              Informations
            </span>

            <span>
              Aucune information disponible.
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Card>
        <div className="filters">
          <div className="filters-header">
            <div>
              <h3>Informations générales</h3>
            </div>
          </div>

          <div className="info-grid">
            <InfoFieldWidget
              label="Variété"
              value={getOliveVarietyLabel(harvest.variety)}
            />

            <InfoFieldWidget
              label="Date de récolte"
              value={formatDate(harvest.harvestDate)}
            />

            <InfoFieldWidget
              label="Arbres prévus"
              value={harvest.plannedTrees.toLocaleString(
                "fr-FR",
              )}
            />

            <InfoFieldWidget
              label="Heure de début"
              value={formatTime(harvest.startTime)}
            />

            <InfoFieldWidget
              label="Heure de fin"
              value={formatTime(harvest.endTime)}
            />

            {isInProgress ? (
              <div className="filter-item">
                <label>Type de récolte</label>

                <HarvestTypeSelector
                  value={harvestType}
                  onChange={(value) =>
                    setHarvestType(value ?? 0)
                  }
                />
              </div>
            ) : (
              <InfoFieldWidget
                label="Type de récolte"
                value={getHarvestTypeLabel(harvest.harvestType) ?? "-"}
              />
            )}

            {isInProgress ? (
              <TextInput
                label="Quantité (kg)"
                type="number"
                min="0"
                step="0.01"
                value={quantityKg}
                onChange={(event) =>
                  setQuantityKg(event.target.value)
                }
              />
            ) : (
              <InfoFieldWidget
                label="Quantité (kg)"
                value={
                  harvest.quantityKg !== null
                    ? harvest.quantityKg.toLocaleString(
                        "fr-FR",
                      )
                    : "-"
                }
              />
            )}

            {isInProgress ? (
              <TextInput
                label="Arbres récoltés"
                type="number"
                min="0"
                step="1"
                value={harvestedTrees}
                onChange={(event) =>
                  setHarvestedTrees(event.target.value)
                }
              />
            ) : (
              <InfoFieldWidget
                label="Arbres récoltés"
                value={harvest.harvestedTrees.toLocaleString(
                  "fr-FR",
                )}
              />
            )}

            <div
              className="filter-item"
              style={{
                gridColumn: "1 / -1",
              }}
            >
              <span className="filter-item-label">
                Notes
              </span>

              <TextEditor
                value={harvest.notes ?? ""}
                placeholder="Notes concernant la récolte..."
                onChange={onNotesChange}
              />
            </div>
          </div>
        </div>
      </Card>

      <HarvestCostsWidget
        costs={harvest.costs}
      />

      {isInProgress && (
        <div className="harvest-general-actions">
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving
              ? "Enregistrement..."
              : "Enregistrer"}
          </Button>
        </div>
      )}
    </>
  );
}