
using OlivePlatform.Domain.Enums;

namespace OlivePlatform.Domain.Entities;

public class OilMovement
{
    public int Id { get; set; }
    public string MovementNumber { get; private set; } = null!;

    public OilMovementType MovementType { get; private set; }

    public DateTimeOffset MovementDate { get;  set; }

    public int? OilBatchId { get;  set; }

    public int? SourceTankId { get;  set; }

    public int? DestinationTankId { get;  set; }

    public decimal QuantityLiters { get;  set; }

    public string? ReferenceType { get;  set; }
    public int? ReferenceId { get;  set; }

    public string? Notes { get;  set; }

   

}