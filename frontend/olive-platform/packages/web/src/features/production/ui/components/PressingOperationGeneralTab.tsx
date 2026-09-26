import TextEditor from "../../../../common/widgets/textEditor/TextEditor";
import InfoFieldWidget from "../../../../common/widgets/InfoFieldWidget";
import TextInput from "../../../../common/widgets/textInput/TextInput";
import type { PressingOperationDetails } from "@olive-platform/core/features/production/domain/entities/PressingOperationDetails";
import type { PressingParametersDetails } from "@olive-platform/core/features/production/domain/entities/PressingParametersDetails";
import { formatDate, formatStringToDateTime } from "@olive-platform/core/features/shared/utils/DatesUtils";
import Card from "../../../../common/widgets/card/Card";
import {
  formatDeviation,
  formatFlowRate,
  formatMinutes,
  formatOilQuantity,
  formatQuantity,
  formatSpeed,
  formatTemperature,
  formatWaterQuantity,
} from "@olive-platform/core/features/shared/utils/formatter";
import { ProductionStatus } from "@olive-platform/core/features/production/domain/entities/ProductionStatus";

type Props = {
  operation: PressingOperationDetails;
  yieldPercentage: string;
  canEditOperation: boolean;
  onNotesChange: (notes: string) => void;
  onParametersChange: (parameters: PressingParametersDetails) => void;
};

