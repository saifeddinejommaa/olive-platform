using OlivePlatform.Domain.Enums;

namespace OlivePlatform.Application.Features.Seasons.Responses;

public class SeasonDetailsResponse
{
    public int Id { get; set; }

    public string Label { get; set; } = null!;

    public DateOnly StartDate { get; set; }

    public DateOnly EndDate { get; set; }

    public SeasonStatus Status { get; set; }

    public bool IsCurrent { get; set; }

    public string? Notes { get; set; }

    public DateTime? ClosedAt { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime UpdatedAt { get; set; }
}
