import type { CreatePressingOperationParams } from "../../../domain/params/CreatePressingOperationParams";
import type { CreatePressingOperationRequest } from "../../requests/CreatePressingOperationRequest";


export function CreatePressingOperationMapper(
  data: CreatePressingOperationParams
): CreatePressingOperationRequest {

  return {
    operationReference: data.operationReference,
    createdAt : data.createdAt,
    startTime:
      data.startTime,

    endTime:
      data.endTime,

    status:
      data.status,

    oliveQuantityKg:
      data.oliveQuantityKg,

    oilQuantityLiters:
      data.oilQuantityLiters,

    notes:
      data.notes,

    inputs:
      data.inputs.map(
        input => ({
          harvestId:
            input.harvestId,

          purchaseItemId:
            input.purchaseItemId,

          quantityKg:
            Number(
              input.quantityKg
            ),
        })
      ),
  }
}