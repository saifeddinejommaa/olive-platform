namespace OlivePlatform.Domain.Enums;

// Statut d'un lot d'olives (table olive_lot_status).
public enum OliveLotStatus
{
    // Aucune quantité engagée dans une pression.
    Available = 1,

    // Une partie seulement est engagée : le reste peut encore être pressé.
    PartiallyUsed = 2,

    // Tout le lot est engagé dans une pression non terminée.
    Processing = 3,

    // Tout le lot a été pressé.
    Empty = 4,

    // Lot clôturé manuellement (plus utilisable).
    Closed = 5
}
