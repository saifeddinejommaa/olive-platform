using OlivePlatform.Domain.Enums;

namespace OlivePlatform.Application.Features.Production.Requests
{
    public class NewPressingOperationInputRequest
    {
            public int? HarvestId { get; set; }

            public int? PurchaseItemId { get; set; }

            public decimal QuantityKg { get; set; }

            public (InputSourceType SourceType, int SourceId) ToSource() =>
                HarvestId is not null
                    ? (InputSourceType.Harvest, HarvestId.Value)
                    : (InputSourceType.Purchase, PurchaseItemId!.Value);
    }
}
