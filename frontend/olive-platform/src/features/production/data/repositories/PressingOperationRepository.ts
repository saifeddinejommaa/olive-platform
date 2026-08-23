import { http, type ApiResponse } from "../../../../core/HttpClient";
import type { PagedResult } from "../../../../core/PagedResult";
import { buildQueryParams } from "../../../../core/QueryUtils";
import type { PressingOperationFilters } from "../../domain/entities/PressingOperationFilters";
import { PressingOperationMapper } from "../mappers/PressingOperationMapper";
import type { PressingOperationResponse } from "../responses/PressingOperationResponse";
import { API_BASE_URL } from "../../../../constants";
import type { CreatePressingOperationParams } from "../../domain/params/CreatePressingOperationParams";
import { CreatePressingOperationMapper } from "../mappers/requests/CreatePressingOperationMapper";
import type { PressingOperationDetails } from "../../domain/entities/PressingOperationDetails";
import type { UpdatePressingOperationRequest } from "../../domain/useCases/UpdatePressingOperation";
import type { StartPressingOperationRequest } from "../requests/StartPressingOperationRequest";
import type { ClosePressingOperationRequest } from "../requests/ClosePressingOperationRequest";

export const PressingOperationRepository = {
  getAll: async (filters?: PressingOperationFilters) => {

    const params = buildQueryParams(filters as any);
    const httpResponse = await http<ApiResponse<PagedResult<PressingOperationResponse>>>(`${API_BASE_URL}pressingoperations?${params.toString()}`);
    return {
      pageNumber: httpResponse.Response.pageNumber,
      pageSize: httpResponse.Response.pageSize,
      totalCount: httpResponse.Response.totalCount,
      items: httpResponse.Response.items.map(PressingOperationMapper),
    };
  },

  createPressingOperation: async (params: CreatePressingOperationParams) => {
    var data = CreatePressingOperationMapper(params);
    console.log("data to send",data)
    return await http<ApiResponse<boolean>>(`${API_BASE_URL}pressingoperations/create`, {
      method: "POST",
      body: data
    });
  },

  getPressingOperationDetails: async(operationId: number) => {
     const response = await http<ApiResponse<PressingOperationDetails>>(`${API_BASE_URL}pressingoperations/${operationId}`, {
    });
    
    console.log(response)
    return response
  },

  updatePressingOperation: async (
    operationId: number,
    params: UpdatePressingOperationRequest
  ) => {
    return await http<ApiResponse<PressingOperationDetails>>(
      `${API_BASE_URL}pressingoperations/update?id=${operationId}`,
      {
        method: "PUT",
        body: params,
      }
    );
  },

  startPressingOperation: async (
    operationId: number,
    params: StartPressingOperationRequest
  ) => {
    return await http<ApiResponse<PressingOperationDetails>>(
      `${API_BASE_URL}pressingoperations/start?id=${operationId}`,
      {
        method: "PUT",
        body: params,
      }
    );
  },

  closePressingOperation: async (
    operationId: number,
    params: ClosePressingOperationRequest
  ) => {
    return await http<ApiResponse<number>>(
      `${API_BASE_URL}pressingoperations/close?id=${operationId}`,
      {
        method: "PUT",
        body: params,
      }
    );
  },

  cancelPressingOperation: async (
    operationId: number
  ) => {
    return await http<ApiResponse<boolean>>(
      `${API_BASE_URL}pressingoperations/cancel?id=${operationId}`,
      {
        method: "PUT",
        body: {},
      }
    );
  },
};