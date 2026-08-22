using OlivePlatform.Domain.Enums;

namespace OlivePlatform.Application.Features.Production.Responses
{
    public class PressingOperationDetailsResponse
    {
        public int Total { get; set; }

        public int Id { get; set; }

        public string OperationNumber { get; set; } = null!;

        public ProductionStatus Status { get; set; }

        public DateTime CreatedAt { get; set; }

        public decimal? OliveQuantityKg { get; set; }

        public decimal? YieldPercentage { get; set; }

        public decimal? OilQuantityLiters { get; set; }

        public DateTime? StartTime { get; set; }

        public DateTime? EndTime { get; set; }

        public  List<PressingOperationInputResponse> Inputs { get; set; } = [];
    }
}
