namespace OlivePlatform.Infrastructure.QueryRepositories;

// Fragments SQL partagés sur les lots d'olives (alias attendu : pl).
public static class OliveLotSql
{
    // Lot pressable : du restant, statut Disponible / Partiellement utilisé,
    // et analyse terminée lorsqu'elle est requise.
    public const string PressableCondition = """
        pl.remaining_kg > 0
        AND pl.status_id IN (1, 2)
        AND (
            pl.need_analysis = FALSE
            OR EXISTS (
                SELECT 1
                FROM olive_analyses pla
                WHERE pla.id = pl.olive_analysis_id
                  AND pla.status = 3
            )
        )
        """;

    // Lot sélectionnable dans une pression : du restant et statut Disponible /
    // Partiellement utilisé, même si son analyse est en attente (affiché grisé).
    public const string SelectableCondition = """
        pl.remaining_kg > 0
        AND pl.status_id IN (1, 2)
        """;
}
