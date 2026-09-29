namespace OlivePlatform.Domain.Enums;

// Table tank_type : rôle de la citerne dans le circuit de l'huile.
public enum TankType
{
    // Reçoit l'huile d'une seule pression, en attente de son analyse.
    Buffer = 1,

    // Stocke l'huile classée par catégorie.
    Storage = 2
}
