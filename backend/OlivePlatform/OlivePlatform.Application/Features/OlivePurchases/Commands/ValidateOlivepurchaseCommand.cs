using MediatR;
using OlivePlatform.Application.Services;
using OlivePlatform.Domain.Enums;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Application.Features.OlivePurchases.Commands.UpdateOlivePurchase;

public class ValidateOlivePurchaseCommand : IRequest<Unit>
{
    public int Id { get; set; }
}

public class ValidateOlivePurchaseCommandHandler
    : IRequestHandler<ValidateOlivePurchaseCommand, Unit>
{
    private readonly IOlivePurchaseRepository _repository;
    private readonly ISeasonService _seasonService;

    public ValidateOlivePurchaseCommandHandler(
        IOlivePurchaseRepository repository,
        ISeasonService seasonService)
    {
        _repository = repository;
        _seasonService = seasonService;
    }

    public async Task<Unit> Handle(
        ValidateOlivePurchaseCommand request,
        CancellationToken cancellationToken)
    {
        var entity =
            await _repository.GetByIdAsync(
                request.Id,
                cancellationToken);

        if (entity == null)
            throw new KeyNotFoundException(
                $"Purchase with id '{request.Id}' was not found.");

        await _seasonService.EnsureSeasonOpenAsync(
            entity.SeasonId,
            cancellationToken);

        entity.Status = PurchaseStatus.Approved;
        entity.UpdatedAt = DateTime.UtcNow;

        await _repository.UpdateAsync(
            entity,
            cancellationToken);

        return Unit.Value;
    }
}