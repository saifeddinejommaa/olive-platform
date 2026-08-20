namespace OlivePlatform.Domain.Entities;

public class WorkSession
{
    public int Id { get; set; }
    public int WorkerId { get; private set; }

    public int? PlotId { get; private set; }

    public DateOnly WorkDate { get; private set; }

    public string WorkType { get; private set; } = null!;

    public decimal? Quantity { get; private set; }

    public string? Unit { get; private set; }

    public decimal? Amount { get; private set; }

    public string? Notes { get; private set; }
}