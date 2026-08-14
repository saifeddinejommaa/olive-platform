using OlivePlatform.Application.Common;

namespace OlivePlatform.Application.Features.Plots.Requests
{
    public class PlotVarietiesRequestFilter : PaginationRequest
    {
        public int? PlotId { get; set; }

        public int? VarietyId { get; set; }
    }
}
