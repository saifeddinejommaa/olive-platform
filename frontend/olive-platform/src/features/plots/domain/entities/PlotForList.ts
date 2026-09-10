export interface PlotForList {
  id: number;
  reference: string;
  name: string;
  numberOfTrees: number;
  harvestedTreesPercentage: number;
  plannedTreesPercentage : number;
  canLaunchHarvest: boolean;
}