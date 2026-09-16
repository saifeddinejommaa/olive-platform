// domain/entities/DashboardSummary.ts
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

export interface HarvestYieldPoint {
  date: string;
  quantityKg: number;
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

export interface DashboardSummary {
  harvestPipeline: ProductionPipeline;
  pressingPipeline: ProductionPipeline;
  treesCoverage: TreesCoverage;
  harvestYield: HarvestYieldPoint[];
  pressingComparison: PressingComparisonPoint[];
  tankOccupancy: TankOccupancy;
}