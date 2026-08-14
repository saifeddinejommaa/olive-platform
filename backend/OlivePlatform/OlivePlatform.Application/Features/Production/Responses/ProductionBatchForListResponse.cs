using OlivePlatform.Domain.Enums;

namespace OlivePlatform.Application.Features.Production.Responses;

public class ProductionBatchForListResponse
{
    public int Total { get; set; }

    public int Id { get; set; }

    public string BatchNumber { get; set; } = null!;

    public DateOnly ProductionDate { get; set; }

    public ProductionStatus Status { get; set; }

    public decimal? OliveQuantityKg { get; set; }

    public decimal? OilQuantityLiters { get; set; }

    public decimal? YieldPercentage { get; set; }

    public DateTimeOffset? StartTime { get; set; }

    public DateTimeOffset? EndTime { get; set; }
}