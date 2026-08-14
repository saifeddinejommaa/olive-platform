using MediatR;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Application.Features.Tanks.Commands;

public class CreateTankCommand : IRequest<int>
{
    public string Code { get; set; } = null!;

    public string? Name { get; set; }

    public decimal CapacityLiters { get; set; }

    public string? Location { get; set; }

    public string? TankType { get; set; }

    public string Status { get; set; } = "active";

    public string? Notes { get; set; }
}

public class CreateTankCommandHandler
    : IRequestHandler<CreateTankCommand, int>
{
    private readonly ITankRepository _repository;

    public CreateTankCommandHandler(
        ITankRepository repository)
    {
        _repository = repository;
    }

    public async Task<int> Handle(
        CreateTankCommand request,
        CancellationToken cancellationToken)
    {
        var tank = new Tank
        {
            Code = request.Code,
            Name = request.Name,
            CapacityLiters = request.CapacityLiters,
            Location = request.Location,
            TankType = request.TankType,
            Status = request.Status,
            Notes = request.Notes
        };

        await _repository.AddAsync(
            tank,
            cancellationToken);

        return tank.Id;
    }
}