using OlivePlatform.Application.Common;

namespace OlivePlatform.Application.Features.Workers.Requests
{
    public class WorkSessionsRequestFilter : PaginationRequest
    {
        public int? WorkerId { get; set; }

        public int? PlotId { get; set; }

        public string? WorkType { get; set; }

        public DateOnly? FromDate { get; set; }

        public DateOnly? ToDate { get; set; }
    }
}
