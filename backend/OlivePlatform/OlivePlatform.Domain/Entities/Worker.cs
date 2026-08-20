namespace OlivePlatform.Domain.Entities;

public class Worker
{
    public int Id { get; set; }
    public string Code { get;  set; } = null!;

    public string Name { get;  set; } = null!;

    public string? Phone { get;  set; }

    public string? WorkerType { get;  set; }

    public decimal? DailyRate { get;  set; }

    public bool IsActive { get;  set; }
}