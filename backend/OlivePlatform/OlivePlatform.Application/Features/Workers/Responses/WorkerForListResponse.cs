namespace OlivePlatform.Application.Features.Workers.Responses;

public class WorkerForListResponse
{
    public int Total { get; set; }

    public int Id { get; set; }

    public string Code { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string? Phone { get; set; }

    public string? WorkerType { get; set; }

    public decimal? DailyRate { get; set; }

    public bool IsActive { get; set; }

    public int WorkSessionsCount { get; set; }
}