using OlivePlatform.Domain.Enums;

namespace OlivePlatform.Application.Features.OliveLots.Requests;

public class OliveLotsRequestFilter
{
    public int? SeasonId { get; set; }

    public int? HarvestId { get; set; }

    public int? PurchaseId { get; set; }

    public InputSourceType? SourceType { get; set; }

    public OliveLotStatus? Status { get; set; }

    // true : lots pressables ou en attente d'analyse (restant > 0, non vidés).
    public bool? Available { get; set; }

    public string? Search { get; set; }
}
