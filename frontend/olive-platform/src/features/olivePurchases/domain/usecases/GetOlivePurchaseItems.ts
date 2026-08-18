import { OlivePurchaseRepository } from "../../data/repositories/OlivePurchaseRepository";
import type { OlivePurchaseItemsFilter } from "../entities/OlivePurchaseItemsFilter";

export const GetOlivePurchaseItems = async (purchaseId: number,filters?: OlivePurchaseItemsFilter) => {
  const harvests = await OlivePurchaseRepository.getPurchaseItemsById(purchaseId,filters);

  return harvests;
};