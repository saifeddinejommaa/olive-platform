using MediatR;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Application.Features.Plots.Commands;

public class UpdatePlotVarietyCommand : IRequest<bool>
{
    public int Id { get; set; }

    public int NumberOfTrees { get; set; }

    public decimal Percentage { get; set; }

    public string? Notes { get; set; }
}

public class UpdatePlotVarietyCommandHandler
    : IRequestHandler<UpdatePlotVarietyCommand, bool>
{
    private readonly IPlotVarietyRepository _repository;

    public UpdatePlotVarietyCommandHandler(
        IPlotVarietyRepository repository)
    {
        _repository = repository;
    }

    public async Task<bool> Handle(
        UpdatePlotVarietyCommand request,
        CancellationToken cancellationToken)
    {
        var plotVariety = await _repository.GetByIdAsync(
            request.Id,
            cancellationToken);

        if (plotVariety is null)
        {
            throw new KeyNotFoundException(
                $"Plot variety {request.Id} not found.");
        }

        plotVariety.NumberOfTrees = request.NumberOfTrees;
        plotVariety.Percentage = request.Percentage;
        plotVariety.Notes = request.Notes;

        await _repository.UpdateAsync(
            plotVariety,
            cancellationToken);

        return true;
    }
}