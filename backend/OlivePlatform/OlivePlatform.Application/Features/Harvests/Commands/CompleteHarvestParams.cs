namespace OlivePlatform.Application.Features.Harvests.Commands
{
    public sealed class CompleteHarvestParams
    {
        public decimal QuantityKg { get; init; }

        public int HarvestedTrees { get; init; }
    }
}
