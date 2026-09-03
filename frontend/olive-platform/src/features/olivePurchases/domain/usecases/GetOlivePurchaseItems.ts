import { OlivePurchaseRepository } from "../../data/repositories/OlivePurchaseRepository";

export const GetOlivePurchaseItems = async (
  purchaseId: number,
) => {
  const olivePurchaseItems = await OlivePurchaseRepository.getPurchaseItemsById(
    purchaseId,
  );

  return olivePurchaseItems;
};
