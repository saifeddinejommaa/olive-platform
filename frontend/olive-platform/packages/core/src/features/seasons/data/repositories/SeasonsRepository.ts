import { http, type ApiResponse } from "../../../../core/HttpClient";
import type { PagedResult } from "../../../../core/PagedResult";
import type { Season } from "../../domain/entities/Season";
import { SeasonMapper } from "../mappers/SeasonMapper";
import type { SeasonResponse } from "../responses/SeasonResponse";

export const SeasonsRepository = {
  getAll: async (): Promise<Season[]> => {
    const httpResponse = await http<ApiResponse<PagedResult<SeasonResponse>>>(
      `seasons?pageNumber=1&pageSize=100`,
      { withSeason: false },
    );

    return httpResponse.Response.items.map(SeasonMapper);
  },
};
