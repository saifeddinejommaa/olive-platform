using OlivePlatform.Domain.Enums;
using System.ComponentModel.DataAnnotations.Schema;

namespace OlivePlatform.Domain.Entities;

// Campagne oléicole : par défaut du 1er octobre au 30 septembre.
[Table("seasons")]
public class Season
{
    [Column("id")]
    public int Id { get; set; }

    [Column("label")]
    public string Label { get; set; } = null!;

    [Column("start_date")]
    public DateOnly StartDate { get; set; }

    [Column("end_date")]
    public DateOnly EndDate { get; set; }

    [Column("status")]
    public SeasonStatus Status { get; set; }

    [Column("notes")]
    public string? Notes { get; set; }

    [Column("closed_at", TypeName = "timestamp with time zone")]
    public DateTime? ClosedAt { get; set; }

    [Column("created_at", TypeName = "timestamp with time zone")]
    public DateTime CreatedAt { get; set; }

    [Column("updated_at", TypeName = "timestamp with time zone")]
    public DateTime UpdatedAt { get; set; }
}
