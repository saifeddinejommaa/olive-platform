using MediatR;
using OlivePlatform.Domain.Enums;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Application.Features.OlivePurchases.Commands.UpdateOlivePurchase;

public class UpdateOlivePurchaseCommand : IRequest<bool>
{
    public int Id { get; set; }
    public string PurchaseNumber { get; set; } = null!;
    public string SupplierName { get; set; } = null!;
    public DateOnly PurchaseDate { get; set; }
    public PurchaseStatus Status { get; set; }
    public string? Notes { get; set; }
}

public class UpdateOlivePurchaseCommandHandler
    : IRequestHandler<UpdateOlivePurchaseCommand, bool>
{
    private readonly IOlivePurchaseRepository _repository;

    public UpdateOlivePurchaseCommandHandler(
        IOlivePurchaseRepository repository)
    {
        _repository = repository;
    }

    public async Task<bool> Handle(
        UpdateOlivePurchaseCommand request,
        CancellationToken cancellationToken)
    {
        var entity =
            await _repository.GetByIdAsync(
                request.Id,
                cancellationToken);

        if (entity == null)
            throw new KeyNotFoundException(
                $"Purchase with id '{request.Id}' was not found.");

        entity.PurchaseNumber = request.PurchaseNumber;
        entity.SupplierName = request.SupplierName;
        entity.PurchaseDate = request.PurchaseDate;
        entity.Status = request.Status;
        entity.Notes = request.Notes;

        await _repository.UpdateAsync(
            entity,
            cancellationToken);

        return true;
    }
}