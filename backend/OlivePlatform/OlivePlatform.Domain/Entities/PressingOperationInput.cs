
using OlivePlatform.Domain.Enums;
using System.ComponentModel.DataAnnotations.Schema;

namespace OlivePlatform.Domain.Entities;

[Table("pressing_operation_inputs")]
public class PressingOperationInput
{
    [Column("id")]
    public int Id { get; set; }

    [Column("pressing_operation_id")]
    public int PressingOperationId { get;  set; }

    // Lot d'olives pressé (récolte ou achat) : réservé puis consommé.
    [Column("lot_id")]
    public long LotId { get; set; }

    [Column("quantity_kg")]
    public decimal QuantityKg { get;  set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; }

    [Column("status")]
    public PressingOperationInputStatus Status { get; set; }
}
