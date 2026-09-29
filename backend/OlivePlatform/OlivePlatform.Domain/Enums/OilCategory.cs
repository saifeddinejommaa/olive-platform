namespace OlivePlatform.Domain.Enums;

// Table oil_category : catégorie de l'huile d'olive.
public enum OilCategory
{
    ExtraVirgin = 1,
    Virgin = 2,
    Lampante = 3,

    // Non commerciale : huile d'une citerne tampon, en attente de son analyse.
    PendingAnalysis = 4
}
