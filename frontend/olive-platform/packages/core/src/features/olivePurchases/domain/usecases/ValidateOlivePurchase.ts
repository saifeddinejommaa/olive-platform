import { OlivePurchaseRepository } from "../../data/repositories/OlivePurchaseRepository";

export const ValidateOlivePurchase = async (
  id: number,
) => {
  await OlivePurchaseRepository.validate(id);
};