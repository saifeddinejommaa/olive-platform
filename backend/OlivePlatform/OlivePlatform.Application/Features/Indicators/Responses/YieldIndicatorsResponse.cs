namespace OlivePlatform.Application.Features.Indicators.Responses;

/// <summary>
/// Rendements d'huile de la campagne : pressions terminées, huile de chaque
/// pression répartie sur ses lots au prorata des kilos d'olives.
/// </summary>
public class YieldIndicatorsResponse
{
    public YieldRowResponse Totals { get; set; } = new();

    public List<YieldRowResponse> ByVariety { get; set; } = [];

    public List<YieldRowResponse> ByPlot { get; set; } = [];

    public List<YieldRowResponse> BySupplier { get; set; } = [];

    // Clé : « AAAA-MM ».
    public List<YieldRowResponse> ByMonth { get; set; } = [];
}

public class YieldRowResponse
{
    public string Key { get; set; } = string.Empty;

    public string Label { get; set; } = string.Empty;

    public int PressingsCount { get; set; }

    public decimal OliveKg { get; set; }

    // Huile attribuée (L).
    public decimal OilLiters { get; set; }

    // Litres d'huile pour 100 kg d'olives.
    public decimal LitersPer100Kg { get; set; }

    // Rendement en poids : kg d'huile pour 100 kg d'olives.
    public decimal YieldPercentage { get; set; }

    // Pressions mélangeant plusieurs variétés : rendement moyenné.
    public int MixedPressingsCount { get; set; }
}
