import type { PressingOperation } from '../../domain/entities/PressingOperation'
import type { PressingOperationResponse } from '../responses/PressingOperationResponse'

export function PressingOperationMapper(
  
        response: PressingOperationResponse
    ): PressingOperation {
        return {
            id: response.id,
            pressingNumber: response.pressingNumber,
            pressingDate: response.pressingDate,
            startTime: response.startTime,
            endTime: response.endTime,
            oilQuantityLiters: response.oilQuantityLiters,
            yieldPercentage: response.yieldPercentage,
            status: response.status as PressingOperation['status']
        }
    }