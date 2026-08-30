import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CheckIcon from "@mui/icons-material/Check";
import AddIcon from "@mui/icons-material/Add";
import BlockIcon from "@mui/icons-material/Block";
import Button from "../../../../common/widgets/button/Button";
import TextInput from "../../../../common/widgets/textInput/TextInput";
import TextEditor from "../../../../common/widgets/textEditor/TextEditor";
import { renderStatus } from "../../../shared/utils/StatusUtils";
import { productionStatusConfig } from "../../../shared/status/ProductionStatusConfig";
import { ProductionStatus } from "../../domain/entities/ProductionStatus";
import type { PressingOperationDetails } from "../../domain/entities/PressingOperationDetails";
import type { PressingOperationInputDetails } from "../../domain/entities/PressingOperationInputDetails";
import type { SourceOption } from "../widgets/SourceReference";
import type {
  InputSourceType,
  PressingOperationInput,
} from "../widgets/InputTypes";
import NewPressingOperationInputsWidget from "../widgets/NewPressingOperationInputsWidget";
import { usePressingOperationDetailsStore } from "../stores/PressingOperationDetailsStore";
import "./PressingOperationDetailsPage.css";
import { toDateTime } from "../../../shared/utils/DatesUtils";

const cloneOperation = (
  operation: PressingOperationDetails,
): PressingOperationDetails => ({
  ...operation,
  inputs: operation.inputs.map((input) => ({ ...input })),
});

const emptyInput = (): PressingOperationInput => ({
  id: crypto.randomUUID(),
  sourceType: "harvest",
  harvestId: null,
  purchaseItemId: null,
  reference: "",
  quantityKg: "",
  notes: "",
});

