using MediatR;
using OlivePlatform.Application.Common;
using OlivePlatform.Application.Services;
using OlivePlatform.Domain;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Enums;
using OlivePlatform.Domain.Interfaces.Repositories;
using YourProject.Application.Constants;
using YourProject.Application.Services;

namespace OlivePlatform.Application.Features.OilSales.Commands;

// ============================================================
// DELIVER : l'huile sort des citernes
// ============================================================

public class DeliverOilSaleCommand : IRequest<Unit>
{
    public int Id { get; set; }

    // Paiement reçu à l'enlèvement (facultatif : le client peut payer plus tard).
    public OilSalePaymentRequest? Payment { get; set; }
}

public class OilSalePaymentRequest
{
    public decimal Amount { get; set; }

    // Espèce, chèque ou virement.
    public PaymentMethod PaymentMethod { get; set; }

    // N° de chèque ou de virement.
    public string? Reference { get; set; }

    public DateTime? PaymentDate { get; set; }

    public string? Notes { get; set; }
}

public class DeliverOilSaleCommandHandler : IRequestHandler<DeliverOilSaleCommand, Unit>
{
    private readonly IOilSaleRepository _repository;
    private readonly ITankRepository _tankRepository;
    private readonly IOilMovementRepository _oilMovementRepository;
    private readonly ISeasonService _seasonService;
    private readonly IDocumentNumberService _documentNumberService;
    private readonly IUnitOfWork _unitOfWork;

    public DeliverOilSaleCommandHandler(
        IOilSaleRepository repository,
        ITankRepository tankRepository,
        IOilMovementRepository oilMovementRepository,
        ISeasonService seasonService,
        IDocumentNumberService documentNumberService,
        IUnitOfWork unitOfWork)
    {
        _repository = repository;
        _tankRepository = tankRepository;
        _oilMovementRepository = oilMovementRepository;
        _seasonService = seasonService;
        _documentNumberService = documentNumberService;
        _unitOfWork = unitOfWork;
    }

