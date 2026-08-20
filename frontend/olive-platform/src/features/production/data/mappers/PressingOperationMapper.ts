import type { PressingOperation } from '../../domain/entities/PressingOperation'
import type { PressingOperationResponse } from '../responses/PressingOperationResponse'

export function PressingOperationMapper(

    response: PressingOperationResponse
): PressingOperation {
    return {
        id: response.id,
        operationNumber: response.operationNumber,
        startTime: response.startTime ?new Date(response.startTime): null,
        createdAt: new Date(response.createdAt),
        endTime: response.endTime?new Date(response.endTime): null,
        oilQuantityLiters: response.oilQuantityLiters,
        status: response.status as PressingOperation['status'],
        notes: response.notes
    }
}