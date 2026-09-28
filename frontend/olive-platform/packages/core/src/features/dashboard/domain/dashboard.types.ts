export interface ProductionPipeline {
  plannedCount: number;
  inProgressCount: number;
  completedCount: number;
}

export interface TreesCoverage {
  totalTrees: number;
  harvestedTrees: number;
  plannedTrees: number;
  notHarvestedTrees: number;
}

export interface PressingComparisonPoint {
  operationNumber: string;
  actualLiters: number | null;
  expectedLiters: number | null;
  deviationLiters: number | null;
}

export interface TankOccupancy {
  totalCapacityLiters: number;
  currentLevelLiters: number;
  occupancyPercentage: number;
}

export interface ChargesCoverage {
  totalAmount: number;
  paidAmount: number;
  unpaidAmount: number;
}

// Lots d'olives de la campagne, répartis par état (en kg).
export interface OliveLotsOverview {
  totalLots: number;
  totalKg: number;
  harvestKg: number;
  purchaseKg: number;
  // Pressions terminées.
  pressedKg: number;
  pressedLots: number;
  // Réservé par une pression planifiée ou en cours.
  inPressingKg: number;
  inPressingLots: number;
  // Restant pressable (analyse terminée ou non requise).
  readyKg: number;
  readyLots: number;
  // Restant bloqué : analyse requise mais non terminée.
  pendingAnalysisKg: number;
  pendingAnalysisLots: number;
}

export interface DashboardSummary {
  harvestPipeline: ProductionPipeline;
  pressingPipeline: ProductionPipeline;
  treesCoverage: TreesCoverage;
  oliveLots: OliveLotsOverview;
  pressingComparison: PressingComparisonPoint[];
  tankOccupancy: TankOccupancy;
  chargesCoverage: ChargesCoverage;
}
