using OlivePlatform.Application.Common;
using OlivePlatform.Domain.Enums;

namespace OlivePlatform.Application.Features.Analysis.Requests
{
    public class OilAnalysesRequestFilter : PaginationRequest
    {
        public string? Reference { get; set; }

        public DateOnly? AnalysisDate { get; set; }

        public ProductionStatus? Status { get; set; }
    }
}
