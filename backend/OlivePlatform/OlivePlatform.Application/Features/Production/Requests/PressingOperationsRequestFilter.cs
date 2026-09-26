using OlivePlatform.Application.Common;

namespace OlivePlatform.Application.Features.Production.Requests
{
    public class PressingOperationsRequestFilter : PaginationRequest
    {
        public string? OperationNumber { get; set; }

        public DateOnly? PlannedDate { get; set; }

        public string? HarvestNumber { get; set; }

        public string? PurchaseNumber { get; set; }


    }
}
