using MediatR;
using OlivePlatform.Application.Services;
using OlivePlatform.Domain;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Enums;
using OlivePlatform.Domain.Interfaces.Repositories;
using OlivePlatform.Domain.Repositories;

namespace OlivePlatform.Application.Features.Harvests.Commands.AddHarvestCostLine;

public class AddHarvestCostLineCommand : IRequest<long>
{
    public int HarvestId { get; set; }

    public DateOnly Date { get; set; }

    public CostLineType TypeId { get; set; }

    public string? Description { get; set; }

    public string? WorkerName { get; set; }

    public string? WorkerIdentifier { get; set; }

    public decimal TotalAmount { get; set; }

    // Coût déjà réglé à la saisie : payé intégralement à la date du coût.
    public bool IsPaid { get; set; }

    public string? Notes { get; set; }
}

public class AddHarvestCostLineCommandHandler
    : IRequestHandler<AddHarvestCostLineCommand, long>
{
    private readonly IHarvestRepository _harvestRepository;
    private readonly IHarvestCostLineRepository _costLineRepository;
    private readonly ISeasonService _seasonService;

    public AddHarvestCostLineCommandHandler(
        IHarvestRepository harvestRepository,
        IHarvestCostLineRepository costLineRepository,
        ISeasonService seasonService)
    {
        _harvestRepository = harvestRepository;
        _costLineRepository = costLineRepository;
        _seasonService = seasonService;
    }

    public async Task<long> Handle(
        AddHarvestCostLineCommand request,
        CancellationToken cancellationToken)
    {
        var harvest = await _harvestRepository.GetByIdAsync(
            request.HarvestId,
            cancellationToken);

        if (harvest is null)
        {
            throw new KeyNotFoundException(
                $"Harvest with id '{request.HarvestId}' was not found.");
        }

        if (harvest.Status == ProductionStatus.Planned)
        {
            throw new BusinessException(
                "Les coûts ne peuvent être ajoutés qu'une fois la récolte lancée.");
        }

        if (harvest.Status == ProductionStatus.Cancelled)
        {
            throw new BusinessException(
                "Impossible d'ajouter un coût à une récolte annulée.");
        }

        if (!Enum.IsDefined(request.TypeId) ||
            request.TypeId == CostLineType.olivePurchase)
        {
            throw new BusinessException(
                "Le type de coût n'est pas valide.");
        }

        if (request.TotalAmount <= 0)
        {
            throw new BusinessException(
                "Le montant doit être supérieur à 0.");
        }

        var workerName = Normalize(request.WorkerName);

        if (request.TypeId == CostLineType.MainOeuvre && workerName is null)
        {
            throw new BusinessException(
                "Le nom de l'ouvrier est obligatoire pour un coût de main d'œuvre.");
        }

        await _seasonService.EnsureDateInSeasonAsync(
            harvest.SeasonId,
            request.Date,
            cancellationToken);

        var costLine = new HarvestCostLine
        {
            HarvestId = harvest.Id,
            Date = request.Date,
            Type = (int)request.TypeId,
            Description = Normalize(request.Description),
            WorkerName = workerName,
            WorkerIdentifier = Normalize(request.WorkerIdentifier),
            TotalAmount = request.TotalAmount,
            Notes = Normalize(request.Notes),
            IsPaid = request.IsPaid,
            PaidDate = request.IsPaid ? request.Date : null,
            PaidAmount = request.IsPaid ? request.TotalAmount : 0m,
            UnpaidAmount = request.IsPaid ? 0m : request.TotalAmount
        };

        await _costLineRepository.AddAsync(costLine, cancellationToken);

        return costLine.Id;
    }

    private static string? Normalize(string? value) =>
        string.IsNullOrWhiteSpace(value) ? null : value.Trim();
}
