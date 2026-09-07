using OlivePlatform.Domain.Enums;

namespace OlivePlatform.Application.Features.Analysis.Responses
{
    public class OilAnalysisDetailsResponse
    {
        public int Id { get; set; }
        public string Reference { get; set; } = string.Empty;
        public OilAnalysisSourceType SourceTypeId { get; set; }
        public string SourceReference { get; set; } = string.Empty;
        public decimal? AcidityPercentage { get; set; }
        public decimal? PeroxideIndex { get; set; }
        public decimal? K232 { get; set; }
        public decimal? K270 { get; set; }
        public int? OrganolepticGrade { get; set; }
        public DateTime? AnalysisDate { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public ProductionStatus Status { get; set; }
    }
}
