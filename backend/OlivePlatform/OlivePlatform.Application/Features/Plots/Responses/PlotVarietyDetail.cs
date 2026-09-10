namespace OlivePlatform.Application.Features.Plots.Responses
{
    public class PlotVarietyDetail
    {
        public int VarietyId { get; set; }
        public string VarietyLabel { get; set; } = string.Empty;
        public int NumberOfTrees { get; set; }
        public int RemainingTreesToHarvest { get; set; }
        public double HarvestedPercentage { get; set; }
        public double PlannedTreesPercentage { get; set; }
    }
}