export default function PressingOperationDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    operation: storeOperation,
    loading,
    error: storeError,
    saving,
    starting,
    completing,
    cancelling,
    fetchOperation,
    updateOperation: updateOperationStore,
    startOperation: startOperationStore,
    completeOperation: completeOperationStore,
    cancelOperation: cancelOperationStore,
    clear,
  } = usePressingOperationDetailsStore();

  const [operation, setOperation] = useState<PressingOperationDetails | null>(
    null,
  );
  const [originalOperation, setOriginalOperation] =
    useState<PressingOperationDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [showAddInput, setShowAddInput] = useState(false);
  const [newInput, setNewInput] = useState<PressingOperationInput | null>(null);
  const [newInputErrors, setNewInputErrors] = useState<Record<string, string>>(
    {},
  );

  useEffect(() => {
    const operationId = Number(id);
    if (!id || Number.isNaN(operationId)) {
      setError("Identifiant de l’opération invalide.");
      return;
    }

    fetchOperation(operationId).catch(() => {
      toast.error(
        "Impossible de charger l’opération. Une erreur API est survenue.",
      );
    });

    return () => clear();
  }, [id, fetchOperation, clear]);

  useEffect(() => {
    if (!storeOperation) return;

    const data = cloneOperation(storeOperation);
    setOperation(data);
    setOriginalOperation(cloneOperation(data));
    setDirty(false);
    setError(null);
  }, [storeOperation]);

  useEffect(() => {
    if (storeError) setError(storeError);
  }, [storeError]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const oliveQuantityKg = useMemo(
    () =>
      operation?.inputs.reduce(
        (total, input) => total + Number(input.quantityKg || 0),
        0,
      ) ?? 0,
    [operation],
  );

  const yieldPercentage = useMemo(() => {
    if (
      !operation ||
      oliveQuantityKg <= 0 ||
      operation.oilQuantityLiters == null
    )
      return "";
    return (
      (Number(operation.oilQuantityLiters) / oliveQuantityKg) *
      100
    ).toFixed(2);
  }, [operation, oliveQuantityKg]);

  const isPlanned = operation?.status === ProductionStatus.Planned;
  const isInProgress = operation?.status === ProductionStatus.InProgress;
  const isCompleted = operation?.status === ProductionStatus.Completed;
  const isAbandoned = operation?.status === ProductionStatus.Cancelled;
  const canEditInputs = isPlanned;
  const canEditOperation = !isCompleted && !isAbandoned;
  const canEditOil = isInProgress;
  const isBusy = saving || starting || completing || cancelling;

  const handleBack = useCallback(() => navigate("/production"), [navigate]);

  const updateOperation = useCallback(
    <K extends keyof PressingOperationDetails>(
      field: K,
      value: PressingOperationDetails[K],
    ) => {
      setOperation((previous) =>
        previous ? { ...previous, [field]: value } : null,
      );
      setDirty(true);
    },
    [],
  );

  const updateInputQuantity = useCallback(
    (inputId: number, quantityKg: number) => {
      setOperation(
        (previous) =>
          previous && {
            ...previous,
            inputs: previous.inputs.map((input) =>
              input.id === inputId ? { ...input, quantityKg } : input,
            ),
          },
      );
      setDirty(true);
    },
    [],
  );

  const handleOpenAddInput = useCallback(() => {
    setNewInput(emptyInput());
    setNewInputErrors({});
    setShowAddInput(true);
  }, []);

  const handleCancelAddInput = useCallback(() => {
    setShowAddInput(false);
    setNewInput(null);
    setNewInputErrors({});
  }, []);

  const handleUpdateNewInput = useCallback(
    (field: keyof PressingOperationInput, value: string | number | null) => {
      setNewInput(
        (previous) =>
          previous && {
            ...previous,
            [field]: field === "quantityKg" ? String(value ?? "") : value,
          },
      );

      setNewInputErrors((previous) => {
        const next = { ...previous };
        if (field === "reference") delete next.input;
        if (field === "quantityKg") delete next.quantity;
        return next;
      });
    },
    [],
  );

  const handleChangeNewInputSource = useCallback(
    (sourceType: InputSourceType) => {
      setNewInput(
        (previous) =>
          previous && {
            ...previous,
            sourceType,
            harvestId: null,
            purchaseItemId: null,
            reference: "",
            quantityKg: "",
          },
      );

      setNewInputErrors({});
    },
    [],
  );

  const handleSelectNewInputSource = useCallback((source: SourceOption) => {
    setNewInput((previous) => {
      if (!previous) return previous;

      const quantity =
        source.quantityKg !== undefined
          ? String(source.quantityKg)
          : previous.quantityKg;

      return previous.sourceType === "harvest"
        ? {
            ...previous,
            harvestId: source.id,
            purchaseItemId: null,
            reference: source.reference,
            quantityKg: quantity,
          }
        : {
            ...previous,
            harvestId: null,
            purchaseItemId: source.id,
            reference: source.reference,
            quantityKg: quantity,
          };
    });

    setNewInputErrors((previous) => {
      const next = { ...previous };
      delete next.input;
      delete next.quantity;
      return next;
    });
  }, []);

  const handleConfirmAddInput = useCallback(() => {
    if (!operation || !newInput) return;

    const validationErrors: Record<string, string> = {};

    if (newInput.sourceType === "harvest" && !newInput.harvestId)
      validationErrors.input = "Sélectionnez une récolte valide.";
    if (newInput.sourceType === "purchase" && !newInput.purchaseItemId)
      validationErrors.input = "Sélectionnez un achat valide.";
    if (!newInput.quantityKg || Number(newInput.quantityKg) <= 0)
      validationErrors.quantity = "La quantité doit être supérieure à 0.";

    if (Object.keys(validationErrors).length > 0) {
      setNewInputErrors(validationErrors);
      toast.error("Veuillez corriger les erreurs de la source.");
      return;
    }

    const convertedInput: PressingOperationInputDetails = {
      id: Date.now() + Math.floor(Math.random() * 10000),
      sourceType: newInput.sourceType,
      sourceReference: newInput.reference,
      quantityKg: Number(newInput.quantityKg),
      harvestId: newInput.sourceType === "harvest" ? newInput.harvestId : null,
      purchaseItemId:
        newInput.sourceType === "purchase" ? newInput.purchaseItemId : null,
    };

    setOperation(
      (previous) =>
        previous && {
          ...previous,
          inputs: [...previous.inputs, convertedInput],
        },
    );
    setDirty(true);
    setShowAddInput(false);
    setNewInput(null);
    setNewInputErrors({});
    toast.success("Source ajoutée à l’opération.");
  }, [operation, newInput]);

  const handleRemoveInput = useCallback((inputId: number) => {
    setOperation(
      (previous) =>
        previous && {
          ...previous,
          inputs: previous.inputs.filter((input) => input.id !== inputId),
        },
    );
    setDirty(true);
  }, []);

  const handleSave = useCallback(async () => {
    if (!operation) return;

    try {
      setError(null);
      await updateOperationStore(operation);
      setDirty(false);
      toast.success("Opération enregistrée avec succès.");
    } catch {
      toast.error("Impossible d’enregistrer les modifications.");
    }
  }, [operation, updateOperationStore]);

  const handleCancel = useCallback(() => {
    if (!originalOperation) return;

    setOperation(cloneOperation(originalOperation));
    setShowAddInput(false);
    setNewInput(null);
    setNewInputErrors({});
    setDirty(false);
  }, [originalOperation]);

  const handleStart = useCallback(async () => {
    if (!operation) return;

    try {
      setError(null);
      await startOperationStore(operation.id);
      toast.success("La pression a été lancée.");
    } catch {
      toast.error("Impossible de lancer l’opération de pression.");
    }
  }, [operation, startOperationStore]);

  const handleAbandon = useCallback(async () => {
    if (!operation) return;
    if (
      !window.confirm(
        "Voulez-vous vraiment abandonner cette opération de pression ?",
      )
    )
      return;

    try {
      setError(null);
      await cancelOperationStore(operation.id);
      toast.success("La pression a été abandonnée.");
    } catch {
      toast.error("Impossible d’abandonner l’opération de pression.");
    }
  }, [operation, cancelOperationStore]);

  const handleFinish = useCallback(async () => {
    if (!operation) return;

    const oilQuantity = Number(operation.oilQuantityLiters);
    if (!Number.isFinite(oilQuantity) || oilQuantity <= 0) {
      toast.error("Veuillez renseigner une quantité d’huile produite valide.");
      return;
    }

    try {
      setError(null);
      await completeOperationStore(operation.id, oilQuantity);
      toast.success("La pression a été clôturée.");
    } catch {
      toast.error("Impossible de clôturer l’opération de pression.");
    }
  }, [operation, completeOperationStore]);

  if (loading) {
    return (
      <div className="feature-page">
        <div className="page-header">
          <div className="page-header-content">
            <h1 className="page-title">Opération de pression</h1>
            <p className="page-description">Chargement des détails...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !operation) {
    return (
      <div className="feature-page">
        <div className="page-header">
          <div className="page-header-content">
            <h1 className="page-title">Opération de pression</h1>
            <p className="page-description">
              {error ?? "Opération introuvable."}
            </p>
          </div>
        </div>

        <div className="filters-footer">
          <Button variant="secondary" onClick={handleBack}>
            <ArrowBackIcon fontSize="small" /> Retour
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="feature-page">
      <div className="page-header">
        <div className="page-header-content">
          <h1 className="page-title">Opération {operation.operationNumber}</h1>
          <p className="page-description">
            Gestion de l'opération de pression.
          </p>
        </div>

        <div className="pressing-page-actions">
          <Button variant="secondary" onClick={handleBack} disabled={isBusy}>
            <ArrowBackIcon fontSize="small" /> Retour
          </Button>

          {isPlanned && (
            <>
              <Button
                variant="secondary"
                onClick={handleAbandon}
                disabled={saving || starting || cancelling}
              >
                <BlockIcon fontSize="small" />{" "}
                {cancelling ? "Abandon..." : "Abandonner la pression"}
              </Button>

              <Button
                variant="primary"
                onClick={handleStart}
                disabled={saving || starting || cancelling}
              >
                <PlayArrowIcon fontSize="small" />{" "}
                {starting ? "Lancement..." : "Lancer la pression"}
              </Button>
            </>
          )}

          {isInProgress && (
            <Button
              variant="primary"
              onClick={handleFinish}
              disabled={saving || completing}
            >
              <CheckIcon fontSize="small" />{" "}
              {completing ? "Clôture..." : "Clôturer la pression"}
            </Button>
          )}
        </div>
      </div>

      <div className="filters">
        <div className="filters-header">
          <div>
            <h3>Informations générales</h3>
            <span>Informations relatives à l'opération de pression</span>
          </div>
        </div>

        <div className="filters-content">
          <div className="filter-item">
            <label>Date de planification</label>
            <TextInput
              type="date"
              value={
                operation.pressingDate
                  ? operation.pressingDate.slice(0, 10)
                  : ""
              }
              disabled={!canEditOperation || saving}
              onChange={(event) =>
                updateOperation(
                  "pressingDate",
                  toDateTime(
                    event.target.value,
                  ) as PressingOperationDetails["pressingDate"],
                )
              }
            />
          </div>

          <div className="filter-item">
            <label>Statut</label>
            <div>{renderStatus(operation.status, productionStatusConfig)}</div>
          </div>

          <div className="filter-item">
            <label>Quantité d'olives</label>
            <TextInput
              type="number"
              value={oliveQuantityKg}
              disabled
              onChange={() => undefined}
            />
          </div>

          <div className="filter-item">
            <label>Huile produite</label>
            <TextInput
              type="number"
              value={operation.oilQuantityLiters ?? ""}
              disabled={!canEditOil || saving}
              onChange={(event) =>
                updateOperation(
                  "oilQuantityLiters",
                  event.target.value === "" ? null : Number(event.target.value),
                )
              }
            />
          </div>

          <div className="filter-item">
            <label>Rendement</label>
            <TextInput
              type="text"
              value={yieldPercentage ? `${yieldPercentage} %` : ""}
              disabled
              onChange={() => undefined}
            />
          </div>

          <div className="filter-item">
            <label>Date de lancement</label>
            <TextInput
              type="date"
              value={
                operation.startTime ? operation.startTime.slice(0, 10) : ""
              }
              disabled
              onChange={() => undefined}
            />
          </div>

          <div className="filter-item">
            <label>Date de fin</label>
            <TextInput
              type="date"
              value={operation.endTime ? operation.endTime.slice(0, 10) : ""}
              disabled
              onChange={() => undefined}
            />
          </div>

          <div className="filter-item filter-item-full">
            <label>Notes</label>
            <TextEditor
              value={operation.notes ?? ""}
              placeholder="Notes concernant l'opération..."
              onChange={(value) => updateOperation("notes", value)}
              disabled={!canEditOperation || saving}
            />
          </div>
        </div>
      </div>

      <div
        className={`filters ${isInProgress ? "pressing-inputs-disabled" : ""}`}
      >
        <div className="filters-header">
          <div>
            <h3>Olives utilisées</h3>
            <span>
              Sources d'olives utilisées pour cette opération de pression
            </span>
          </div>

          {canEditInputs && !showAddInput && (
            <div className="pressing-add-button">
              <Button
                variant="secondary"
                onClick={handleOpenAddInput}
                disabled={saving}
              >
                <AddIcon fontSize="small" /> Ajouter
              </Button>
            </div>
          )}
        </div>

        <div className="filters-content">
          {operation.inputs.length === 0 ? (
            <div className="pressing-empty-inputs">Aucune source d'olives.</div>
          ) : (
            <div className="pressing-table-container">
              <table className="pressing-inputs-table">
                <thead>
                  <tr>
                    <th className="pressing-table-cell-left">Type</th>
                    <th className="pressing-table-cell-left">Référence</th>
                    <th className="pressing-table-cell-right">Quantité</th>
                    {canEditInputs && (
                      <th className="pressing-table-actions-header" />
                    )}
                  </tr>
                </thead>

                <tbody>
                  {operation.inputs.map((input) => (
                    <tr key={input.id}>
                      <td className="pressing-table-cell">
                        {input.sourceType === "harvest" ? "Récolte" : "Achat"}
                      </td>
                      <td className="pressing-table-cell">
                        {input.sourceReference}
                      </td>
                      <td className="pressing-table-cell pressing-table-quantity">
                        <div className="pressing-quantity-input">
                          <TextInput
                            type="number"
                            value={input.quantityKg}
                            disabled={!canEditInputs || saving}
                            onChange={(event) =>
                              updateInputQuantity(
                                input.id,
                                Number(event.target.value),
                              )
                            }
                          />
                          <span>kg</span>
                        </div>
                      </td>

                      {canEditInputs && (
                        <td className="pressing-table-cell pressing-table-remove">
                          <Button
                            variant="secondary"
                            onClick={() => handleRemoveInput(input.id)}
                            disabled={saving}
                          >
                            Supprimer
                          </Button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>

                <tfoot>
                  <tr>
                    <td colSpan={2} className="pressing-table-total-label">
                      Total
                    </td>
                    <td className="pressing-table-total-value">
                      {oliveQuantityKg.toLocaleString("fr-FR")} kg
                    </td>
                    {canEditInputs && <td />}
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>

        {showAddInput && newInput && canEditInputs && (
          <div className="pressing-new-input">
            <div className="pressing-new-input-header">
              <h3>Nouvelle source</h3>
              <span>
                Sélectionnez la récolte ou l'achat à utiliser pour cette
                pression.
              </span>
            </div>

            <NewPressingOperationInputsWidget
              inputs={[newInput]}
              errors={newInputErrors}
              onAdd={() => undefined}
              onRemove={() => undefined}
              onUpdate={(inputId, field, value) => {
                if (inputId === newInput.id) handleUpdateNewInput(field, value);
              }}
              onChangeSource={(inputId, sourceType) => {
                if (inputId === newInput.id)
                  handleChangeNewInputSource(sourceType);
              }}
              onSelectSource={(inputId, source) => {
                if (inputId === newInput.id) handleSelectNewInputSource(source);
              }}
              showAddButton={false}
            />

            <div className="filters-footer pressing-new-input-footer">
              <Button
                variant="secondary"
                onClick={handleCancelAddInput}
                disabled={saving}
              >
                Annuler
              </Button>

              <Button
                variant="primary"
                onClick={handleConfirmAddInput}
                disabled={saving || !newInput}
              >
                <AddIcon fontSize="small" /> Ajouter la source
              </Button>
            </div>
          </div>
        )}
      </div>

      {error && <div className="field-error pressing-error">{error}</div>}

      {canEditOperation && (
        <div className="filters-footer">
          <Button
            variant="secondary"
            onClick={handleCancel}
            disabled={!dirty || saving || isBusy}
          >
            Annuler
          </Button>

          <Button
            variant="primary"
            onClick={handleSave}
            disabled={!dirty || saving || isBusy}
          >
            {saving ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
      )}
    </div>
  );
}
