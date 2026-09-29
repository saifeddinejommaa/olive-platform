using OlivePlatform.Domain.Enums;
using System.ComponentModel.DataAnnotations.Schema;

namespace OlivePlatform.Domain.Entities;

// Mouvement d'huile : entrée, transfert ou sortie d'une citerne.
[Table("oil_movements")]
public class OilMovement
{
    [Column("id")]
    public int Id { get; set; }

    [Column("movement_number")]
    public string MovementNumber { get; set; } = null!;

    [Column("movement_type_id")]
    public OilMovementType MovementType { get; set; }

    [Column("movement_date", TypeName = "timestamp with time zone")]
    public DateTimeOffset MovementDate { get; set; }

    [Column("oil_batch_id")]
    public int? OilBatchId { get; set; }

    [Column("source_tank_id")]
    public int? SourceTankId { get; set; }

    [Column("destination_tank_id")]
    public int? DestinationTankId { get; set; }

    [Column("quantity_liters")]
    public decimal QuantityLiters { get; set; }

    [Column("notes")]
    public string? Notes { get; set; }
}
