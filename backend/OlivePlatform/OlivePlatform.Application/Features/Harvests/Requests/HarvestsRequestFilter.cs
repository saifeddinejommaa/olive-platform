using OlivePlatform.Application.Common;

namespace OlivePlatform.Application.Features.Harvests.Requests
{
    public class HarvestsRequestFilter : PaginationRequest
    {
        public string? HarvestNumber { get; set; }

        public int? PlotId { get; set; }

        public DateOnly? FromDate { get; set; }

        public DateOnly? ToDate { get; set; }

        public string? QualityGrade { get; set; }

        public bool? ToPressing { get; set; }
    }
}
