using System.ComponentModel.DataAnnotations.Schema;

namespace OlivePlatform.Domain.Entities;

// Client acheteur d'huile (vente en vrac).
[Table("customers")]
public class Customer
{
    [Column("id")]
    public int Id { get; set; }

    // CLT-AAAA-001
    [Column("reference")]
    public string Reference { get; set; } = null!;

    [Column("name")]
    public string Name { get; set; } = null!;

    [Column("phone")]
    public string? Phone { get; set; }

    [Column("email")]
    public string? Email { get; set; }

    // Matricule fiscal.
    [Column("tax_id")]
    public string? TaxId { get; set; }

    [Column("address")]
    public string? Address { get; set; }

    [Column("notes")]
    public string? Notes { get; set; }

    [Column("is_active")]
    public bool IsActive { get; set; } = true;

    [Column("created_at", TypeName = "timestamp with time zone")]
    public DateTime CreatedAt { get; set; }

    [Column("updated_at", TypeName = "timestamp with time zone")]
    public DateTime UpdatedAt { get; set; }
}
