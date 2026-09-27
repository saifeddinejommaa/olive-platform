using MediatR;
using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.Seasons;
using OlivePlatform.Application.Services;
using OlivePlatform.Domain;
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

    // Modifiables uniquement pendant la récolte (statut en cours).
    public decimal? QuantityKg { get; set; }

    public int? HarvestedTrees { get; set; }
}

public class UpdateHarvestCommandHandler
    : IRequestHandler<UpdateHarvestCommand, Unit>
{
    private readonly IHarvestRepository _repository;
    private readonly ISeasonService _seasonService;

    public UpdateHarvestCommandHandler(
        IHarvestRepository repository,
        ISeasonService seasonService)
    {
        _repository = repository;
        _seasonService = seasonService;
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

        if (request.PlannedDate.HasValue)
        {
            if (entity.Status != ProductionStatus.Planned)
            {
                throw new BusinessException(
                    "La date de récolte ne peut être modifiée que si la récolte n'est pas encore lancée.");
            }

            await _seasonService.EnsureDateInSeasonAsync(
                entity.SeasonId,
                SeasonCalendar.ToBusinessDate(request.PlannedDate.Value),
                cancellationToken);
        }
        else
        {
            await _seasonService.EnsureSeasonOpenAsync(
                entity.SeasonId,
                cancellationToken);
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

        if (request.QuantityKg.HasValue || request.HarvestedTrees.HasValue)
        {
            if (entity.Status != ProductionStatus.InProgress)
            {
                throw new BusinessException(
                    "La quantité et le nombre d'arbres récoltés ne sont modifiables que pendant la récolte.");
            }

            if (request.QuantityKg is < 0)
            {
                throw new BusinessException(
                    "La quantité récoltée ne peut pas être négative.");
            }

            if (request.HarvestedTrees is < 0)
            {
                throw new BusinessException(
                    "Le nombre d'arbres récoltés ne peut pas être négatif.");
            }

            if (request.QuantityKg.HasValue)
            {
                entity.QuantityKg = request.QuantityKg.Value;
            }

            if (request.HarvestedTrees.HasValue)
            {
                entity.HarvestedTrees = request.HarvestedTrees.Value;
            }
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