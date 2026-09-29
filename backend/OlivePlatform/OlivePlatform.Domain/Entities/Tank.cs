using OlivePlatform.Domain.Enums;
using System.ComponentModel.DataAnnotations.Schema;

namespace OlivePlatform.Domain.Entities;

[Table("tanks")]
public class Tank
{
    [Column("id")]
    public int Id { get; set; }

    // Code de la citerne (colonne reference).
    [Column("reference")]
    public string Code { get; set; } = null!;

    [Column("name")]
    public string? Name { get; set; }

    [Column("capacity_liters")]
    public decimal CapacityLiters { get; set; }

    [Column("tank_type_id")]
    public TankType TankType { get; set; } = TankType.Storage;

    // Tampon : toujours « En attente d'analyse » (contrainte en base).
    [Column("oil_category_id")]
    public OilCategory OilCategory { get; set; }

    [Column("status")]
    public string Status { get; set; } = "active";

    [Column("notes")]
    public string? Notes { get; set; }

    [Column("updated_at", TypeName = "timestamp with time zone")]
    public DateTime UpdatedAt { get; set; }

    public bool IsBuffer => TankType == TankType.Buffer;
}
