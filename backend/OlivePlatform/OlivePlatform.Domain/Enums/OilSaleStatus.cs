namespace OlivePlatform.Domain.Enums;

// Table oil_sale_status : statut d'une vente d'huile.
public enum OilSaleStatus
{
    // En préparation : le stock ne bouge pas.
    Draft = 1,

    // Validée : l'huile est sortie des citernes.
    Delivered = 2,

    Cancelled = 3
}
