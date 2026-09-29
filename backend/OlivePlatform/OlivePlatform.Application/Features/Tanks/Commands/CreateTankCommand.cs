using MediatR;
using OlivePlatform.Domain;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Enums;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Application.Features.Tanks.Commands;

public class CreateTankCommand : IRequest<int>
{
    public string Code { get; set; } = null!;

    public string? Name { get; set; }

    public decimal CapacityLiters { get; set; }

    public TankType TankType { get; set; } = TankType.Storage;

    // Obligatoire pour une citerne de stockage ; ignorée pour une tampon.
    public OilCategory? OilCategory { get; set; }

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
        if (request.CapacityLiters <= 0)
        {
            throw new BusinessException("La capacité de la citerne doit être supérieure à 0.");
        }

        var now = DateTime.UtcNow;

        var tank = new Tank
        {
            Code = request.Code,
            Name = request.Name,
            CapacityLiters = request.CapacityLiters,
            TankType = request.TankType,
            OilCategory = TankCategoryRules.Resolve(request.TankType, request.OilCategory),
            Status = request.Status,
            Notes = request.Notes,
            UpdatedAt = now
        };

        await _repository.AddAsync(
            tank,
            cancellationToken);

        return tank.Id;
    }
}
