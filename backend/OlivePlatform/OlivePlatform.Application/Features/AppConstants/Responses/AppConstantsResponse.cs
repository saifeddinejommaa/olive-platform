namespace OlivePlatform.Application.Features.AppConstants.Responses
{
    public class AppConstantsResponse
    {

        public IReadOnlyList<AppConstantItemResponse> OliveVarieties { get; init; } = [];

        public IReadOnlyList<AppConstantItemResponse> PurchaseStatuses { get; init; } = [];

        public IReadOnlyList<AppConstantItemResponse> SampleStatuses { get; init; } = [];

        public IReadOnlyList<AppConstantItemResponse> ProductionStatuses { get; init; } = [];

        public IReadOnlyList<AppConstantItemResponse> OilMovementTypes { get; init; } = [];

        public IReadOnlyList<AppConstantItemResponse> InvoiceTypes { get; init; } = [];

        public IReadOnlyList<AppConstantItemResponse> InvoiceStatuses { get; init; } = [];

        public IReadOnlyList<AppConstantItemResponse> PaymentMethods { get; init; } = [];

    }
}
