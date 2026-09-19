import { API_BASE_URL } from "../../../../constants";
import { http, type ApiResponse } from "../../../../core/HttpClient";
import type { Supplier } from "../../domain/entities/Supplier";

export const SupplierRepository = {
  getAll: async () => {
    
    const httpResponse = await http<
      ApiResponse<Supplier[]>
    >(`${API_BASE_URL}supplier`);
    return httpResponse.Response
  }
}