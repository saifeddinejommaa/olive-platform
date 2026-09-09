import type { ProductionStatus } from "../../../production/domain/entities/ProductionStatus";
import type { PurchaseStatus } from "./PurchaseStatus";

export type OlivePurchaseForList = {
  id: number;
  reference: string;
  supplierName: string;
  purchaseDate: string;
  status: PurchaseStatus;
  createdAt: string;
  pressed: ProductionStatus;
  analyseStatus: ProductionStatus;
  quantityKg: number;
  canBePressed: boolean;
};
