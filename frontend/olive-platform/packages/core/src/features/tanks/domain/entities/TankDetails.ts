import type { ProductionStatus } from "../../../production/domain/entities/ProductionStatus";
import type { Tank } from "./Tank";

// Lot d'huile présent dans la citerne.
export type TankContent = {
  oilBatchId: number;
  batchNumber: string;
  productionDate: string;
  batchStatus: string;
  // Quantité du lot encore dans cette citerne.
  quantityLiters: number;
  pressingOperationId: number | null;
  pressingNumber: string | null;
  // Analyse d'huile de la pression d'origine.
  oilAnalysisId: number | null;
  oilAnalysisReference: string | null;
  oilAnalysisStatus: ProductionStatus | null;
  acidityPercentage: number | null;
  peroxideIndex: number | null;
  k232: number | null;
  k270: number | null;
};

// Mouvement d'huile vu depuis la citerne.
export type TankMovement = {
  id: number;
  movementNumber: string;
  movementDate: string;
  movementType: number;
  movementTypeLabel: string | null;
  isIncoming: boolean;
  quantityLiters: number;
  // Citerne d'origine (entrée) ou de destination (sortie).
  otherTankCode: string | null;
  batchNumber: string | null;
  pressingOperationId: number | null;
  pressingNumber: string | null;
};

export type TankDetails = Tank & {
  notes: string | null;
  contents: TankContent[];
  movements: TankMovement[];
};
