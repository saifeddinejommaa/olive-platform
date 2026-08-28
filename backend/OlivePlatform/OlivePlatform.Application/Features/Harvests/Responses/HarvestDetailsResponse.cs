

using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Enums;

namespace OlivePlatform.Application.Features.Harvests.Responses
{
    public class HarvestDetailsResponse
    {
        public int Id { get; set; }
        public string Reference { get; set; } = string.Empty;
        public string PlotReference { get; set; } = string.Empty;
        public DateOnly HarvestDate { get; set; }
        public decimal QuantityKg { get; set; }
        public int PlannedTrees { get; set; }
        public required int VarietyId { get; set; }
        public int HarvestedTrees { get; set; }
        public string? Notes { get; set; }
        public ProductionStatus Status { get; set; }
        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public List<HarvestStockForListResponse> Stocks { get; set; } = [];
    }
}

