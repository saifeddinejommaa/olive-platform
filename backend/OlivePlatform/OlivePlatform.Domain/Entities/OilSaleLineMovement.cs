using System.ComponentModel.DataAnnotations.Schema;

namespace OlivePlatform.Domain.Entities;

// Mouvement « Sortie vente » d'une ligne de vente (un par lot d'huile vidé).
[Table("oil_sale_line_movements")]
public class OilSaleLineMovement
{
    [Column("oil_sale_line_id")]
    public int OilSaleLineId { get; set; }

    [Column("oil_movement_id")]
    public int OilMovementId { get; set; }
}
