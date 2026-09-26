import type { Season } from "../../domain/entities/Season";
import type { SeasonStatus } from "../../domain/entities/SeasonStatus";
import type { SeasonResponse } from "../responses/SeasonResponse";

export function SeasonMapper(response: SeasonResponse): Season {
  return {
    id: response.id,
    label: response.label,
    startDate: response.startDate,
    endDate: response.endDate,
    status: response.status as SeasonStatus,
    isCurrent: response.isCurrent,
  };
}
