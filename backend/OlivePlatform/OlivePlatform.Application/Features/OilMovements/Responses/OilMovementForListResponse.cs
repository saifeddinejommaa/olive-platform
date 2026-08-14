using OlivePlatform.Domain.Enums;

namespace OlivePlatform.Application.Features.OilMovements.Responses;

public class OilMovementForListResponse
{
    public int Total { get; set; }

    public int Id { get; set; }

    public string MovementNumber { get; set; } = null!;

    public OilMovementType MovementType { get; set; }

    public DateTimeOffset MovementDate { get; set; }

    public int? OilBatchId { get; set; }

    public string? OilBatchNumber { get; set; }

    public int? SourceTankId { get; set; }

    public string? SourceTankCode { get; set; }

    public int? DestinationTankId { get; set; }

    public string? DestinationTankCode { get; set; }

    public decimal QuantityLiters { get; set; }
}