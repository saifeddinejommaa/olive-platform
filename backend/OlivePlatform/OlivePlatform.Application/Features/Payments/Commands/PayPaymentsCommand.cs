using MediatR;
using OlivePlatform.Application.Common;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Enums;
using OlivePlatform.Domain.Interfaces.Repositories;
using OlivePlatform.Domain.Repositories;

namespace OlivePlatform.Application.Features.Payments.Commands;

public class PayPaymentsCommand : IRequest<Unit>
{
    public CostLineType SourceType { get; set; }

    public decimal AmountToPay { get; set; }

    public required int[] SourceIds { get; set; }

    public PaymentMethod Method { get; set; }
}

public class PayPaymentsCommandHandler
    : IRequestHandler<PayPaymentsCommand, Unit>
{
    private readonly IHarvestCostLineRepository _costLineRepository;
    private readonly IOlivePurchaseRepository _olivePurchaseRepository;
    private readonly IFinancialPaymentRepository _financialPaymentRepository;
    private readonly IUnitOfWork _unitOfWork;

    public PayPaymentsCommandHandler(
        IHarvestCostLineRepository costLineRepository,
        IOlivePurchaseRepository olivePurchaseRepository,
         IFinancialPaymentRepository financialPaymentRepository,
        IUnitOfWork unitOfWork)
    {
        _costLineRepository = costLineRepository;
        _olivePurchaseRepository = olivePurchaseRepository;
        _financialPaymentRepository = financialPaymentRepository;
        _unitOfWork = unitOfWork;
    }

    public async Task<Unit> Handle(
    PayPaymentsCommand request,
    CancellationToken cancellationToken)
    {
        await _unitOfWork.ExecuteInTransactionAsync(async ct =>
        {
            if (request.SourceIds == null || request.SourceIds.Length == 0)
            {
                throw new InvalidOperationException(
                    "Aucune opération à régler.");
            }

            if (request.AmountToPay <= 0)
            {
                throw new InvalidOperationException(
                    "Le montant à régler doit être supérieur à 0.");
            }

            List<PaymentSourceResult> paymentSources;

            switch (request.SourceType)
            {
                case CostLineType.MainOeuvre:
                case CostLineType.Transport:

                    paymentSources =
                        await PayHarvestCostLinesAsync(
                            request,
                            ct);

                    break;

                case CostLineType.olivePurchase:

                    paymentSources =
                        await PayOlivePurchasesAsync(
                            request,
                            ct);

                    break;

                default:

                    throw new InvalidOperationException(
                        $"Le type de paiement '{request.SourceType}' n'est pas pris en charge.");
            }

            var financialPayment = new FinancialPayment
            {
                PaymentDate = DateOnly.FromDateTime(DateTime.UtcNow),
                Amount = request.AmountToPay,
                CreatedAt = DateTime.UtcNow,
                PaymentMethodId = (int)request.Method,

                Reference = null,
                Notes = null
            };

            foreach (var source in paymentSources)
            {
                financialPayment.Sources.Add(
                new FinancialPaymentSource
                {
                    SourceTypeId = (int)request.SourceType,
                    SourceId = source.SourceId,
                    Amount = source.Amount,
                    Notes = null
                });
            }

            await _financialPaymentRepository.AddAsync(
                    financialPayment,
                    ct);

        }, cancellationToken);

        return Unit.Value;
    }

    private async Task<List<PaymentSourceResult>> PayHarvestCostLinesAsync(
    PayPaymentsCommand request,
    CancellationToken cancellationToken)
    {
        var costLines = (
            await _costLineRepository.GetCostLinesForPaymentAsync(
                request.SourceIds,
                request.SourceType,
                cancellationToken)
        ).ToList();

        if (costLines.Count != request.SourceIds.Length)
        {
            throw new InvalidOperationException(
                "Certaines lignes de coût sont introuvables ou déjà réglées.");
        }

        var totalUnpaidAmount = costLines.Sum(
            costLine => costLine.UnpaidAmount);

        if (request.AmountToPay > totalUnpaidAmount)
        {
            throw new InvalidOperationException(
                $"Le montant à régler ({request.AmountToPay}) " +
                $"ne peut pas dépasser le montant restant ({totalUnpaidAmount}).");
        }

        var remainingAmount = request.AmountToPay;

        var paymentSources = new List<PaymentSourceResult>();

        foreach (var costLine in costLines)
        {
            if (remainingAmount <= 0)
            {
                break;
            }

            var amountToPayForThisCostLine = Math.Min(
                remainingAmount,
                costLine.UnpaidAmount);

            costLine.PaidAmount += amountToPayForThisCostLine;

            costLine.UnpaidAmount -= amountToPayForThisCostLine;

            if (costLine.UnpaidAmount == 0)
            {
                costLine.IsPaid = true;
                costLine.PaidDate =
                    DateOnly.FromDateTime(DateTime.UtcNow);
            }

            await _costLineRepository.UpdateAsync(
                costLine,
                cancellationToken);

            paymentSources.Add(new PaymentSourceResult
            {
                SourceId = costLine.Id,
                Amount = amountToPayForThisCostLine
            });

            remainingAmount -= amountToPayForThisCostLine;
        }

        return paymentSources;
    }

    private async Task<List<PaymentSourceResult>> PayOlivePurchasesAsync(
    PayPaymentsCommand request,
    CancellationToken cancellationToken)
    {
        var purchases = (
            await _olivePurchaseRepository.GetOlivePurchasesForPaymentAsync(
                request.SourceIds,
                cancellationToken)
        ).ToList();

        if (purchases.Count != request.SourceIds.Length)
        {
            throw new InvalidOperationException(
                "Certains achats d'olives sont introuvables ou déjà réglés.");
        }

        var totalUnpaidAmount = purchases.Sum(
            purchase => purchase.UnpaidAmount ?? 0m);

        if (request.AmountToPay > totalUnpaidAmount)
        {
            throw new InvalidOperationException(
                $"Le montant à régler ({request.AmountToPay}) " +
                $"ne peut pas dépasser le montant restant ({totalUnpaidAmount}).");
        }

        var remainingAmount = request.AmountToPay;

        var paymentSources = new List<PaymentSourceResult>();

        foreach (var purchase in purchases)
        {
            if (remainingAmount <= 0)
            {
                break;
            }

            var unpaidAmount = purchase.UnpaidAmount ?? 0m;

            if (unpaidAmount <= 0)
            {
                continue;
            }

            var amountToPayForThisPurchase = Math.Min(
                remainingAmount,
                unpaidAmount);

            purchase.PaidAmount += amountToPayForThisPurchase;

            purchase.UnpaidAmount =
                unpaidAmount - amountToPayForThisPurchase;

            if (purchase.UnpaidAmount == 0)
            {
                purchase.IsPaid = true;
            }

            await _olivePurchaseRepository.UpdateAsync(
                purchase,
                cancellationToken);

            paymentSources.Add(new PaymentSourceResult
            {
                SourceId = purchase.Id,
                Amount = amountToPayForThisPurchase
            });

            remainingAmount -= amountToPayForThisPurchase;
        }

        return paymentSources;
    }

    private class PaymentSourceResult
    {
        public long SourceId { get; set; }

        public decimal Amount { get; set; }
    }
}