using MediatR;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Application.Features.Plots.Commands.UpdatePlot;

public class UpdatePlotCommand : IRequest
{
    public int Id { get; set; }
    public string Code { get; set; } = null!;
    public string? Name { get; set; }
    public decimal AreaHectares { get; set; }
    public int NumberOfTrees { get; set; }
    public int? PlantingYear { get; set; }
    public string? Location { get; set; }
    public string? Notes { get; set; }
    public bool IsActive { get; set; }
}

public class UpdatePlotCommandHandler
    : IRequestHandler<UpdatePlotCommand>
{
    private readonly IPlotRepository _repository;

    public UpdatePlotCommandHandler(IPlotRepository repository)
    {
        _repository = repository;
    }

    public async Task Handle(
        UpdatePlotCommand request,
        CancellationToken cancellationToken)
    {
        var entity =
            await _repository.GetByIdAsync(
                request.Id,
                cancellationToken);

        if (entity == null)
            throw new KeyNotFoundException(
                $"Plot with id '{request.Id}' was not found.");

        var existing =
            await _repository.GetByCodeAsync(
                request.Code,
                cancellationToken);

        if (existing != null && existing.Id != request.Id)
            throw new InvalidOperationException(
                $"Plot with code '{request.Code}' already exists.");

        entity.Code = request.Code;
        entity.Name = request.Name;
        entity.AreaHectares = request.AreaHectares;
        entity.NumberOfTrees = request.NumberOfTrees;
        entity.PlantingYear = request.PlantingYear;
        entity.Location = request.Location;
        entity.Notes = request.Notes;
        entity.IsActive = request.IsActive;

        await _repository.UpdateAsync(
            entity,
            cancellationToken);
    }
}