using MediatR;
using OlivePlatform.Domain.Enums;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Application.Features.Harvests.Commands.CloseHarvest;

public class CloseHarvestCommand : IRequest
{
    public int Id { get; set; }
    public decimal QuantityKg { get; set; }
}

public class CloseHarvestCommandHandler : IRequestHandler<CloseHarvestCommand>
{
    private readonly IHarvestRepository _repository;

    public CloseHarvestCommandHandler(IHarvestRepository repository)
    {
        _repository = repository;
    }

    public async Task Handle(CloseHarvestCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetByIdAsync(request.Id, cancellationToken);

        if (entity == null)
            throw new KeyNotFoundException(
                $"Harvest with id '{request.Id}' was not found.");

        if (entity.Status != ProductionStatus.InProgress)
            throw new InvalidOperationException(
                "Seule une récolte en cours peut être clôturée.");

        if (request.QuantityKg <= 0)
            throw new InvalidOperationException(
                "La quantité récoltée doit être supérieure à 0.");

        entity.Status = ProductionStatus.Completed;
        entity.QuantityKg = request.QuantityKg;
        entity.EndTime = DateTime.UtcNow;
        entity.UpdatedAt = DateTime.UtcNow;

        await _repository.UpdateAsync(entity, cancellationToken);
    }
}