namespace OlivePlatform.Application.Features.Production.Requests
{
    public class PressingParametersRequest
    {
        public int? ProcessTypeId { get; set; }
        public int? MillId { get; set; }

        public decimal? MalaxingTemperatureC { get; set; }
        public int? MalaxingDurationMinutes { get; set; }
        public decimal? MalaxingSpeedRpm { get; set; }

        public decimal? FeedRateKgH { get; set; }

        public decimal? DecanterSpeedRpm { get; set; }
        public decimal? DecanterDifferentialRpm { get; set; }

        public decimal? CentrifugeSpeedRpm { get; set; }

        public decimal? AddedWaterLiters { get; set; }
        public decimal? WaterTemperatureC { get; set; }

        public int? WaitingTimeBeforeExtractionMinutes { get; set; }

        public string? Notes { get; set; }
    }
}
