using OlivePlatform.Domain;
using OlivePlatform.Domain.Enums;

namespace OlivePlatform.Application.Features.Tanks;

public static class TankCategoryRules
{
    // Tampon : toujours « En attente d'analyse ».
    // Stockage : une catégorie commerciale (extra vierge, vierge ou lampante).
    public static OilCategory Resolve(TankType tankType, OilCategory? requested)
    {
        if (tankType == TankType.Buffer)
        {
            return OilCategory.PendingAnalysis;
        }

        if (requested is null or OilCategory.PendingAnalysis)
        {
            throw new BusinessException(
                "Choisissez la catégorie d'huile de la citerne : extra vierge, vierge ou lampante.");
        }

        return requested.Value;
    }
}