export default function PressingOperationGeneralTab({
  operation,
  yieldPercentage,
  canEditOperation,
  onNotesChange,
  onParametersChange,
}: Props) {
  const parameters = operation.parameters;

  const isEditingConfiguration =
    canEditOperation && operation.status === ProductionStatus.InProgress;

  const updateParameter = <K extends keyof PressingParametersDetails>(
    field: K,
    value: PressingParametersDetails[K],
  ) => {
    if (!parameters) return;

    onParametersChange({
      ...parameters,
      [field]: value,
    });
  };

  const handleNumberChange = (
    field: keyof PressingParametersDetails,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value;

    const parsedValue = value === "" ? null : Number(value);

    updateParameter(
      field,
      Number.isNaN(parsedValue) ? null : parsedValue,
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <Card>
        <div className="filters">
          <div className="filters-header">
            <h3>Informations générales</h3>
          </div>

          <div className="info-grid">
            <InfoFieldWidget
              label="Date de planification"
              value={formatDate(operation.plannedDate)}
            />

            <InfoFieldWidget
              label="Quantité d'olives"
              value={formatQuantity(operation.oliveQuantityKg)}
            />

            <InfoFieldWidget
              label="Huile produite"
              value={formatOilQuantity(operation.oilQuantityLiters)}
            />

            <InfoFieldWidget
              label="Huile attendue"
              value={formatOilQuantity(operation.expectedOilLiters)}
            />

            <InfoFieldWidget
              label="Écart de rendement"
              value={formatDeviation(operation.oilYieldDeviationLiters)}
            />

            <InfoFieldWidget
              label="Rendement"
              value={yieldPercentage ? `${yieldPercentage} %` : "-"}
            />

            <InfoFieldWidget
              label="Date de lancement"
              value={formatStringToDateTime(operation.startTime)}
            />

            <InfoFieldWidget
              label="Date de fin"
              value={formatStringToDateTime(operation.endTime)}
            />

            <div className="filter-item" style={{ gridColumn: "1 / -1" }}>
              <span className="filter-item-label">Notes</span>
              <TextEditor
                value={operation.notes ?? ""}
                placeholder="Notes concernant l'opération..."
                onChange={onNotesChange}
              />
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="filters">
          <div className="filters-header">
            <h3>Configuration de pression</h3>
          </div>

          {!parameters ? (
            <div className="info-grid">
              <InfoFieldWidget
                label="Configuration"
                value="Aucune configuration de pression"
              />
            </div>
          ) : (
            <div className="info-grid">
              {isEditingConfiguration ? (
                <>
                  <div className="filter-item">
                    <span className="filter-item-label">
                      Température de malaxage
                    </span>
                    <TextInput
                      type="number"
                      value={parameters.malaxingTemperatureC?.toString() ?? ""}
                      onChange={(event) =>
                        handleNumberChange(
                          "malaxingTemperatureC",
                          event,
                        )
                      }
                    />
                  </div>

                  <div className="filter-item">
                    <span className="filter-item-label">
                      Durée de malaxage
                    </span>
                    <TextInput
                      type="number"
                      value={
                        parameters.malaxingDurationMinutes?.toString() ?? ""
                      }
                      onChange={(event) =>
                        handleNumberChange(
                          "malaxingDurationMinutes",
                          event,
                        )
                      }
                    />
                  </div>

                  <div className="filter-item">
                    <span className="filter-item-label">
                      Vitesse de malaxage
                    </span>
                    <TextInput
                      type="number"
                      value={parameters.malaxingSpeedRpm?.toString() ?? ""}
                      onChange={(event) =>
                        handleNumberChange(
                          "malaxingSpeedRpm",
                          event,
                        )
                      }
                    />
                  </div>

                  <div className="filter-item">
                    <span className="filter-item-label">
                      Débit d'alimentation
                    </span>
                    <TextInput
                      type="number"
                      value={parameters.feedRateKgH?.toString() ?? ""}
                      onChange={(event) =>
                        handleNumberChange("feedRateKgH", event)
                      }
                    />
                  </div>

                  <div className="filter-item">
                    <span className="filter-item-label">
                      Vitesse du décanteur
                    </span>
                    <TextInput
                      type="number"
                      value={parameters.decanterSpeedRpm?.toString() ?? ""}
                      onChange={(event) =>
                        handleNumberChange(
                          "decanterSpeedRpm",
                          event,
                        )
                      }
                    />
                  </div>

                  <div className="filter-item">
                    <span className="filter-item-label">
                      Différentiel du décanteur
                    </span>
                    <TextInput
                      type="number"
                      value={
                        parameters.decanterDifferentialRpm?.toString() ?? ""
                      }
                      onChange={(event) =>
                        handleNumberChange(
                          "decanterDifferentialRpm",
                          event,
                        )
                      }
                    />
                  </div>

                  <div className="filter-item">
                    <span className="filter-item-label">
                      Vitesse de la centrifugeuse
                    </span>
                    <TextInput
                      type="number"
                      value={parameters.centrifugeSpeedRpm?.toString() ?? ""}
                      onChange={(event) =>
                        handleNumberChange(
                          "centrifugeSpeedRpm",
                          event,
                        )
                      }
                    />
                  </div>

                  <div className="filter-item">
                    <span className="filter-item-label">
                      Eau ajoutée
                    </span>
                    <TextInput
                      type="number"
                      value={parameters.addedWaterLiters?.toString() ?? ""}
                      onChange={(event) =>
                        handleNumberChange(
                          "addedWaterLiters",
                          event,
                        )
                      }
                    />
                  </div>

                  <div className="filter-item">
                    <span className="filter-item-label">
                      Température de l'eau
                    </span>
                    <TextInput
                      type="number"
                      value={parameters.waterTemperatureC?.toString() ?? ""}
                      onChange={(event) =>
                        handleNumberChange(
                          "waterTemperatureC",
                          event,
                        )
                      }
                    />
                  </div>

                  <div className="filter-item">
                    <span className="filter-item-label">
                      Temps d'attente avant extraction
                    </span>
                    <TextInput
                      type="number"
                      value={
                        parameters.waitingTimeBeforeExtractionMinutes?.toString() ?? ""
                      }
                      onChange={(event) =>
                        handleNumberChange(
                          "waitingTimeBeforeExtractionMinutes",
                          event,
                        )
                      }
                    />
                  </div>

                  <div
                    className="filter-item"
                    style={{ gridColumn: "1 / -1" }}
                  >
                  </div>
                </>
              ) : (
                <>
                  <InfoFieldWidget
                    label="Température de malaxage"
                    value={formatTemperature(
                      parameters.malaxingTemperatureC,
                    )}
                  />

                  <InfoFieldWidget
                    label="Durée de malaxage"
                    value={formatMinutes(
                      parameters.malaxingDurationMinutes,
                    )}
                  />

                  <InfoFieldWidget
                    label="Vitesse de malaxage"
                    value={formatSpeed(
                      parameters.malaxingSpeedRpm,
                    )}
                  />

                  <InfoFieldWidget
                    label="Débit d'alimentation"
                    value={formatFlowRate(
                      parameters.feedRateKgH,
                    )}
                  />

                  <InfoFieldWidget
                    label="Vitesse du décanteur"
                    value={formatSpeed(
                      parameters.decanterSpeedRpm,
                    )}
                  />

                  <InfoFieldWidget
                    label="Différentiel du décanteur"
                    value={formatSpeed(
                      parameters.decanterDifferentialRpm,
                    )}
                  />

                  <InfoFieldWidget
                    label="Vitesse de la centrifugeuse"
                    value={formatSpeed(
                      parameters.centrifugeSpeedRpm,
                    )}
                  />

                  <InfoFieldWidget
                    label="Eau ajoutée"
                    value={formatWaterQuantity(
                      parameters.addedWaterLiters,
                    )}
                  />

                  <InfoFieldWidget
                    label="Température de l'eau"
                    value={formatTemperature(
                      parameters.waterTemperatureC,
                    )}
                  />

                  <InfoFieldWidget
                    label="Temps d'attente avant extraction"
                    value={formatMinutes(
                      parameters.waitingTimeBeforeExtractionMinutes,
                    )}
                  />
                </>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}