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
  toDateOnlyString,
} from "@olive-platform/core/features/shared/utils/DatesUtils";
import { useSeasonStore } from "../../../../stores/SeasonStore";

import { ProductionStatus } from "@olive-platform/core/features/production/domain/entities/ProductionStatus";

import { useHarvestDetailsStore } from "@olive-platform/core/features/harvests/stores/HarvestDetailsStore";
import HarvestCostsWidget from "../widgets/HarvestCostsWidget";
import HarvestTypeSelector from "../../../../common/widgets/HarvestTypeSelector";
import { getHarvestTypeLabel, getOliveVarietyLabel } from "@olive-platform/core/features/appConstants/helper/AppConstantsHelper";

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
  const [plannedDate, setPlannedDate] = useState("");

  // Bornes du sélecteur de date : la campagne de la récolte.
  const season = useSeasonStore((state) =>
    state.seasons.find((item) => item.id === harvest?.seasonId),
  );

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

    setPlannedDate(
      harvest.plannedDate
        ? toDateOnlyString(new Date(harvest.plannedDate))
        : "",
    );
  }, [harvest]);

  const isPlanned =
    harvest?.status === ProductionStatus.Planned;

  const isInProgress =
    harvest?.status === ProductionStatus.InProgress;

  // Récolte non lancée : seule la date prévue est modifiable.
  const handleSavePlannedDate = async () => {
    if (!harvest || !isPlanned) {
      return;
    }

    if (!plannedDate) {
      toast.error("La date de récolte est obligatoire.");
      return;
    }

    try {
      await update(harvest.id, {
        plannedDate: new Date(`${plannedDate}T00:00:00`).toISOString(),
      });

      toast.success("La date de récolte a été mise à jour.");
    } catch (e: any) {
      toast.error(
        e?.message ??
          "Une erreur est survenue lors de la mise à jour de la récolte.",
      );
    }
  };

  const handleSave = async () => {
    if (isPlanned) {
      await handleSavePlannedDate();
      return;
    }

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
      // Le store recharge la récolte après la mise à jour.
      await update(harvest.id, {
        harvestType: harvestType,
        quantityKg: parsedQuantityKg ?? 0,
        harvestedTrees: parsedHarvestedTrees,
      });

      toast.success(
        "Les informations de la récolte ont été mises à jour avec succès.",
      );
    } catch (e: any) {
      toast.error(
        e?.message ??
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

  // Erreur de chargement uniquement : une erreur d'enregistrement
  // est affichée en toast et ne doit pas masquer le formulaire.
  if (error && !harvest) {
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

            {isPlanned ? (
              <TextInput
                label="Date de récolte"
                type="date"
                value={plannedDate}
                min={season?.startDate}
                max={season?.endDate}
                onChange={(event) =>
                  setPlannedDate(event.target.value)
                }
              />
            ) : (
              <InfoFieldWidget
                label="Date de récolte"
                value={formatDate(harvest.plannedDate)}
              />
            )}

            <InfoFieldWidget
              label="Arbres prévus"
              value={harvest.plannedTrees.toLocaleString(
                "fr-FR",
              )}
            />

            <InfoFieldWidget
              label="Heure de début"
              value={formatStringToDateTime(harvest.startTime)}
            />

            <InfoFieldWidget
              label="Heure de fin"
              value={formatStringToDateTime(harvest.endTime)}
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

      {(isPlanned || isInProgress) && (
        <div className="fixed-actions-spacer" />
      )}

      {(isPlanned || isInProgress) && (
        <div className="fixed-actions-bar">
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