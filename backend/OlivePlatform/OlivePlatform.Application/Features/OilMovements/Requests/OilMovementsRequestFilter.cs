using OlivePlatform.Application.Common;

namespace OlivePlatform.Application.Features.OilMovements.Requests
{
    public class OilMovementsRequestFilter : PaginationRequest
    {
        public string? MovementNumber { get; set; }

        public string? MovementType { get; set; }

        public int? OilBatchId { get; set; }

        public int? SourceTankId { get; set; }

        public int? DestinationTankId { get; set; }

        public DateTime? FromDate { get; set; }

        public DateTime? ToDate { get; set; }
    }
}
