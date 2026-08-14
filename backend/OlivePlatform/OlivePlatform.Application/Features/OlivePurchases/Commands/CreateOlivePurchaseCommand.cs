using MediatR;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Enums;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Application.Features.OlivePurchases.Commands.CreateOlivePurchase;

public class CreateOlivePurchaseCommand : IRequest<int>
{
    public string PurchaseNumber { get; set; } = null!;
    public string SupplierName { get; set; } = null!;
    public DateOnly PurchaseDate { get; set; }
    public PurchaseStatus Status { get; set; }
    public string? Notes { get; set; }
}

public class CreateOlivePurchaseCommandHandler
    : IRequestHandler<CreateOlivePurchaseCommand, int>
{
    private readonly IOlivePurchaseRepository _repository;

    public CreateOlivePurchaseCommandHandler(
        IOlivePurchaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<int> Handle(
        CreateOlivePurchaseCommand request,
        CancellationToken cancellationToken)
    {
        var existing =
            await _repository.GetByNumberAsync(
                request.PurchaseNumber,
                cancellationToken);

        if (existing != null)
            throw new InvalidOperationException(
                $"Purchase '{request.PurchaseNumber}' already exists.");

        var entity = new OlivePurchase
        {
            PurchaseNumber = request.PurchaseNumber,
            SupplierName = request.SupplierName,
            PurchaseDate = request.PurchaseDate,
            Status = request.Status,
            Notes = request.Notes
        };

        await _repository.AddAsync(entity, cancellationToken);

        return entity.Id;
    }
}