using OlivePlatform.Application.Features.Analysis.Responses;
using OlivePlatform.Application.Features.OliveLots.Responses;

namespace OlivePlatform.Application.Features.Harvests.Responses
{
    public class HarvestOlivesDetailsResponse
    {
        public List<OliveLotResponse> StocksList = [];

        public OliveAnalysisInfoResponse? OliveAnalysis { get; set; }

    }
}
