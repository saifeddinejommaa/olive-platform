import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { CreateOilAnalysis } from "../../domain/usecases/GetOilAnalysisDetails";

import { Autocomplete } from "../../../../../common/widgets/autoComplete/AutoComplete";
import { usePressingOperationsAutocomplete } from "../../../../production/ui/hooks/UsePressingOperationsAutocomplete";

import TextInput from "../../../../../common/widgets/textInput/TextInput";
import Button from "../../../../../common/widgets/button/Button";
import Select from "../../../../../common/widgets/select/Select";

import { OilAnalysisSourceType } from "../../domain/entities/OilAnalysisSourceType";

const sourceTypeOptions = [
  {
    value: String(OilAnalysisSourceType.PressingOperation),
    label: "Opération de pression",
  },
  {
    value: String(OilAnalysisSourceType.Tank),
    label: "Citerne",
  },
];

export default function NewOilAnalysisPage() {
  const navigate = useNavigate();

  const [sourceType, setSourceType] = useState<OilAnalysisSourceType>(
    OilAnalysisSourceType.PressingOperation,
  );

  const [sourceId, setSourceId] = useState<number | null>(null);
  const [sourceLabel, setSourceLabel] = useState("");
  const [analysisDate, setAnalysisDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // ============================================================
  // SOURCE TYPE
  // ============================================================

  const handleChangeSourceType = (value: string) => {
    setSourceType(Number(value) as OilAnalysisSourceType);
    setSourceId(null);
    setSourceLabel("");
    setError(null);
  };

  // ============================================================
  // SUBMIT
  // ============================================================

  const handleSubmit = useCallback(async () => {
    if (!sourceId) {
      setError("Sélectionnez une source valide.");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const id = await CreateOilAnalysis({
        sourceTypeId: sourceType,
        sourceId,
        analysisDate: analysisDate || undefined,
      });

      toast.success("Analyse d'huile créée avec succès.");

      navigate(`/oil-analyses/${id}`);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Impossible de créer l'analyse d'huile.";

      toast.error(message);
      setError(message);
    } finally {
      setSaving(false);
    }
  }, [sourceType, sourceId, analysisDate, navigate]);

  // ============================================================
  // CANCEL
  // ============================================================

  const handleCancel = useCallback(() => {
    if (!saving) {
      navigate("/oil-analyses");
    }
  }, [saving, navigate]);

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="feature-page">
      {/* ====================================================== */}
      {/* HEADER                                                 */}
      {/* ====================================================== */}

      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">Nouvelle analyse d'huile</h1>

          <p className="page-description">
            Créer une nouvelle analyse physico-chimique d'huile.
          </p>
        </div>
      </div>

      {/* ====================================================== */}
      {/* INFORMATIONS GÉNÉRALES                                */}
      {/* ====================================================== */}

      <div className="filters">
        <div className="filters-header">
          <div>
            <h3>Informations générales</h3>

            <span>Source et date de l'analyse</span>
          </div>
        </div>

        <div
          className="filters-content"
          style={{
            gridTemplateColumns:
              "minmax(180px, 1fr) minmax(300px, 2fr) minmax(180px, 1fr)",
            gap: "20px",
          }}
        >
          {/* ================================================== */}
          {/* TYPE DE SOURCE                                     */}
          {/* ================================================== */}

          <div className="filter-item">
            <Select
              label="Type de source"
              options={sourceTypeOptions}
              value={String(sourceType)}
              onChange={(event) => handleChangeSourceType(event.target.value)}
            />
          </div>

          {/* ================================================== */}
          {/* SOURCE                                              */}
          {/* ================================================== */}

          <div className="filter-item">
            <label>Source</label>

            {sourceType === OilAnalysisSourceType.PressingOperation ? (
              <Autocomplete
                useSearch={usePressingOperationsAutocomplete}
                getLabel={(operation) => operation.operationNumber}
                onSelect={(operation) => {
                  setSourceId(operation.id);
                  setSourceLabel(operation.operationNumber);
                  setError(null);
                }}
                placeholder="Rechercher une opération de pression..."
                width="100%"
              />
            ) : (
              <TextInput
                type="number"
                placeholder="Identifiant de la citerne"
                value={sourceId ?? ""}
                onChange={(event) => {
                  const value = event.target.value;

                  setSourceId(value === "" ? null : Number(value));

                  setSourceLabel(value);
                  setError(null);
                }}
              />
            )}

            {sourceLabel &&
              sourceType === OilAnalysisSourceType.PressingOperation && (
                <div
                  style={{
                    marginTop: "6px",
                    fontSize: "13px",
                    color: "#666",
                  }}
                >
                  Sélectionné : {sourceLabel}
                </div>
              )}

            {error && <span className="field-error">{error}</span>}
          </div>

          {/* ================================================== */}
          {/* DATE D'ANALYSE                                    */}
          {/* ================================================== */}

          <div className="filter-item">
            <TextInput
              label="Date d'analyse"
              type="date"
              value={analysisDate}
              onChange={(event) => setAnalysisDate(event.target.value)}
            />
          </div>
        </div>
      </div>

      {/* ====================================================== */}
      {/* ACTIONS                                                */}
      {/* ====================================================== */}

      <div className="filters-footer">
        <Button variant="secondary" onClick={handleCancel} disabled={saving}>
          Annuler
        </Button>

        <Button variant="primary" onClick={handleSubmit} disabled={saving}>
          {saving ? "Création..." : "Créer l'analyse"}
        </Button>
      </div>
    </div>
  );
}
