using OlivePlatform.Application.Common;
using OlivePlatform.Domain.Enums;

namespace OlivePlatform.Application.Features.Analysis.Requests
{
    public class OilAnalysesRequestFilter : PaginationRequest
    {
        public int? SeasonId { get; set; }

        public string? Reference { get; set; }

        // Référence de l'opération de pression source.
        public string? PressingReference { get; set; }

        // Début de l'analyse (start_time) à partir de cette date.
        public DateOnly? FromDate { get; set; }

        // Fin de l'analyse (end_time) jusqu'à cette date.
        public DateOnly? ToDate { get; set; }

        public ProductionStatus? Status { get; set; }
    }
}
