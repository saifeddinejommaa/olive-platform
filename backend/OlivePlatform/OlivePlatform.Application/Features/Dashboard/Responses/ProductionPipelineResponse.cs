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

    // Lots d'olives de la campagne, répartis par état (en kg).
    public class OliveLotsOverviewResponse
    {
        public int TotalLots { get; set; }
        public decimal TotalKg { get; set; }
        public decimal HarvestKg { get; set; }
        public decimal PurchaseKg { get; set; }

        // Quantités pressées (pressions terminées).
        public decimal PressedKg { get; set; }
        public int PressedLots { get; set; }

        // Quantités réservées par une pression planifiée ou en cours.
        public decimal InPressingKg { get; set; }
        public int InPressingLots { get; set; }

        // Restant pressable (analyse terminée ou non requise).
        public decimal ReadyKg { get; set; }
        public int ReadyLots { get; set; }

        // Restant bloqué : analyse requise mais non terminée.
        public decimal PendingAnalysisKg { get; set; }
        public int PendingAnalysisLots { get; set; }
    }

    public class DashboardSummaryResponse
    {
        public ProductionPipelineResponse HarvestPipeline { get; set; } = null!;
        public ProductionPipelineResponse PressingPipeline { get; set; } = null!;
        public TreesCoverageResponse TreesCoverage { get; set; } = null!;
        public OliveLotsOverviewResponse OliveLots { get; set; } = null!;
        public List<PressingComparisonPointResponse> PressingComparison { get; set; } = new();
        public TankOccupancyResponse TankOccupancy { get; set; } = null!;
        public ChargesCoverageResponse ChargesCoverage { get; set; } = null!;
        public IncomeVsExpensesResponse IncomeVsExpenses { get; set; } = null!;
    }

    // Dépenses (charges de récolte + achats d'olives) contre gains (ventes livrées HT).
    public class IncomeVsExpensesResponse
    {
        public decimal ExpensesAmount { get; set; }
        public decimal IncomeAmount { get; set; }
        public decimal ResultAmount => IncomeAmount - ExpensesAmount;
    }

    public class ChargesCoverageResponse
    {
        public decimal TotalAmount { get; set; }
        public decimal PaidAmount { get; set; }
        public decimal UnpaidAmount { get; set; }
    }
}
