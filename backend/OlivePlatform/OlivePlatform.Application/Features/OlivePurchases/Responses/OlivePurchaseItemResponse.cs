namespace OlivePlatform.Application.Features.OlivePurchases.Responses
{
    public class OlivePurchaseItemResponse
    {
        public int Id { get; set; }

        public required string Reference { get; set; }

        public int? VarietyId { get; set; }

        public string? VarietyName { get; set; }

        public decimal AgreedQuantityKg { get; set; }

        public decimal RemainingQuantityKg { get; set; }

        public decimal PricePerKg { get; set; }

        public int TotalAmount { get; set; }
    }
}
