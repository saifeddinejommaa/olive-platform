import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import TextEditor from "../../../../common/widgets/textEditor/TextEditor";
import InfoFieldWidget from "../../../../common/widgets/InfoFieldWidget";
import Button from "../../../../common/widgets/button/Button";

import {
  formatDate,
  formatStringToDateTime,
} from "../../../shared/utils/DatesUtils";

import { getOliveVarietyLabel } from "../../../appConstants/helper/AppConstantsHelper";
import { ProductionStatus } from "../../../production/domain/entities/ProductionStatus";

import { useHarvestDetailsStore } from "../stores/HarvestDetailsStore";
import TextInput from "../../../../common/widgets/textInput/TextInput";

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
        {/* Parcelle */}
        <InfoFieldWidget
          label="Parcelle"
          value={
            harvest.plotReference
              ? harvest.plotReference.toString()
              : "-"
          }
        />

        {/* Variété */}
        <InfoFieldWidget
          label="Variété"
          value={getOliveVarietyLabel(harvest.variety)}
        />

        {/* Date de récolte */}
        <InfoFieldWidget
          label="Date de récolte"
          value={formatDate(harvest.harvestDate)}
        />

        {/* Quantité */}
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

        {/* Arbres récoltés */}
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

        {/* Arbres prévus */}
        <InfoFieldWidget
          label="Arbres prévus"
          value={harvest.plannedTrees.toLocaleString(
            "fr-FR",
          )}
        />

        {/* Heure de début */}
        <InfoFieldWidget
          label="Heure de début"
          value={harvest.startTime ?? "-"}
        />

        {/* Heure de fin */}
        <InfoFieldWidget
          label="Heure de fin"
          value={harvest.endTime ?? "-"}
        />

        {/* Créé le */}
        <InfoFieldWidget
          label="Créé le"
          value={formatStringToDateTime(
            harvest.createdAt,
          )}
        />

        {/* Modifié le */}
        <InfoFieldWidget
          label="Modifié le"
          value={
            harvest.updatedAt
              ? formatStringToDateTime(
                  harvest.updatedAt,
                )
              : "-"
          }
        />

        {/* Notes */}
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

      {isInProgress && (
        <div className="filters-footer">
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
    </div>
  );
}
