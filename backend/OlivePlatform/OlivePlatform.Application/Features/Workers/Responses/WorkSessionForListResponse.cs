namespace OlivePlatform.Application.Features.Workers.Responses;

public class WorkSessionForListResponse
{
    public int Total { get; set; }

    public int Id { get; set; }

    public int WorkerId { get; set; }

    public string WorkerName { get; set; } = null!;

    public int? PlotId { get; set; }

    public string? PlotCode { get; set; }

    public DateOnly WorkDate { get; set; }

    public string WorkType { get; set; } = null!;

    public decimal? Quantity { get; set; }

    public string? Unit { get; set; }

    public decimal? Amount { get; set; }
}