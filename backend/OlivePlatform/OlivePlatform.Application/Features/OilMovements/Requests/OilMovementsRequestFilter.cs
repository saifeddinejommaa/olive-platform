using OlivePlatform.Application.Common;
using OlivePlatform.Domain.Enums;

namespace OlivePlatform.Application.Features.OilMovements.Requests
{
    public class OilMovementsRequestFilter : PaginationRequest
    {
        // N° de mouvement, lot d'huile ou pression.
        public string? Search { get; set; }

        public OilMovementType? MovementType { get; set; }

        // Citerne d'origine ou de destination.
        public int? TankId { get; set; }

        public DateTime? FromDate { get; set; }

        public DateTime? ToDate { get; set; }
    }
}
