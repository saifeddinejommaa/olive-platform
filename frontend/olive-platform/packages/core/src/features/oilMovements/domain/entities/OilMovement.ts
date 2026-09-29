// Types de mouvement (table oil_movement_type).
export const OilMovementType = {
  ProductionIn: 1,
  Transfer: 2,
  SaleOut: 3,
  Adjustment: 4,
} as const;

export type OilMovementType = (typeof OilMovementType)[keyof typeof OilMovementType];

export type OilMovement = {
  id: number;
  movementNumber: string;
  movementType: OilMovementType;
  movementTypeLabel: string | null;
  movementDate: string;
  oilBatchId: number | null;
  oilBatchNumber: string | null;
  // Pression d'origine du lot d'huile.
  pressingOperationId: number | null;
  pressingNumber: string | null;
  sourceTankId: number | null;
  sourceTankCode: string | null;
  sourceTankName: string | null;
  destinationTankId: number | null;
  destinationTankCode: string | null;
  destinationTankName: string | null;
  quantityLiters: number;
  notes: string | null;
};

export type OilMovementsFilter = {
  // N° de mouvement, lot d'huile ou pression.
  search?: string;
  movementType?: OilMovementType;
  // Citerne d'origine ou de destination.
  tankId?: number;
  fromDate?: string;
  toDate?: string;
  pageNumber?: number;
  pageSize?: number;
};

// Transfert de l'huile analysée, de la citerne tampon vers le stockage.
export type TransferOilToStorageParams = {
  oilAnalysisId: number;
  destinationTankId: number;
  notes?: string;
};

// Transfert entre deux citernes de stockage de la même catégorie.
export type TransferOilBetweenTanksParams = {
  sourceTankId: number;
  destinationTankId: number;
  quantityLiters: number;
  notes?: string;
};
