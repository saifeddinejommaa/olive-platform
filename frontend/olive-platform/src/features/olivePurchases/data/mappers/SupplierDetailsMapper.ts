import type { SupplierDetails } from "../../domain/entities/SupplierDetails";
import type { SupplierDetailsResponse } from "../responses/SupplierDetailsResponse";

export function SupplierDetailsMapper(
  response: SupplierDetailsResponse|null,
): SupplierDetails | null {
    if(response === null){
        return null;
    }
  return {
    id: response.id,
    reference: response.reference,
    address: response.address,
    name: response.name,
    phone: response.phone,
  };
}