// Application/Features/Dashboard/Responses/DashboardSummaryResponse.cs
namespace OlivePlatform.Application.Features.Dashboard.Responses
{
    public class ProductionPipelineResponse
    {
        public int PlannedCount { get; set; }
        public int InProgressCount { get; set; }
        public int CompletedCount { get; set; }
    }

    public class TreesCoverageResponse
    {
        public int TotalTrees { get; set; }
        public int HarvestedTrees { get; set; }
        public int PlannedTrees { get; set; }

        // calculé en C#, jamais négatif
        public int NotHarvestedTrees =>
            Math.Max(TotalTrees - HarvestedTrees - PlannedTrees, 0);
    }

    public class HarvestYieldPointResponse
    {
        public DateOnly Date { get; set; }
        public decimal QuantityKg { get; set; }
    }

    public class PressingComparisonPointResponse
    {
        public string OperationNumber { get; set; } = null!;
        public decimal? ActualLiters { get; set; }
        public decimal? ExpectedLiters { get; set; }
        public decimal? DeviationLiters { get; set; }
    }

    public class TankOccupancyResponse
    {
        public decimal TotalCapacityLiters { get; set; }
        public decimal CurrentLevelLiters { get; set; }

        public decimal OccupancyPercentage =>
            TotalCapacityLiters <= 0
                ? 0
                : Math.Round(CurrentLevelLiters * 100m / TotalCapacityLiters, 2);
    }

    public class DashboardSummaryResponse
    {
        public ProductionPipelineResponse HarvestPipeline { get; set; } = null!;
        public ProductionPipelineResponse PressingPipeline { get; set; } = null!;
        public TreesCoverageResponse TreesCoverage { get; set; } = null!;
        public List<HarvestYieldPointResponse> HarvestYield { get; set; } = new();
        public List<PressingComparisonPointResponse> PressingComparison { get; set; } = new();
        public TankOccupancyResponse TankOccupancy { get; set; } = null!;
        public ChargesCoverageResponse ChargesCoverage { get; set; } = null!; // nouveau

    }

    public class ChargesCoverageResponse
    {
        public decimal TotalAmount { get; set; }
        public decimal PaidAmount { get; set; }
        public decimal UnpaidAmount { get; set; }
    }
}