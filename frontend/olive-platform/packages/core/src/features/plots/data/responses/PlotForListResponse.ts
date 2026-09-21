export interface PlotForListResponse {
  total: number;
  id: number;
  reference: string;
  name: string;
  numberOfTrees: number;
  harvestedTreesPercentage: number;
  canLaunchHarvest: boolean;
  plannedTreesPercentage : number;

}