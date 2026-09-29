import { http, type ApiResponse } from "../../../../core/HttpClient";
import { buildQueryParams } from "../../../../core/QueryUtils";
import type {
  Customer,
  CustomersFilter,
  SaveCustomerParams,
} from "../../domain/entities/Customer";

export const CustomerRepository = {
  getCustomers: async (filter?: CustomersFilter): Promise<Customer[]> => {
    const params = buildQueryParams((filter ?? {}) as any);
    const response = await http<ApiResponse<Customer[]>>(`customers?${params.toString()}`);

    return response.Response;
  },

  // Retourne l'identifiant du client créé.
  create: async (params: SaveCustomerParams): Promise<number> => {
    const response = await http<ApiResponse<number>>(`customers`, {
      method: "POST",
      body: params,
    });

    return response.Response;
  },

  update: async (id: number, params: SaveCustomerParams): Promise<void> => {
    await http<ApiResponse<number>>(`customers/${id}`, {
      method: "PUT",
      body: params,
    });
  },
};
