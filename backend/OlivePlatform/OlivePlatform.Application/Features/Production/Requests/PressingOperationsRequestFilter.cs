using OlivePlatform.Application.Common;

namespace OlivePlatform.Application.Features.Production.Requests
{
    public class PressingOperationsRequestFilter : PaginationRequest
    {
        public int? SeasonId { get; set; }

        public string? OperationNumber { get; set; }

        // Début de la pression (start_time) à partir de cette date.
        public DateOnly? FromDate { get; set; }

        // Fin de la pression (end_time) jusqu'à cette date.
        public DateOnly? ToDate { get; set; }

        public string? HarvestNumber { get; set; }

        public string? PurchaseNumber { get; set; }

    }
}
