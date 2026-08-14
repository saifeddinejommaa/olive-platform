using MediatR;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Enums;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Application.Features.Invoices.Commands;

public class CreateInvoiceCommand : IRequest<int>
{
    public string InvoiceNumber { get; set; } = null!;

    public int InvoiceType { get; set; } = 0;

    public string? SupplierName { get; set; }

    public string? CustomerName { get; set; }

    public DateTime InvoiceDate { get; set; }

    public DateTime? DueDate { get; set; }

    public decimal TaxAmount { get; set; }

    public string Status { get; set; } = "draft";

    public string? Notes { get; set; }
}

public class CreateInvoiceCommandHandler
    : IRequestHandler<CreateInvoiceCommand, int>
{
    private readonly IInvoiceRepository _repository;

    public CreateInvoiceCommandHandler(
        IInvoiceRepository repository)
    {
        _repository = repository;
    }

    public async Task<int> Handle(
        CreateInvoiceCommand request,
        CancellationToken cancellationToken)
    {
        var invoice = new Invoice
        {
            InvoiceNumber = request.InvoiceNumber,
            InvoiceType =   (InvoiceType)request.InvoiceType,
            SupplierName = request.SupplierName,
            CustomerName = request.CustomerName,
            InvoiceDate = request.InvoiceDate,
            DueDate = request.DueDate,
            TaxAmount = request.TaxAmount,
            Status = (InvoiceStatus)Enum.Parse(typeof(InvoiceStatus), request.Status),
            Notes = request.Notes,
            /*Subtotal = request.Items.Sum(x =>
                x.Quantity * x.UnitPrice),
            TotalAmount =
                request.Items.Sum(x =>
                    x.Quantity * x.UnitPrice)
                + request.TaxAmount*/
        };
        /*
        foreach (var item in request.Items)
        {
            invoice.Items.Add(new InvoiceItem
            {
                Description = item.Description,
                Quantity = item.Quantity,
                UnitPrice = item.UnitPrice,
                TaxRate = item.TaxRate
            });
        }
        */

        await _repository.AddAsync(
            invoice,
            cancellationToken);

        return invoice.Id;
    }
}