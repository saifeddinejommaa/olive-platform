using OlivePlatform.Application.Common;
using OlivePlatform.Domain.Enums;

namespace OlivePlatform.Application.Features.Harvests.Requests
{
    public class HarvestsRequestFilter : PaginationRequest
    {
        public int? SeasonId { get; set; }

        public string? HarvestNumber { get; set; }

        public int? PlotId { get; set; }

        public string? PlotReference { get; set; }

        public ProductionStatus? Status { get; set; }

        // Début de la récolte (start_time) à partir de cette date.
        public DateOnly? FromDate { get; set; }

        // Fin de la récolte (end_time) jusqu'à cette date.
        public DateOnly? ToDate { get; set; }

        public string? QualityGrade { get; set; }

        public bool? ToPressing { get; set; }
    }
}
