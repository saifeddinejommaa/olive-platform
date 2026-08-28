using OlivePlatform.Domain.Enums;

namespace OlivePlatform.Application.Features.Harvests.Responses
{
    public class HarvestStockForListResponse
    {
        public int Id { get; set; }
        public int HarvestId { get; set; }
        public string Reference { get; set; } = string.Empty;
        public decimal QuantityKg { get; set; }
        public HarvestStockStatus Status { get; set; } = HarvestStockStatus.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public int Total { get; set; }
    }
}
