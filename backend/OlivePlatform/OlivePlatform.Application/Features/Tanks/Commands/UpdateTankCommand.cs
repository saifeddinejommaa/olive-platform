using MediatR;
using OlivePlatform.Domain;
using OlivePlatform.Domain.Enums;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Application.Features.Tanks.Commands;

public class UpdateTankCommand : IRequest<bool>
{
    public int Id { get; set; }

    public string Code { get; set; } = null!;

    public string? Name { get; set; }

    public decimal CapacityLiters { get; set; }

    public TankType TankType { get; set; } = TankType.Storage;

    // Obligatoire pour une citerne de stockage ; ignorée pour une tampon.
    public OilCategory? OilCategory { get; set; }

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

        if (request.CapacityLiters <= 0)
        {
            throw new BusinessException("La capacité de la citerne doit être supérieure à 0.");
        }

        tank.Code = request.Code;
        tank.Name = request.Name;
        tank.CapacityLiters = request.CapacityLiters;
        tank.TankType = request.TankType;
        tank.OilCategory = TankCategoryRules.Resolve(request.TankType, request.OilCategory);
        tank.Status = request.Status;
        tank.Notes = request.Notes;
        tank.UpdatedAt = DateTime.UtcNow;

        await _repository.UpdateAsync(
            tank,
            cancellationToken);

        return true;
    }
}
