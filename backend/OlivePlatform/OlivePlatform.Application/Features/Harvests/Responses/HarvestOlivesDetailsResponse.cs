using OlivePlatform.Application.Features.Analysis.Responses;

namespace OlivePlatform.Application.Features.Harvests.Responses
{
    public class HarvestOlivesDetailsResponse
    {
        public List<HarvestStockDetailsResponse> StocksList = [];

        public OliveAnalysisInfoResponse? OliveAnalysis { get; set; }

    }
}
