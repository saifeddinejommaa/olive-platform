using MediatR;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Application.Features.Plots.Commands;

public class UpdatePlotCommand : IRequest<bool>
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public decimal AreaHectares { get; set; }

    public int NumberOfTrees { get; set; }

    public string? Notes { get; set; }
}

public class UpdatePlotCommandHandler
    : IRequestHandler<UpdatePlotCommand, bool>
{
    private readonly IPlotRepository _repository;

    public UpdatePlotCommandHandler(IPlotRepository repository)
    {
        _repository = repository;
    }

    public async Task<bool> Handle(
        UpdatePlotCommand request,
        CancellationToken cancellationToken)
    {
        var plot = await _repository.GetByIdAsync(
            request.Id,
            cancellationToken);

        if (plot is null)
        {
            throw new KeyNotFoundException(
                $"Plot {request.Id} not found.");
        }

        plot.Name = request.Name;
        plot.AreaHectares = request.AreaHectares;
        plot.NumberOfTrees = request.NumberOfTrees;
        plot.Notes = request.Notes;

        await _repository.UpdateAsync(
            plot,
            cancellationToken);

        return true;
    }

}