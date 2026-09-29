using MediatR;
using OlivePlatform.Application.Common;
using OlivePlatform.Application.Services;
using OlivePlatform.Domain;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Enums;
using OlivePlatform.Domain.Interfaces.Repositories;
using OlivePlatform.Domain.Repositories;
using YourProject.Application.Constants;
using YourProject.Application.Services;

namespace OlivePlatform.Application.Features.OilMovements.Commands;

/// <summary>
/// Après l'analyse d'huile d'une pression : transfert de son huile, de la
/// citerne tampon vers la citerne de stockage de sa catégorie.
/// </summary>
public class TransferOilToStorageCommand : IRequest<int>
{
    public int OilAnalysisId { get; set; }

    public int DestinationTankId { get; set; }

    public string? Notes { get; set; }
}

public class TransferOilToStorageCommandHandler
    : IRequestHandler<TransferOilToStorageCommand, int>
{
    private static readonly Dictionary<OilCategory, string> CategoryLabels = new()
    {
        [OilCategory.ExtraVirgin] = "Extra vierge",
        [OilCategory.Virgin] = "Vierge",
        [OilCategory.Lampante] = "Lampante",
    };

    private readonly IOilAnalysisRepository _oilAnalysisRepository;
    private readonly IOilBatchRepository _oilBatchRepository;
    private readonly IOilMovementRepository _oilMovementRepository;
    private readonly ITankRepository _tankRepository;
    private readonly ISeasonService _seasonService;
    private readonly IDocumentNumberService _documentNumberService;
    private readonly IUnitOfWork _unitOfWork;

    public TransferOilToStorageCommandHandler(
        IOilAnalysisRepository oilAnalysisRepository,
        IOilBatchRepository oilBatchRepository,
        IOilMovementRepository oilMovementRepository,
        ITankRepository tankRepository,
        ISeasonService seasonService,
        IDocumentNumberService documentNumberService,
        IUnitOfWork unitOfWork)
    {
        _oilAnalysisRepository = oilAnalysisRepository;
        _oilBatchRepository = oilBatchRepository;
        _oilMovementRepository = oilMovementRepository;
        _tankRepository = tankRepository;
        _seasonService = seasonService;
        _documentNumberService = documentNumberService;
        _unitOfWork = unitOfWork;
    }

    public async Task<int> Handle(
        TransferOilToStorageCommand request,
        CancellationToken cancellationToken)
    {
        var analysis = await _oilAnalysisRepository.GetByIdAsync(
            request.OilAnalysisId,
            cancellationToken)
            ?? throw new KeyNotFoundException(
                $"Oil analysis {request.OilAnalysisId} not found.");

        await _seasonService.EnsureSeasonOpenAsync(
            analysis.SeasonId,
            cancellationToken);

        if (analysis.SourceTypeId != OilAnalysisSourceType.PressingOperation)
        {
            throw new BusinessException(
                "Seule l'huile d'une pression peut être transférée depuis son analyse.");
        }

        if (analysis.Status != ProductionStatus.Completed)
        {
            throw new BusinessException(
                "L'analyse d'huile doit être terminée avant de stocker l'huile.");
        }

        // Catégorie officielle, fixée à la clôture de l'analyse : elle décide de la citerne.
        var category = analysis.OilCategory
            ?? throw new BusinessException(
                "L'analyse n'a pas de catégorie d'huile : elle doit être clôturée avec son acidité.");

        var destination = await _tankRepository.GetByIdAsync(
            request.DestinationTankId,
            cancellationToken);

        if (destination is null || destination.IsBuffer || destination.Status != "active")
        {
            throw new BusinessException(
                "La citerne de destination doit être une citerne de stockage active.");
        }

        if (destination.OilCategory != category)
        {
            throw new BusinessException(
                $"L'huile est classée « {CategoryLabels[category]} » : choisissez une citerne de cette catégorie.");
        }

        // Huile de la pression encore en citerne tampon, lot par lot.
        var batches = await _oilBatchRepository.GetByPressingOperationIdAsync(
            analysis.SourceId,
            cancellationToken);

        var balances = await _oilMovementRepository.GetBatchBalancesAsync(
            batches.Select(batch => batch.Id),
            cancellationToken);

        var bufferBalances = new List<OilBatchBalance>();

        foreach (var balance in balances)
        {
            var tank = await _tankRepository.GetByIdAsync(balance.TankId, cancellationToken);

            if (tank is not null && tank.IsBuffer)
            {
                bufferBalances.Add(balance);
            }
        }

        if (bufferBalances.Count == 0)
        {
            throw new BusinessException(
                "L'huile de cette pression n'est plus en citerne tampon.");
        }

        var quantity = bufferBalances.Sum(balance => balance.QuantityLiters);

        var destinationQuantity = await _tankRepository.GetCurrentQuantityAsync(
            destination.Id,
            cancellationToken);

        var freeLiters = destination.CapacityLiters - destinationQuantity;

        if (freeLiters < quantity)
        {
            throw new BusinessException(
                $"Place insuffisante dans {destination.Code} : {freeLiters:0.#} L libres pour {quantity:0.#} L.");
        }

        var now = DateTime.UtcNow;
        var movementCount = 0;

        await _unitOfWork.ExecuteInTransactionAsync(async ct =>
        {
            foreach (var balance in bufferBalances)
            {
                var movement = new OilMovement
                {
                    MovementNumber = await _documentNumberService.GenerateAsync(
                        DocumentTypes.OilMovement,
                        DocumentPrefixes.OilMovement,
                        now.Year,
                        ct),
                    MovementType = OilMovementType.Transfer,
                    MovementDate = now,
                    OilBatchId = balance.OilBatchId,
                    SourceTankId = balance.TankId,
                    DestinationTankId = destination.Id,
                    QuantityLiters = balance.QuantityLiters,
                    Notes = request.Notes,
                };

                await _oilMovementRepository.AddAsync(movement, ct);

                movementCount++;
            }

            // Les lots transférés sont stockés, avec leur catégorie.
            foreach (var batch in batches.Where(batch =>
                bufferBalances.Any(balance => balance.OilBatchId == batch.Id)))
            {
                batch.Status = OilBatch.StoredStatus;
                batch.QualityGrade = CategoryLabels[category];

                await _oilBatchRepository.UpdateAsync(batch, ct);
            }
        }, cancellationToken);

        return movementCount;
    }
}
