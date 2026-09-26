using OlivePlatform.Domain.Enums;

namespace OlivePlatform.Application.Features.Seasons.Responses;

public class SeasonForListResponse
{
    public int Total { get; set; }

    public int Id { get; set; }

    public string Label { get; set; } = null!;

    public DateOnly StartDate { get; set; }

    public DateOnly EndDate { get; set; }

    public SeasonStatus Status { get; set; }

    public bool IsCurrent { get; set; }
}
