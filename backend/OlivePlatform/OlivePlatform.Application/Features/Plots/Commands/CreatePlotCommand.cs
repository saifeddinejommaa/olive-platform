using MediatR;
using OlivePlatform.Application.Features.Plots.Responses;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Application.Features.Plots.Commands.CreatePlot;

public class CreatePlotCommand : IRequest<PlotForDetailsResponse>
{
    public string Code { get; set; } = null!;

    public string? Name { get; set; }

    public decimal AreaHectares { get; set; }

    public int NumberOfTrees { get; set; }

    public int? PlantingYear { get; set; }

    public string? Location { get; set; }

    public string? Notes { get; set; }

    public bool IsActive { get; set; } = true;
}

public class CreatePlotCommandHandler
    : IRequestHandler<CreatePlotCommand, PlotForDetailsResponse>
{
    private readonly IPlotRepository _plotRepository;

    public CreatePlotCommandHandler(
        IPlotRepository plotRepository)
    {
        _plotRepository = plotRepository;
    }

    public async Task<PlotForDetailsResponse> Handle(
        CreatePlotCommand request,
        CancellationToken cancellationToken)
    {
        var existingPlot =
            await _plotRepository.GetByCodeAsync(
                request.Code,
                cancellationToken);

        if (existingPlot != null)
        {
            throw new Exception(
                $"A plot with code '{request.Code}' already exists.");
        }

        var plot = new Plot
        {
            Code = request.Code,
            Name = request.Name,
            AreaHectares = request.AreaHectares,
            NumberOfTrees = request.NumberOfTrees,
            PlantingYear = request.PlantingYear,
            Location = request.Location,
            Notes = request.Notes,
            IsActive = request.IsActive
        };

        await _plotRepository.AddAsync(
            plot,
            cancellationToken);

        return new PlotForDetailsResponse
        {
            Id = plot.Id,
            Code = plot.Code,
            Name = plot.Name,
            AreaHectares = plot.AreaHectares,
            NumberOfTrees = plot.NumberOfTrees,
            PlantingYear = plot.PlantingYear,
            Location = plot.Location,
            Notes = plot.Notes,
            IsActive = plot.IsActive
        };
    }
}