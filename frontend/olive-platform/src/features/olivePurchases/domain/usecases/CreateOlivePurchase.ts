import { OlivePurchaseRepository } from "../../data/repositories/OlivePurchaseRepository";
import type { CreateOlivePurchaseParams } from "../params/CreateOlivePurchaseParams";

export const CreateOlivePurchase = async (params: CreateOlivePurchaseParams) => {
   await OlivePurchaseRepository.create(params);

};
