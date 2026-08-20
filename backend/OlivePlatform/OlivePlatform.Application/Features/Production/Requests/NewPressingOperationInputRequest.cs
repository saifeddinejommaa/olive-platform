namespace OlivePlatform.Application.Features.Production.Requests
{
    public class NewPressingOperationInputRequest
    {
            public int? HarvestId { get; set; }

            public int? PurchaseItemId { get; set; }

            public decimal QuantityKg { get; set; }
    }
}
