using System.Security.Principal;

namespace OlivePlatform.Application.Features.AppConstants.Responses
{
    public class AppConstantsResponse
    {

        public IReadOnlyList<AppConstantItemResponse> OliveVarieties { get; init; } = [];

        public IReadOnlyList<AppConstantItemResponse> PurchaseStatus { get; init; } = [];

        public IReadOnlyList<AppConstantItemResponse> ProductionStatus { get; init; } = [];

        public IReadOnlyList<AppConstantItemResponse> OilMovementTypes { get; init; } = [];

        public IReadOnlyList<AppConstantItemResponse> InvoiceTypes { get; init; } = [];

        public IReadOnlyList<AppConstantItemResponse> InvoiceStatuses { get; init; } = [];

        public IReadOnlyList<AppConstantItemResponse> PaymentMethods { get; init; } = [];

        public IReadOnlyList<AppConstantItemResponse> CostLineType { get; init; } = [];

        public IReadOnlyList<AppConstantItemResponse> HarvestTypes { get; init; } = [];

        public IReadOnlyList<AppConstantItemResponse> PlotHarvestStates { get; init; } = [];

        public IReadOnlyList<AppConstantItemResponse> OliveLotStatuses { get; init; } = [];

        public IReadOnlyList<AppConstantItemResponse> TankTypes { get; init; } = [];

        // Catégories d'huile (dont « En attente d'analyse », non commerciale : id 4).
        public IReadOnlyList<AppConstantItemResponse> OilCategories { get; init; } = [];
    }
}
