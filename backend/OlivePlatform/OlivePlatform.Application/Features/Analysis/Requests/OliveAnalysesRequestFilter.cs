using OlivePlatform.Application.Common;
using OlivePlatform.Domain.Enums;

namespace OlivePlatform.Application.Features.Laboratory.Requests
{
    public class OliveAnalysesRequestFilter : PaginationRequest
    {
        public int? SeasonId { get; set; }

        public string? Reference { get; set; }

        public string? PlotReference { get; set; }

        public string? PurchaseReference { get; set; }

        public string? HarvestReference { get; set; }

        // Début de l'analyse (start_time) à partir de cette date.
        public DateOnly? FromDate { get; set; }

        // Fin de l'analyse (end_time) jusqu'à cette date.
        public DateOnly? ToDate { get; set; }

        public ProductionStatus? Status { get; set; }
    }
}
