import { http, type ApiResponse } from "../../../../core/HttpClient";
import type { AppConstants } from "../../domain/models/AppConstants";
import { mapConstantsResponseToModel } from "../mappers/AppConstantsMapper";
import type { AppConstantsResponse } from "../responses/AppConstantsResponse";

export const AppConstantsRepository = {
  getAll: async (): Promise<AppConstants> => {
    const httpResponse = await http<ApiResponse<AppConstantsResponse>>(
      `appconstants`,
    );
    const constantsResponse = httpResponse.Response;
    return mapConstantsResponseToModel(constantsResponse);
  },
};
