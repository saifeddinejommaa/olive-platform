using OlivePlatform.Application.Common;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Enums;

public class PlotsRequestFilter : PaginationRequest
{
    // Campagne sélectionnée : l'avancement de la récolte est calculé sur celle-ci.
    public int? SeasonId { get; set; }

    public string? Reference { get; set; }

    public string? Name { get; set; }

    public OliveVariety? OliveVariety { get; set; }

    public PlotHarvestState? HarvestState { get; set; }
}
