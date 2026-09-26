import { http, type ApiResponse } from "../../../../core/HttpClient";
import type { PagedResult } from "../../../../core/PagedResult";
import { buildQueryParams } from "../../../../core/QueryUtils";
import type { PressingOperationFilters } from "../../domain/entities/PressingOperationFilters";
import type { CreatePressingOperationParams } from "../../domain/params/CreatePressingOperationParams";
import { CreatePressingOperationMapper } from "../mappers/requests/CreatePressingOperationMapper";
import type { PressingOperationDetails } from "../../domain/entities/PressingOperationDetails";
import type { StartPressingOperationRequest } from "../requests/StartPressingOperationRequest";
import type { ClosePressingOperationRequest } from "../requests/ClosePressingOperationRequest";
import type { PressingOperationInputDetails } from "../../domain/entities/PressingOperationInputDetails";
import type { UpdatePressingOperationParams } from "../../domain/params/UpdatePressingOperationParams";
import type { PressingOperationForList } from "../../domain/entities/PressingOperationForList";

export const PressingOperationRepository = {
  getAll: async (filters?: PressingOperationFilters) => {
    const params = buildQueryParams(filters as any);
    const httpResponse = await http<
      ApiResponse<PagedResult<PressingOperationForList>>
    >(`pressingoperations?${params.toString()}`);
    return {
      pageNumber: httpResponse.Response.pageNumber,
      pageSize: httpResponse.Response.pageSize,
      totalCount: httpResponse.Response.totalCount,
      items: httpResponse.Response.items,
    };
  },

  createPressingOperation: async (params: CreatePressingOperationParams) => {
    var data = CreatePressingOperationMapper(params);
     await http<ApiResponse<void>>(
      `pressingoperations/create`,
      {
        method: "POST",
        body: data,
      },
    );
  },

  getPressingOperationDetails: async (operationId: number) => {
    const response = await http<ApiResponse<PressingOperationDetails>>(
      `pressingoperations/${operationId}`,
      {},
    );
    return response;
  },

  getPressingOperationInputs: async (operationId: number) => {
    const response = await http<ApiResponse<PressingOperationInputDetails[]>>(
      `pressingoperations/${operationId}/inputs`,
      {},
    );
    return response.Response;
  },

  updatePressingOperation: async (params: UpdatePressingOperationParams) => {
    return await http<ApiResponse<void>>(
      `pressingoperations/update?id=${params.id}`,
      {
        method: "PUT",
        body: params,
      },
    );
  },

  startPressingOperation: async (
    params: StartPressingOperationRequest,
  ) => {
    return await http<ApiResponse<ApiResponse<void>>>(
      `pressingoperations/start?id=${params.operationId}`,
      {
        method: "PUT",
        body: params,
      },
    );
  },

  closePressingOperation: async (
    params: ClosePressingOperationRequest,
  ) => {
    return await http<ApiResponse<void>>(
      `pressingoperations/close?id=${params.id}`,
      {
        method: "PUT",
        body: params,
      },
    );
  },

  cancelPressingOperation: async (operationId: number) => {
    return await http<ApiResponse<boolean>>(
      `pressingoperations/cancel?id=${operationId}`,
      {
        method: "PUT",
        body: {},
      },
    );
  },
};
