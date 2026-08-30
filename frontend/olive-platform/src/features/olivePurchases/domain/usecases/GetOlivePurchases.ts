import { OlivePurchaseRepository } from "../../data/repositories/OlivePurchaseRepository";
import type { OlivePurchasesFilter } from "../entities/OlivePurchaseFilter";

export const GetOlivePurchases = async (filters?: OlivePurchasesFilter) => {
  const olivePruchases = await OlivePurchaseRepository.getAll(filters);

  return olivePruchases;
};
