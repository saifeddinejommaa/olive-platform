using MediatR;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Enums;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Application.Features.Payments.Commands;

public class CreatePaymentCommand : IRequest<int>
{
    public string PaymentNumber { get; set; } = null!;

    public DateTime PaymentDate { get; set; }

    public decimal Amount { get; set; }

    public int PaymentMethod { get; set; } = -1;

    public int? InvoiceId { get; set; }

    public string? SupplierName { get; set; }

    public string? WorkerName { get; set; }

    public string? Reference { get; set; }

    public string? Notes { get; set; }
}

public class CreatePaymentCommandHandler
    : IRequestHandler<CreatePaymentCommand, int>
{
    private readonly IPaymentRepository _paymentRepository;

    public CreatePaymentCommandHandler(
        IPaymentRepository paymentRepository)
    {
        _paymentRepository = paymentRepository;
    }

    public async Task<int> Handle(
        CreatePaymentCommand request,
        CancellationToken cancellationToken)
    {
        var payment = new Payment
        {
            PaymentNumber = request.PaymentNumber,
            PaymentDate = request.PaymentDate,
            Amount = request.Amount,
            PaymentMethod = (PaymentMethod)request.PaymentMethod,
            InvoiceId = request.InvoiceId,
            SupplierName = request.SupplierName,
            WorkerName = request.WorkerName,
            Reference = request.Reference,
            Notes = request.Notes
        };

        await _paymentRepository.AddAsync(
            payment,
            cancellationToken);

        return payment.Id;
    }
}