    public async Task<Unit> Handle(DeliverOilSaleCommand request, CancellationToken cancellationToken)
    {
        var sale = await _repository.GetWithLinesAsync(request.Id, cancellationToken)
            ?? throw new KeyNotFoundException($"Oil sale {request.Id} not found.");

        await _seasonService.EnsureSeasonOpenAsync(sale.SeasonId, cancellationToken);

        if (sale.Status != OilSaleStatus.Draft)
        {
            throw new BusinessException("Seule une vente en brouillon peut être livrée.");
        }

        // Lots présents dans chaque citerne, vérifiés avant toute écriture.
        var balancesByLine = new Dictionary<OilSaleLine, IReadOnlyList<OilBatchBalance>>();

        foreach (var line in sale.Lines)
        {
            var tank = await _tankRepository.GetByIdAsync(line.TankId, cancellationToken)
                ?? throw new BusinessException("Citerne introuvable.");

            var balances = await _oilMovementRepository.GetTankBalancesAsync(tank.Id, cancellationToken);
            var available = balances.Sum(balance => balance.QuantityLiters);

            if (line.QuantityLiters > available)
            {
                throw new BusinessException(
                    $"{tank.Code} ne contient plus que {available:0.#} L pour {line.QuantityLiters:0.#} L vendus.");
            }

            balancesByLine[line] = balances;
        }

        // Paiement à l'enlèvement : au plus le montant TTC de la vente.
        if (request.Payment is not null)
        {
            if (request.Payment.Amount <= 0)
            {
                throw new BusinessException("Le montant encaissé doit être supérieur à 0.");
            }

            if (request.Payment.Amount > sale.TotalAmount)
            {
                throw new BusinessException(
                    $"Le montant encaissé ({request.Payment.Amount:0.000} DT) dépasse le total de la vente ({sale.TotalAmount:0.000} DT).");
            }

            if (!Enum.IsDefined(request.Payment.PaymentMethod))
            {
                throw new BusinessException("Choisissez le mode de paiement.");
            }
        }

        var now = DateTime.UtcNow;

        await _unitOfWork.ExecuteInTransactionAsync(async ct =>
        {
            if (request.Payment is not null)
            {
                await _repository.AddPaymentAsync(new OilSalePayment
                {
                    OilSaleId = sale.Id,
                    PaymentDate = DateOnly.FromDateTime(request.Payment.PaymentDate ?? now),
                    Amount = request.Payment.Amount,
                    PaymentMethod = request.Payment.PaymentMethod,
                    Reference = string.IsNullOrWhiteSpace(request.Payment.Reference)
                        ? null
                        : request.Payment.Reference.Trim(),
                    Notes = string.IsNullOrWhiteSpace(request.Payment.Notes)
                        ? null
                        : request.Payment.Notes.Trim(),
                    CreatedAt = now,
                }, ct);
            }

            foreach (var (line, balances) in balancesByLine)
            {
                var remaining = line.QuantityLiters;
                var movements = new List<OilMovement>();

                // Les lots les plus anciens sortent en premier ; un mouvement par lot.
                foreach (var balance in balances)
                {
                    if (remaining <= 0) break;

                    var quantity = Math.Min(remaining, balance.QuantityLiters);

                    var movement = new OilMovement
                    {
                        MovementNumber = await _documentNumberService.GenerateAsync(
                            DocumentTypes.OilMovement,
                            DocumentPrefixes.OilMovement,
                            now.Year,
                            ct),
                        MovementType = OilMovementType.SaleOut,
                        MovementDate = now,
                        OilBatchId = balance.OilBatchId,
                        SourceTankId = line.TankId,
                        QuantityLiters = quantity,
                        Notes = $"Vente {sale.Reference}",
                    };

                    await _oilMovementRepository.AddAsync(movement, ct);
                    movements.Add(movement);

                    remaining -= quantity;
                }

                // Les Id des mouvements sont nécessaires pour les rattacher à la ligne.
                await _unitOfWork.SaveChangesAsync(ct);

                foreach (var movement in movements)
                {
                    await _repository.AddLineMovementAsync(new OilSaleLineMovement
                    {
                        OilSaleLineId = line.Id,
                        OilMovementId = movement.Id,
                    }, ct);
                }
            }

            sale.Status = OilSaleStatus.Delivered;
            sale.DeliveredAt = now;
            sale.CreatedAt = DateTime.SpecifyKind(sale.CreatedAt, DateTimeKind.Utc);
            sale.UpdatedAt = now;

            await _repository.UpdateAsync(sale, ct);
        }, cancellationToken);

        return Unit.Value;
    }
}

// ============================================================
// CANCEL : seulement un brouillon (le stock n'a pas bougé)
// ============================================================

public class CancelOilSaleCommand : IRequest<Unit>
{
    public int Id { get; set; }
}

public class CancelOilSaleCommandHandler : IRequestHandler<CancelOilSaleCommand, Unit>
{
    private readonly IOilSaleRepository _repository;
    private readonly ISeasonService _seasonService;
    private readonly IUnitOfWork _unitOfWork;

    public CancelOilSaleCommandHandler(
        IOilSaleRepository repository,
        ISeasonService seasonService,
        IUnitOfWork unitOfWork)
    {
        _repository = repository;
        _seasonService = seasonService;
        _unitOfWork = unitOfWork;
    }

    public async Task<Unit> Handle(CancelOilSaleCommand request, CancellationToken cancellationToken)
    {
        var sale = await _repository.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new KeyNotFoundException($"Oil sale {request.Id} not found.");

        await _seasonService.EnsureSeasonOpenAsync(sale.SeasonId, cancellationToken);

        if (sale.Status != OilSaleStatus.Draft)
        {
            throw new BusinessException(
                "Seule une vente en brouillon peut être annulée : l'huile d'une vente livrée est déjà sortie.");
        }

        sale.Status = OilSaleStatus.Cancelled;
        sale.CreatedAt = DateTime.SpecifyKind(sale.CreatedAt, DateTimeKind.Utc);
        sale.UpdatedAt = DateTime.UtcNow;

        await _repository.UpdateAsync(sale, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Unit.Value;
    }
}
