namespace OlivePlatform.Domain.Entities;

public class Harvest
{
    public int Id { get; set; }
    public string HarvestNumber { get;  set; } = null!;

    public int PlotId { get;  set; }

    public DateOnly HarvestDate { get;  set; }

    public decimal QuantityKg { get;  set; }

    public string? QualityGrade { get;  set; }
    public string? Notes { get;  set; }

    public Plot Plot { get; private set; } = null!;

}