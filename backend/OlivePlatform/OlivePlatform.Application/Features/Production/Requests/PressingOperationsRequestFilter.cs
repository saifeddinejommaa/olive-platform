using OlivePlatform.Application.Common;

namespace OlivePlatform.Application.Features.Production.Requests
{
    public class PressingOperationsRequestFilter : PaginationRequest
    {
        public string? PressingNumber { get; set; }

        public DateOnly? PressingDate { get; set; }

        public string? HarvestNumber { get; set; }

        public string? PurchaseNumber { get; set; }


    }
}
