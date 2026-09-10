// src/features/production/plots/presentation/components/LaunchHarvestCard.tsx

import { useState } from "react";
import { toast } from "react-toastify";

import Button from "../../../../common/widgets/button/Button";
import TextInput from "../../../../common/widgets/textInput/TextInput";
import { createHarvestUseCase } from "../../../harvests/domain/usecases/createHarvest";


type Props = {
  plotId: number;
  varietyId: number;
  defaultPlannedTrees: number;
  onClose: () => void;
  onSuccess: () => void;
};

export default function LaunchHarvestCard({
  plotId,
  varietyId,
  defaultPlannedTrees,
  onClose,
  onSuccess,
}: Props) {
  const [harvestDate, setHarvestDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [plannedTrees, setPlannedTrees] = useState(
    defaultPlannedTrees.toString()
  );
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    const parsedPlannedTrees = Number(plannedTrees);

    if (Number.isNaN(parsedPlannedTrees) || parsedPlannedTrees <= 0) {
      toast.error("Le nombre d'arbres prévus doit être un nombre positif.");
      return;
    }

    setSaving(true);
    try {
      await createHarvestUseCase({
        plotId,
        varietyId,
        harvestDate,
        plannedTrees: parsedPlannedTrees,
      });

      toast.success("Récolte lancée avec succès");
      onSuccess();
    } catch {
      toast.error("Une erreur est survenue lors du lancement de la récolte");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="filters" style={{ marginTop: "12px" }}>
      <div className="filters-header">
        <div>
          <h3>Lancer une récolte</h3>
          <span>Saisir les informations de la récolte pour cette variété</span>
        </div>
      </div>

      <div className="filters-content">
        <div className="filter-item">
          <TextInput
            label="Date de récolte"
            type="date"
            value={harvestDate}
            onChange={(event) => setHarvestDate(event.target.value)}
          />
        </div>

        <div className="filter-item">
          <TextInput
            label="Arbres prévus"
            type="number"
            min="1"
            step="1"
            value={plannedTrees}
            onChange={(event) => setPlannedTrees(event.target.value)}
          />
        </div>
      </div>

      <div className="filters-footer">
        <Button variant="secondary" onClick={onClose} disabled={saving}>
          Annuler
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={saving}>
          {saving ? "Lancement..." : "Lancer"}
        </Button>
      </div>
    </div>
  );
}