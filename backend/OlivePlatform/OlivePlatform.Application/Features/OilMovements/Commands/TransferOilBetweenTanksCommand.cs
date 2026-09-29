using MediatR;
using OlivePlatform.Application.Common;
using OlivePlatform.Domain;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Enums;
using OlivePlatform.Domain.Interfaces.Repositories;
using YourProject.Application.Constants;
using YourProject.Application.Services;

namespace OlivePlatform.Application.Features.OilMovements.Commands;

/// <summary>
/// Transfert d'huile entre deux citernes de stockage de la même catégorie.
/// L'huile d'une citerne tampon passe par son analyse (TransferOilToStorageCommand).
/// </summary>
public class TransferOilBetweenTanksCommand : IRequest<int>
{
    public int SourceTankId { get; set; }

    public int DestinationTankId { get; set; }

    public decimal QuantityLiters { get; set; }

    public string? Notes { get; set; }
}

public class TransferOilBetweenTanksCommandHandler
    : IRequestHandler<TransferOilBetweenTanksCommand, int>
{
    private readonly ITankRepository _tankRepository;
    private readonly IOilMovementRepository _oilMovementRepository;
    private readonly IDocumentNumberService _documentNumberService;
    private readonly IUnitOfWork _unitOfWork;

    public TransferOilBetweenTanksCommandHandler(
        ITankRepository tankRepository,
        IOilMovementRepository oilMovementRepository,
        IDocumentNumberService documentNumberService,
        IUnitOfWork unitOfWork)
    {
        _tankRepository = tankRepository;
        _oilMovementRepository = oilMovementRepository;
        _documentNumberService = documentNumberService;
        _unitOfWork = unitOfWork;
    }

    public async Task<int> Handle(
        TransferOilBetweenTanksCommand request,
        CancellationToken cancellationToken)
    {
        if (request.QuantityLiters <= 0)
        {
            throw new BusinessException("Renseignez une quantité à transférer supérieure à 0.");
        }

        if (request.SourceTankId == request.DestinationTankId)
        {
            throw new BusinessException("Choisissez une citerne de destination différente.");
        }

        var source = await _tankRepository.GetByIdAsync(request.SourceTankId, cancellationToken)
            ?? throw new BusinessException("Citerne d'origine introuvable.");

        if (source.IsBuffer)
        {
            throw new BusinessException(
                "L'huile d'une citerne tampon se transfère après son analyse, vers la citerne de sa catégorie.");
        }

        var destination = await _tankRepository.GetByIdAsync(request.DestinationTankId, cancellationToken);

        if (destination is null || destination.IsBuffer || destination.Status != "active")
        {
            throw new BusinessException(
                "La citerne de destination doit être une citerne de stockage active.");
        }

        // Pas de mélange de catégories.
        if (destination.OilCategory != source.OilCategory)
        {
            throw new BusinessException(
                "La citerne de destination doit être de la même catégorie d'huile.");
        }

        var balances = await _oilMovementRepository.GetTankBalancesAsync(
            source.Id,
            cancellationToken);

        var available = balances.Sum(balance => balance.QuantityLiters);

        if (request.QuantityLiters > available)
        {
            throw new BusinessException(
                $"{source.Code} ne contient que {available:0.#} L.");
        }

        var destinationQuantity = await _tankRepository.GetCurrentQuantityAsync(
            destination.Id,
            cancellationToken);

        var freeLiters = destination.CapacityLiters - destinationQuantity;

        if (freeLiters < request.QuantityLiters)
        {
            throw new BusinessException(
                $"Place insuffisante dans {destination.Code} : {freeLiters:0.#} L libres pour {request.QuantityLiters:0.#} L.");
        }

        var now = DateTime.UtcNow;
        var remaining = request.QuantityLiters;
        var movementCount = 0;

        await _unitOfWork.ExecuteInTransactionAsync(async ct =>
        {
            // Les lots les plus anciens sortent en premier ; un mouvement par lot.
            foreach (var balance in balances)
            {
                if (remaining <= 0) break;

                var quantity = Math.Min(remaining, balance.QuantityLiters);

                await _oilMovementRepository.AddAsync(new OilMovement
                {
                    MovementNumber = await _documentNumberService.GenerateAsync(
                        DocumentTypes.OilMovement,
                        DocumentPrefixes.OilMovement,
                        now.Year,
                        ct),
                    MovementType = OilMovementType.Transfer,
                    MovementDate = now,
                    OilBatchId = balance.OilBatchId,
                    SourceTankId = source.Id,
                    DestinationTankId = destination.Id,
                    QuantityLiters = quantity,
                    Notes = request.Notes,
                }, ct);

                remaining -= quantity;
                movementCount++;
            }
        }, cancellationToken);

        return movementCount;
    }
}
