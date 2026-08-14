using OlivePlatform.Application.Common;

namespace OlivePlatform.Application.Features.OilBatches.Requests
{
    public class OilBatchesRequestFilter : PaginationRequest
    {
        public string? BatchNumber { get; set; }

        public int? ProductionBatchId { get; set; }
        public string? ProductionBatchNumber { get; set; }

        public string? QualityGrade { get; set; }

        public string? Status { get; set; }

        public DateOnly? FromDate { get; set; }

        public DateOnly? ToDate { get; set; }
    }
}
