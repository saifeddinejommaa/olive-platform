
using OlivePlatform.Domain.Enums;

namespace OlivePlatform.Domain.Entities;

public class OilMovement
{
    public int Id { get; set; }
    public string MovementNumber { get; private set; } = null!;

    public OilMovementType MovementType { get; private set; }

    public DateTimeOffset MovementDate { get; private set; }

    public int? OilBatchId { get; private set; }

    public int? SourceTankId { get; private set; }

    public int? DestinationTankId { get; private set; }

    public decimal QuantityLiters { get; private set; }

    public string? ReferenceType { get; private set; }
    public int? ReferenceId { get; private set; }

    public string? Notes { get; private set; }

    public OilBatch? OilBatch { get; private set; }

    public Tank? SourceTank { get; private set; }

    public Tank? DestinationTank { get; private set; }

   

    public OilMovement(
        string movementNumber,
        OilMovementType movementType,
        decimal quantityLiters,
        int? oilBatchId = null,
        int? sourceTankId = null,
        int? destinationTankId = null)
    {
        MovementNumber = movementNumber;
        MovementType = movementType;
        QuantityLiters = quantityLiters;
        OilBatchId = oilBatchId;
        SourceTankId = sourceTankId;
        DestinationTankId = destinationTankId;
        MovementDate = DateTimeOffset.UtcNow;
    }
}