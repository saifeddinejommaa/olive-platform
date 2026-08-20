using MediatR;
using OlivePlatform.Domain.Enums;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Application.Features.Invoices.Commands;

public class UpdateInvoiceCommand : IRequest<bool>
{
    public int Id { get; set; }

    public string InvoiceNumber { get; set; } = null!;

    public int InvoiceType { get; set; } = 0;

    public string? SupplierName { get; set; }

    public string? CustomerName { get; set; }

    public DateTime InvoiceDate { get; set; }

    public DateTime? DueDate { get; set; }

    public decimal TaxAmount { get; set; }

    public int Status { get; set; } = 0;

    public string? Notes { get; set; }

}

public class UpdateInvoiceCommandHandler
    : IRequestHandler<UpdateInvoiceCommand, bool>
{
    private readonly IInvoiceRepository _repository;

    public UpdateInvoiceCommandHandler(
        IInvoiceRepository repository)
    {
        _repository = repository;
    }

    public async Task<bool> Handle(
        UpdateInvoiceCommand request,
        CancellationToken cancellationToken)
    {
        var invoice = await _repository.GetByIdAsync(
            request.Id,
            cancellationToken);

        if (invoice is null)
            return false;

        invoice.InvoiceNumber = request.InvoiceNumber;
        invoice.InvoiceType = (InvoiceType)request.InvoiceType;
        invoice.SupplierName = request.SupplierName;
        invoice.CustomerName = request.CustomerName;
        invoice.InvoiceDate = request.InvoiceDate;
        invoice.DueDate = request.DueDate;
        invoice.TaxAmount = request.TaxAmount;
        invoice.Status = (InvoiceStatus)request.Status;
        invoice.Notes = request.Notes;
        /*
        invoice.Items.Clear();
        
        foreach (var item in request.Items)
        {
            invoice.Items.Add(new InvoiceItem
            {
                Id = item.Id ?? 0,
                Description = item.Description,
                Quantity = item.Quantity,
                UnitPrice = item.UnitPrice,
                TaxRate = item.TaxRate,
                InvoiceId = invoice.Id
            });
        }

        invoice.Subtotal = request.Items.Sum(x =>
            x.Quantity * x.UnitPrice);

        invoice.TotalAmount =
            invoice.Subtotal + invoice.TaxAmount;
        */

        await _repository.UpdateAsync(
            invoice,
            cancellationToken);

        return true;
    }
}