using MediatR;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Application.Features.Tanks.Commands;

public class UpdateTankCommand : IRequest<bool>
{
    public int Id { get; set; }

    public string Code { get; set; } = null!;

    public string? Name { get; set; }

    public decimal CapacityLiters { get; set; }

    public string? Location { get; set; }

    public string? TankType { get; set; }

    public string Status { get; set; } = "active";

    public string? Notes { get; set; }
}

public class UpdateTankCommandHandler
    : IRequestHandler<UpdateTankCommand, bool>
{
    private readonly ITankRepository _repository;

    public UpdateTankCommandHandler(
        ITankRepository repository)
    {
        _repository = repository;
    }

    public async Task<bool> Handle(
        UpdateTankCommand request,
        CancellationToken cancellationToken)
    {
        var tank = await _repository.GetByIdAsync(
            request.Id,
            cancellationToken);

        if (tank is null)
            return false;

        tank.Code = request.Code;
        tank.Name = request.Name;
        tank.CapacityLiters = request.CapacityLiters;
        tank.Location = request.Location;
        tank.TankType = request.TankType;
        tank.Status = request.Status;
        tank.Notes = request.Notes;

        await _repository.UpdateAsync(
            tank,
            cancellationToken);

        return true;
    }
}