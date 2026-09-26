using OlivePlatform.Domain.Enums;

namespace OlivePlatform.Application.Features.Production.Responses;

public class PressingOperationForListResponse
{
    public int Total { get; set; }

    public int Id { get; set; }

    public int SeasonId { get; set; }

    public string OperationNumber { get; set; } = null!;

    public ProductionStatus Status { get; set; }

    public DateTime PlannedDate { get; set; }

    public decimal? OliveQuantityKg { get; set; }

    public decimal? OilQuantityLiters { get; set; }

    public decimal? YieldPercentage { get; set; }

    public DateTime? StartTime { get; set; }

    public DateTime? EndTime { get; set; }

    public ProductionStatus? OliveAnalysis { get; set; }

    public ProductionStatus? OilAnalysis { get; set; }
}