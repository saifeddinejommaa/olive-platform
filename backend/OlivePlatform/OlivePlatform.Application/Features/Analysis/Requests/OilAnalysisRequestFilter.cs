using OlivePlatform.Application.Common;
using OlivePlatform.Domain.Enums;

namespace OlivePlatform.Application.Features.Analysis.Requests
{
    public class OilAnalysesRequestFilter : PaginationRequest
    {
        public int? SeasonId { get; set; }

        public string? Reference { get; set; }

        public DateOnly? PlannedDate { get; set; }

        public ProductionStatus? Status { get; set; }
    }
}
