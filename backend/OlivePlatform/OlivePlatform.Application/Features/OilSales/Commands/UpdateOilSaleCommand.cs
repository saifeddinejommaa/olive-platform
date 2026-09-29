using MediatR;
using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.Seasons;
using OlivePlatform.Application.Services;
using OlivePlatform.Domain;
using OlivePlatform.Domain.Enums;
using OlivePlatform.Domain.Interfaces.Repositories;

namespace OlivePlatform.Application.Features.OilSales.Commands;

/// <summary>
/// Modification d'une vente en brouillon (rien n'est encore sorti des citernes) :
/// client, date, TVA, notes et lignes, qui sont remplacées.
/// </summary>
public class UpdateOilSaleCommand : CreateOilSaleCommand
{
    public int Id { get; set; }
}

public class UpdateOilSaleCommandHandler : IRequestHandler<UpdateOilSaleCommand, int>
{
    private readonly IOilSaleRepository _repository;
    private readonly ICustomerRepository _customerRepository;
    private readonly ITankRepository _tankRepository;
    private readonly ISeasonService _seasonService;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateOilSaleCommandHandler(
        IOilSaleRepository repository,
        ICustomerRepository customerRepository,
        ITankRepository tankRepository,
        ISeasonService seasonService,
        IUnitOfWork unitOfWork)
    {
        _repository = repository;
        _customerRepository = customerRepository;
        _tankRepository = tankRepository;
        _seasonService = seasonService;
        _unitOfWork = unitOfWork;
    }

    public async Task<int> Handle(UpdateOilSaleCommand request, CancellationToken cancellationToken)
    {
        var sale = await _repository.GetWithLinesAsync(request.Id, cancellationToken)
            ?? throw new KeyNotFoundException($"Oil sale {request.Id} not found.");

        await _seasonService.EnsureSeasonOpenAsync(sale.SeasonId, cancellationToken);

        if (sale.Status != OilSaleStatus.Draft)
        {
            throw new BusinessException(
                "Seule une vente en brouillon peut être modifiée : l'huile d'une vente livrée est déjà sortie.");
        }

        var customer = await _customerRepository.GetByIdAsync(request.CustomerId, cancellationToken);

        if (customer is null || (!customer.IsActive && customer.Id != sale.CustomerId))
        {
            throw new BusinessException("Choisissez un client actif.");
        }

        if (request.TaxRate < 0)
        {
            throw new BusinessException("Le taux de TVA ne peut pas être négatif.");
        }

        var saleDate = SeasonCalendar.ToBusinessDate(request.SaleDate ?? DateTime.UtcNow);

        // La date reste dans la campagne de la vente.
        await _seasonService.EnsureDateInSeasonAsync(sale.SeasonId, saleDate, cancellationToken);

        var lines = await OilSaleLineRules.BuildLinesAsync(
            request.Lines,
            _tankRepository,
            cancellationToken);

        sale.CustomerId = customer.Id;
        sale.SaleDate = saleDate;
        sale.TaxRate = request.TaxRate;
        sale.Notes = string.IsNullOrWhiteSpace(request.Notes) ? null : request.Notes.Trim();

        // Lignes remplacées : les anciennes sont supprimées (brouillon, aucun mouvement lié).
        sale.Lines.Clear();
        sale.Lines.AddRange(lines);
        sale.ComputeTotals();

        sale.CreatedAt = DateTime.SpecifyKind(sale.CreatedAt, DateTimeKind.Utc);
        sale.UpdatedAt = DateTime.UtcNow;

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return sale.Id;
    }
}
