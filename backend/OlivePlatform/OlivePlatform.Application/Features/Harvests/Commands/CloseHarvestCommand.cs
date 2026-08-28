using MediatR;
using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.Harvests.Requests;
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
}

public class CloseHarvestCommandHandler : IRequestHandler<CloseHarvestCommand, Unit>
{
    private readonly IHarvestRepository _repository;
    private readonly IHarvestStockRepository _harvestStockRepository;
    private readonly IDocumentNumberService _documentNumberService;
    private readonly IUnitOfWork _unitOfWork;

    public CloseHarvestCommandHandler(
        IHarvestRepository repository,
        IHarvestStockRepository harvestStockRepository,
        IDocumentNumberService documentNumberService,
        IUnitOfWork unitOfWork)
    {
        _repository = repository;
        _harvestStockRepository = harvestStockRepository;
        _documentNumberService = documentNumberService;
        _unitOfWork = unitOfWork;
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

            foreach (var item in request.Stocks)
            {
                var operationNumber = await _documentNumberService.GenerateAsync(
                    DocumentTypes.HarvestStock,
                    DocumentPrefixes.HarvestStock,
                    now.Year,
                    ct);

                var stock = new HarvestStock
                {
                    HarvestId = harvest.Id,
                    Reference = operationNumber,
                    QuantityKg = item.Quantitykg,
                    Status = HarvestStockStatus.Available,
                    CreatedAt = now,
                    UpdatedAt = now
                };

                await _harvestStockRepository.AddAsync(stock, ct);
            }
        }, cancellationToken);

        return Unit.Value;
    }
}
