namespace OlivePlatform.Application.Features.OlivePurchases.Requests
{
    public class NewOlivePurchaseItemRequest
    {
        public int VarietyId { get; set; }
        public decimal AgreedQuantityKg { get; set; }

        public decimal PricePerKg { get; set; }

        public bool GoesToAnalysis { get; set; }
    }
}
