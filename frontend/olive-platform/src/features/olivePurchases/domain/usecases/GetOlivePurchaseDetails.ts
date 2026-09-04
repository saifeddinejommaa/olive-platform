import { OlivePurchaseRepository } from "../../data/repositories/OlivePurchaseRepository";

export const GetOlivePurchaseDetails = async (
  purchaseId: number,
) => {
  const details = await OlivePurchaseRepository.getPurchaseDetails(
    purchaseId
  );

  return details;
};