using OlivePlatform.Application.Common;
using OlivePlatform.Domain.Enums;

namespace OlivePlatform.Application.Features.Laboratory.Requests
{
    public class OliveAnalysesRequestFilter : PaginationRequest
    {
        public string? Reference { get; set; }

        public string? PlotReference { get; set; }

        public string? PurchaseReference { get; set; }

        public string? HarvestReference { get; set; }

        public DateOnly? AnalysisDate { get; set; }

        public ProductionStatus Status { get; set; }
    }
}
