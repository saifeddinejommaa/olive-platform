using MediatR;
using OlivePlatform.Domain.Enums;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Application.Features.Harvests.Commands.UpdateHarvest;

public class UpdateHarvestCommand : IRequest
{
    public int Id { get; set; }
    public int? VarietyId { get; set; }
    public DateOnly? HarvestDate { get; set; }
    public DateTime? StartTime { get; set; }
    public ProductionStatus? Status { get; set; }
    public string? Notes { get; set; }
}

public class UpdateHarvestCommandHandler : IRequestHandler<UpdateHarvestCommand>
{
    private readonly IHarvestRepository _repository;

    public UpdateHarvestCommandHandler(IHarvestRepository repository)
    {
        _repository = repository;
    }

    public async Task Handle(UpdateHarvestCommand request, CancellationToken cancellationToken)
    {
        var entity = await _repository.GetByIdAsync(request.Id, cancellationToken);

        if (entity == null)
            throw new KeyNotFoundException($"Harvest with id '{request.Id}' was not found.");

        if (request.VarietyId.HasValue)
            entity.VarietyId = request.VarietyId.Value;

        if (request.HarvestDate.HasValue)
            entity.HarvestDate = request.HarvestDate.Value;

        if (request.StartTime.HasValue)
            entity.StartTime = request.StartTime.Value;

        if (request.Status.HasValue)
            entity.Status = request.Status.Value;

        if (request.Notes != null)
            entity.Notes = request.Notes;

        entity.UpdatedAt = DateTime.UtcNow;

        await _repository.UpdateAsync(entity, cancellationToken);
    }
}