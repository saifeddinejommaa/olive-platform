import type { ProductionStatus } from "../../../production/domain/entities/ProductionStatus";
import type { PurchaseStatus } from "../../domain/entities/PurchaseStatus";

export type OlivePurchaseForListResponse = {
  id: number;
  reference: string;
  supplierName: string;
  purchaseDate: string;
  status: PurchaseStatus;
  createdAt: string;
  pressed: ProductionStatus;
  analyseStatus: ProductionStatus;
  totalQuantityKg: number;
  canLaunchPression: boolean;
};