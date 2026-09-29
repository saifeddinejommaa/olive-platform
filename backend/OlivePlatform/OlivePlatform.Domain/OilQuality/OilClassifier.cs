using OlivePlatform.Domain.Enums;

namespace OlivePlatform.Domain.OilQuality;

/// <summary>
/// Catégorie commerciale d'une huile d'olive (normes COI) d'après son analyse.
/// Un critère non mesuré n'est pas vérifié ; un seul critère dépassé suffit à
/// déclasser l'huile. Seule source de la règle : appelée à la clôture de
/// l'analyse, la catégorie est ensuite enregistrée (oil_analyses.oil_category_id).
/// </summary>
public static class OilClassifier
{
    private record Limits(decimal Acidity, decimal Peroxide, decimal K232, decimal K270);

    private static readonly Limits ExtraVirgin = new(0.8m, 20m, 2.5m, 0.22m);

    private static readonly Limits Virgin = new(2.0m, 20m, 2.6m, 0.25m);

    // null tant que l'acidité n'est pas connue.
    public static OilCategory? Classify(
        decimal? acidity,
        decimal? peroxide,
        decimal? k232,
        decimal? k270)
    {
        if (acidity is null || acidity < 0)
        {
            return null;
        }

        bool Within(Limits limits) =>
            acidity <= limits.Acidity
            && (peroxide is null || peroxide <= limits.Peroxide)
            && (k232 is null || k232 <= limits.K232)
            && (k270 is null || k270 <= limits.K270);

        if (Within(ExtraVirgin)) return OilCategory.ExtraVirgin;
        if (Within(Virgin)) return OilCategory.Virgin;

        return OilCategory.Lampante;
    }
}
