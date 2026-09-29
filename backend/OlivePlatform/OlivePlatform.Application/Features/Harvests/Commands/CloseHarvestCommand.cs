using MediatR;
using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.Harvests.Requests;
using OlivePlatform.Application.Services;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Enums;
using OlivePlatform.Domain.Interfaces.Repositories;
using OlivePlatform.Domain.Repositories;
using YourProject.Application.Constants;
using YourProject.Application.Services;

namespace OlivePlatform.Application.Features.Harvests.Commands.CloseHarvest;

public class CloseHarvestCommand : IRequest<Unit>
{
    public int Id { get; set; }
    public decimal QuantityKg { get; set; }

    public int harvestedTrees { get; set; }
    public List<HarvestStockItemRequest> Stocks { get; set; } = [];

    public bool ProceedAnalyse { get; set; }
}

public class CloseHarvestCommandHandler : IRequestHandler<CloseHarvestCommand, Unit>
{
    private readonly IHarvestRepository _repository;
    private readonly IOliveLotRepository _oliveLotRepository;
    private readonly IDocumentNumberService _documentNumberService;
    private readonly IOliveAnalysisRepository _oliveAnalyseRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ISeasonService _seasonService;

    public CloseHarvestCommandHandler(
        IHarvestRepository repository,
        IOliveLotRepository oliveLotRepository,
        IDocumentNumberService documentNumberService,
        IOliveAnalysisRepository oliveAnalyseRepository,
        IUnitOfWork unitOfWork,
        ISeasonService seasonService)
    {
        _repository = repository;
        _oliveLotRepository = oliveLotRepository;
        _documentNumberService = documentNumberService;
        _oliveAnalyseRepository = oliveAnalyseRepository;
        _unitOfWork = unitOfWork;
        _seasonService = seasonService;
    }

    public async Task<Unit> Handle(CloseHarvestCommand request, CancellationToken cancellationToken)
    {
        await _unitOfWork.ExecuteInTransactionAsync(async ct =>
        {
            var harvest = await _repository.GetByIdAsync(request.Id, ct);

            if (harvest == null)
                throw new KeyNotFoundException($"Harvest with id '{request.Id}' was not found.");

            if (harvest.Status != ProductionStatus.InProgress)
                throw new InvalidOperationException("Seule une récolte en cours peut être clôturée.");

            await _seasonService.EnsureSeasonOpenAsync(harvest.SeasonId, ct);

            if (request.QuantityKg <= 0)
                throw new InvalidOperationException("La quantité récoltée doit être supérieure à 0.");

            if (request.Stocks.Count == 0)
                throw new InvalidOperationException("Au moins un stock doit être renseigné.");

            foreach (var stock in request.Stocks)
            {
                if (stock.Quantitykg <= 0)
                    throw new InvalidOperationException("La quantité d'un stock doit être supérieure à 0.");
            }

            var totalStocksQuantity = request.Stocks.Sum(x => x.Quantitykg);

            if (totalStocksQuantity != request.QuantityKg)
                throw new InvalidOperationException(
                    $"La somme des stocks ({totalStocksQuantity} kg) doit être égale à la quantité récoltée ({request.QuantityKg} kg).");

            var now = DateTime.UtcNow;

            harvest.Status = ProductionStatus.Completed;
            harvest.QuantityKg = request.QuantityKg;
            harvest.EndTime = now;
            harvest.UpdatedAt = now;
            harvest.HarvestedTrees = request.harvestedTrees;

            await _repository.UpdateAsync(harvest, ct);

            // Analyse unique partagée par tous les lots de la récolte.
            int? analysisId = null;

            if (request.ProceedAnalyse)
            {
                var analysisReference = await _documentNumberService.GenerateAsync(
                    DocumentTypes.OliveAnalyse,
                    DocumentPrefixes.OliveAnalyse,
                    now.Year,
                    ct);

                var newAnalyse = new OliveAnalysis
                {
                    Reference = analysisReference,
                    SeasonId = harvest.SeasonId,
                    // Date prévue par défaut : la clôture de la récolte.
                    PlannedDate = now,
                    Status = ProductionStatus.Planned,
                    UpdatedAt = now
                };

                await _oliveAnalyseRepository.AddAsync(newAnalyse, ct);
                // Enregistrée tout de suite : son id est repris par les lots.
                await _unitOfWork.SaveChangesAsync(ct);

                analysisId = newAnalyse.Id;
            }

            foreach (var item in request.Stocks)
            {
                var lotReference = await _documentNumberService.GenerateAsync(
                    DocumentTypes.OliveLot,
                    DocumentPrefixes.OliveLot,
                    now.Year,
                    ct);

                await _oliveLotRepository.AddAsync(new OliveLot
                {
                    Reference = lotReference,
                    SeasonId = harvest.SeasonId,
                    SourceType = InputSourceType.Harvest,
                    HarvestId = harvest.Id,
                    VarietyId = item.VarietyId,
                    QuantityKg = item.Quantitykg,
                    RemainingKg = item.Quantitykg,
                    Status = OliveLotStatus.Available,
                    NeedAnalysis = request.ProceedAnalyse,
                    OliveAnalysisId = analysisId,
                    CreatedAt = now,
                    UpdatedAt = now
                }, ct);
            }

            await _oliveLotRepository.SaveChangesAsync(ct);
        }, cancellationToken);

        return Unit.Value;
    }
}
