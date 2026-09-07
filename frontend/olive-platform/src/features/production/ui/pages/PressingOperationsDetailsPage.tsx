import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CheckIcon from "@mui/icons-material/Check";
import BlockIcon from "@mui/icons-material/Block";

import Button from "../../../../common/widgets/button/Button";

import { ProductionStatus } from "../../domain/entities/ProductionStatus";
import type { PressingOperationDetails } from "../../domain/entities/PressingOperationDetails";
import type { PressingOperationInputDetails } from "../../domain/entities/PressingOperationInputDetails";

import type { SourceOption } from "../widgets/SourceReference";
import type {
  InputSourceType,
  PressingOperationInput,
} from "../widgets/InputTypes";

import { usePressingOperationDetailsStore } from "../stores/PressingOperationDetailsStore";
import { usePressingOperationInputsStore } from "../stores/PressingOperationInputsStore";

import PressingOperationGeneralTab from "../components/PressingOperationGeneralTab";
import PressingOperationOlivesTab from "../components/PressingOperationOlivesTab";
import FinishPressingOperationDrawer from "../components/FinishPressingOperationDrawer";

import "./PressingOperationDetailsPage.css";
import type { PressingOperationTab } from "../components/PressingOperationTabs";
import PressingOperationTabs from "../components/PressingOperationTabs";
import type { UpdatePressingOperationParams } from "../../domain/params/UpdatePressingOperationParams";

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

  const [activeTab, setActiveTab] = useState<PressingOperationTab>("general");
  const [finishDrawerOpen, setFinishDrawerOpen] = useState(false);

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

  // Les inputs vivent uniquement dans ce store partagé : la page
  // et le tab Olives le lisent tous les deux, et les mutations
  // (ajout/suppression/quantité) passent par ses actions plutôt
  // que par un état local dupliqué ici.
  const {
    inputs,
    fetchInputs,
    addInput: addInputToStore,
    removeInput: removeInputFromStore,
    updateInputQuantity: updateInputQuantityInStore,
    resetToOriginal: resetInputsToOriginal,
    clear: clearInputs,
  } = usePressingOperationInputsStore();

  const [operation, setOperation] = useState<PressingOperationDetails | null>(
    null,
  );
  const [originalOperation, setOriginalOperation] =
    useState<PressingOperationDetails | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [newInput, setNewInput] = useState<PressingOperationInput | null>(null);
  const [newInputErrors, setNewInputErrors] = useState<Record<string, string>>(
    {},
  );

  useEffect(() => {
    const operationId = Number(id);

    if (!id || Number.isNaN(operationId)) {
      setError("Identifiant de l'opération invalide.");
      return;
    }

    fetchOperation(operationId).catch(() => {
      toast.error(
        "Impossible de charger l'opération. Une erreur API est survenue.",
      );
    });

    fetchInputs(operationId).catch(() => {
      toast.error("Impossible de charger les olives de l'opération.");
    });

    return () => {
      clear();
      clearInputs();
    };
  }, [id, fetchOperation, fetchInputs, clear, clearInputs]);

  useEffect(() => {
    if (!storeOperation) return;

    setOperation(storeOperation);
    setOriginalOperation(storeOperation);
    setDirty(false);
    setError(null);
  }, [storeOperation]);

  useEffect(() => {
    if (storeError) setError(storeError);
  }, [storeError]);

  const oliveQuantityKg = operation?.oliveQuantityKg ?? 0;

  const yieldPercentage = (() => {
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
  })();

  const isPlanned = operation?.status === ProductionStatus.Planned;
  const isInProgress = operation?.status === ProductionStatus.InProgress;
  const isCompleted = operation?.status === ProductionStatus.Completed;
  const isAbandoned = operation?.status === ProductionStatus.Cancelled;

  const canEditInputs = isPlanned;
  const canEditOperation = !isCompleted && !isAbandoned;
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
    if (!newInput) return;

    const validationErrors: Record<string, string> = {};

    if (newInput.sourceType === "harvest" && !newInput.harvestId) {
      validationErrors.input = "Sélectionnez une récolte valide.";
    }

    if (newInput.sourceType === "purchase" && !newInput.purchaseItemId) {
      validationErrors.input = "Sélectionnez un achat valide.";
    }

    if (!newInput.quantityKg || Number(newInput.quantityKg) <= 0) {
      validationErrors.quantity = "La quantité doit être supérieure à 0.";
    }

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
      analysis: null,
    };

    addInputToStore(convertedInput);
    setDirty(true);
    setNewInput(null);
    setNewInputErrors({});
    toast.success("Source ajoutée à l'opération.");
  }, [newInput, addInputToStore]);

  const handleRemoveInput = useCallback(
    (inputId: number) => {
      removeInputFromStore(inputId);
      setDirty(true);
    },
    [removeInputFromStore],
  );

  const handleUpdateInputQuantity = useCallback(
    (inputId: number, quantityKg: number) => {
      updateInputQuantityInStore(inputId, quantityKg);
      setDirty(true);
    },
    [updateInputQuantityInStore],
  );

  const handleSave = useCallback(async () => {
    if (!operation) return;

    try {
      setError(null);

      // updateOperationStore doit accepter un UpdateOperationRequest
      // incluant la liste d'inputs actuelle du store.
      const params: UpdatePressingOperationParams = {
        id: operation.id,
        startTime: operation.startTime,
        endTime: operation.endTime,
        oliveQuantityKg: operation.oliveQuantityKg,
        oilQuantityLiters: operation.oilQuantityLiters,
        notes: operation.notes,
        inputs: inputs.map((input) => ({
          harvestId: input.harvestId,
          purchaseItemId: input.purchaseItemId,
          quantityKg: input.quantityKg,
        })),
      };
      await updateOperationStore(params);

      setDirty(false);
      toast.success("Opération enregistrée avec succès.");
    } catch {
      toast.error("Impossible d'enregistrer les modifications.");
    }
  }, [operation, inputs, updateOperationStore]);

  const handleCancel = useCallback(() => {
    if (!originalOperation) return;

    setOperation(originalOperation);
    resetInputsToOriginal();
    setNewInput(null);
    setNewInputErrors({});
    setDirty(false);
  }, [originalOperation, resetInputsToOriginal]);

  const handleStart = useCallback(async () => {
    if (!operation) return;

    const missingAnalysisCount = inputs.filter(
      (input) => !input.analysis,
    ).length;

    if (missingAnalysisCount > 0) {
      toast.warning(
        missingAnalysisCount === 1
          ? "Attention : une source d'olives n'a pas encore d'analyse."
          : `Attention : ${missingAnalysisCount} sources d'olives n'ont pas encore d'analyse.`,
      );
    }

    try {
      setError(null);
      await startOperationStore(operation.id);
      toast.success("La pression a été lancée.");
    } catch {
      toast.error("Impossible de lancer l'opération de pression.");
    }
  }, [operation, inputs, startOperationStore]);

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
      toast.error("Impossible d'abandonner l'opération de pression.");
    }
  }, [operation, cancelOperationStore]);

  const handleOpenFinishDrawer = useCallback(() => {
    if (!operation) return;
    setFinishDrawerOpen(true);
  }, [operation]);

  const handleCloseFinishDrawer = useCallback(() => {
    if (!completing) setFinishDrawerOpen(false);
  }, [completing]);

  const handleConfirmFinish = useCallback(
    async (oilQuantityLiters: number, proceedOilAnalysis: boolean) => {
      if (!operation) return;

      try {
        setError(null);
        await completeOperationStore({
          id: operation.id,
          oliveQuantity: oilQuantityLiters,
          endDate: new Date().toISOString(),
          proceedOilAnalysis: proceedOilAnalysis,
        });

        setFinishDrawerOpen(false);
        toast.success("La pression a été clôturée.");
      } catch {
        toast.error("Impossible de clôturer l'opération de pression.");
      }
    },
    [operation, completeOperationStore],
  );

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
            <ArrowBackIcon fontSize="small" />
            Retour
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
            <ArrowBackIcon fontSize="small" />
            Retour
          </Button>

          {isPlanned && (
            <>
              <Button
                variant="secondary"
                onClick={handleAbandon}
                disabled={saving || starting || cancelling}
              >
                <BlockIcon fontSize="small" />
                {cancelling ? "Abandon..." : "Abandonner la pression"}
              </Button>

              <Button
                variant="primary"
                onClick={handleStart}
                disabled={saving || starting || cancelling}
              >
                <PlayArrowIcon fontSize="small" />
                {starting ? "Lancement..." : "Lancer la pression"}
              </Button>
            </>
          )}

          {isInProgress && (
            <Button
              variant="primary"
              onClick={handleOpenFinishDrawer}
              disabled={saving || completing}
            >
              <CheckIcon fontSize="small" />
              Clôturer la pression
            </Button>
          )}
        </div>
      </div>

      <PressingOperationTabs activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === "general" && (
        <PressingOperationGeneralTab
          operation={operation}
          yieldPercentage={yieldPercentage}
          onNotesChange={(notes) => updateOperation("notes", notes)}
          canEditOperation={canEditOperation}
        />
      )}

      {activeTab === "olives" && (
        <PressingOperationOlivesTab
          operation={operation}
          canEditInputs={canEditInputs}
          saving={saving}
          newInput={newInput}
          newInputErrors={newInputErrors}
          onOpenAddInput={() => setNewInput(emptyInput())}
          onCancelAddInput={() => {
            setNewInput(null);
            setNewInputErrors({});
          }}
          onUpdateInputQuantity={handleUpdateInputQuantity}
          onRemoveInput={handleRemoveInput}
          onUpdateNewInput={(inputId, field, value) => {
            if (String(inputId) !== String(newInput?.id)) return;
            handleUpdateNewInput(field, value);
          }}
          onChangeNewInputSource={(inputId, sourceType) => {
            if (String(inputId) !== String(newInput?.id)) return;
            handleChangeNewInputSource(sourceType);
          }}
          onSelectNewInputSource={(inputId, source) => {
            if (String(inputId) !== String(newInput?.id)) return;
            handleSelectNewInputSource(source);
          }}
          onConfirmAddInput={handleConfirmAddInput}
        />
      )}

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

      <FinishPressingOperationDrawer
        open={finishDrawerOpen}
        saving={completing}
        operation={operation}
        inputs={inputs}
        onClose={handleCloseFinishDrawer}
        onConfirm={handleConfirmFinish}
      />
    </div>
  );
}
