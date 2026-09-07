using OlivePlatform.Domain.Enums;
using System.ComponentModel.DataAnnotations.Schema;

namespace OlivePlatform.Domain.Entities;

[Table("pressing_operations")]
public class PressingOperation
{
    [Column("id")]
    public int Id { get; set; }

    [Column("operation_number")]
    public string OperationNumber { get; set; } = null!;

    [Column("start_time")]
    public DateTime? StartTime { get; set; }

    [Column("end_time")]
    public DateTime? EndTime { get; set; }

    [Column("status_id")]
    public ProductionStatus Status { get; set; }

    [Column("oil_quantity_liters")]
    public decimal? OilQuantityLiters { get; set; }

    [Column("notes")]
    public string? Notes { get; set; }

    [Column("created_at")]
    public DateTime CreatedAt { get; set; }

    [Column("expected_oil_liters")]
    public decimal? ExpectedOilLiters { get; set; }

    [Column("oil_yield_deviation_liters")]
    public decimal? OilYieldDeviationLiters { get; set; }
}