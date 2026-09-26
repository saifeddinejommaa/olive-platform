using MediatR;
using OlivePlatform.Application.Common;
using OlivePlatform.Domain.Enums;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Application.Features.Harvests.Commands.UpdateHarvest;

public class UpdateHarvestCommand : IRequest<Unit>
{
    public int Id { get; set; }

    public int? PlotId { get; set; }

    public int? PlannedTrees { get; set; }

    public DateTime? PlannedDate { get; set; }

    public string? Notes { get; set; }

    public HarvestType? HarvestType { get; set; }
}

public class UpdateHarvestCommandHandler
    : IRequestHandler<UpdateHarvestCommand, Unit>
{
    private readonly IHarvestRepository _repository;

    public UpdateHarvestCommandHandler(
        IHarvestRepository repository)
    {
        _repository = repository;
    }

    public async Task<Unit> Handle(
        UpdateHarvestCommand request,
        CancellationToken cancellationToken)
    {
        var entity = await _repository.GetByIdAsync(
            request.Id,
            cancellationToken);

        if (entity == null)
        {
            throw new KeyNotFoundException(
                $"Harvest with id '{request.Id}' was not found.");
        }

        if (request.PlotId.HasValue)
        {
            if (request.PlotId.Value <= 0)
            {
                throw new ArgumentException(
                    "Plot id must be greater than zero.");
            }

            entity.PlotId = request.PlotId.Value;
        }

        if (request.PlannedTrees.HasValue)
        {
            if (request.PlannedTrees.Value < 0)
            {
                throw new ArgumentException(
                    "Planned trees cannot be negative.");
            }

            entity.PlannedTrees = request.PlannedTrees.Value;
        }

        if (request.PlannedDate.HasValue)
        {
            entity.PlannedDate = request.PlannedDate.Value.ToUtc();
        }

        if (request.HarvestType.HasValue)
        {
            entity.HarvestType = request.HarvestType.Value;
        }

        if (request.Notes != null)
        {
            entity.Notes = request.Notes;
        }

        entity.UpdatedAt = DateTime.UtcNow;

        await _repository.UpdateAsync(
            entity,
            cancellationToken);

        return Unit.Value;
    }
}