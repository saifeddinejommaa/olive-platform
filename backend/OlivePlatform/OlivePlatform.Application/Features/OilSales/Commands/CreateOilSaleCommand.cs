using MediatR;
using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.Seasons;
using OlivePlatform.Application.Services;
using OlivePlatform.Domain;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Enums;
using OlivePlatform.Domain.Interfaces.Repositories;
using YourProject.Application.Constants;
using YourProject.Application.Services;

namespace OlivePlatform.Application.Features.OilSales.Commands;

/// <summary>
/// Vente d'huile en vrac, créée en brouillon : le stock ne bouge qu'à la livraison.
/// </summary>
public class CreateOilSaleCommand : IRequest<int>
{
    public int CustomerId { get; set; }

    public DateTime? SaleDate { get; set; }

    // TVA en %.
    public decimal TaxRate { get; set; }

    public string? Notes { get; set; }

    // Campagne sélectionnée (sinon celle de la date de vente).
    public int? SeasonId { get; set; }

    public List<OilSaleLineRequest> Lines { get; set; } = [];
}

public class OilSaleLineRequest
{
    public int TankId { get; set; }

    public decimal QuantityLiters { get; set; }

    // Poids du ticket de pesée (obligatoire pour un prix au kg).
    public decimal? QuantityKg { get; set; }

    // « kg » ou « L ».
    public string PriceUnit { get; set; } = OilSaleLine.PriceUnitKg;

    public decimal UnitPrice { get; set; }
}

public class CreateOilSaleCommandHandler : IRequestHandler<CreateOilSaleCommand, int>
{
    private readonly IOilSaleRepository _repository;
    private readonly ICustomerRepository _customerRepository;
    private readonly ITankRepository _tankRepository;
    private readonly ISeasonService _seasonService;
    private readonly IDocumentNumberService _documentNumberService;
    private readonly IUnitOfWork _unitOfWork;

    public CreateOilSaleCommandHandler(
        IOilSaleRepository repository,
        ICustomerRepository customerRepository,
        ITankRepository tankRepository,
        ISeasonService seasonService,
        IDocumentNumberService documentNumberService,
        IUnitOfWork unitOfWork)
    {
        _repository = repository;
        _customerRepository = customerRepository;
        _tankRepository = tankRepository;
        _seasonService = seasonService;
        _documentNumberService = documentNumberService;
        _unitOfWork = unitOfWork;
    }

    public async Task<int> Handle(CreateOilSaleCommand request, CancellationToken cancellationToken)
    {
        var customer = await _customerRepository.GetByIdAsync(request.CustomerId, cancellationToken);

        if (customer is null || !customer.IsActive)
        {
            throw new BusinessException("Choisissez un client actif.");
        }

        if (request.TaxRate < 0)
        {
            throw new BusinessException("Le taux de TVA ne peut pas être négatif.");
        }

        var saleDate = SeasonCalendar.ToBusinessDate(request.SaleDate ?? DateTime.UtcNow);

        var seasonId = await _seasonService.ResolveForDateAsync(
            request.SeasonId,
            saleDate,
            cancellationToken);

        await _seasonService.EnsureSeasonOpenAsync(seasonId, cancellationToken);

        var lines = await OilSaleLineRules.BuildLinesAsync(
            request.Lines,
            _tankRepository,
            cancellationToken);

        var now = DateTime.UtcNow;

        var sale = new OilSale
        {
            Reference = await _documentNumberService.GenerateAsync(
                DocumentTypes.OilSale,
                DocumentPrefixes.OilSale,
                now.Year,
                cancellationToken),
            SeasonId = seasonId,
            CustomerId = customer.Id,
            SaleDate = saleDate,
            Status = OilSaleStatus.Draft,
            TaxRate = request.TaxRate,
            Notes = string.IsNullOrWhiteSpace(request.Notes) ? null : request.Notes.Trim(),
            CreatedAt = now,
            UpdatedAt = now,
            Lines = lines,
        };

        sale.ComputeTotals();

        await _repository.AddAsync(sale, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return sale.Id;
    }
}

internal static class OilSaleLineRules
{
    // Lignes d'une vente : une citerne de stockage par ligne, huile disponible.
    public static async Task<List<OilSaleLine>> BuildLinesAsync(
        List<OilSaleLineRequest> requests,
        ITankRepository tankRepository,
        CancellationToken cancellationToken)
    {
        if (requests.Count == 0)
        {
            throw new BusinessException("Ajoutez au moins une citerne à la vente.");
        }

        if (requests.Select(line => line.TankId).Distinct().Count() != requests.Count)
        {
            throw new BusinessException("Une citerne ne peut apparaître qu'une fois dans la vente.");
        }

        var lines = new List<OilSaleLine>();

        foreach (var request in requests)
        {
            var tank = await tankRepository.GetByIdAsync(request.TankId, cancellationToken)
                ?? throw new BusinessException("Citerne introuvable.");

            if (tank.IsBuffer)
            {
                throw new BusinessException(
                    $"{tank.Code} est une citerne tampon : seule l'huile stockée et analysée se vend.");
            }

            if (request.QuantityLiters <= 0)
            {
                throw new BusinessException($"Renseignez la quantité (L) sortie de {tank.Code}.");
            }

            var available = await tankRepository.GetCurrentQuantityAsync(tank.Id, cancellationToken);

            if (request.QuantityLiters > available)
            {
                throw new BusinessException(
                    $"{tank.Code} ne contient que {available:0.#} L.");
            }

            var priceUnit = request.PriceUnit == OilSaleLine.PriceUnitLiter
                ? OilSaleLine.PriceUnitLiter
                : OilSaleLine.PriceUnitKg;

            if (priceUnit == OilSaleLine.PriceUnitKg && (request.QuantityKg is null || request.QuantityKg <= 0))
            {
                throw new BusinessException(
                    $"Prix au kg : renseignez le poids (kg) de l'huile de {tank.Code}.");
            }

            if (request.UnitPrice < 0)
            {
                throw new BusinessException("Le prix unitaire ne peut pas être négatif.");
            }

            var line = new OilSaleLine
            {
                TankId = tank.Id,
                OilCategory = tank.OilCategory,
                QuantityLiters = request.QuantityLiters,
                QuantityKg = request.QuantityKg > 0 ? request.QuantityKg : null,
                PriceUnit = priceUnit,
                UnitPrice = request.UnitPrice,
            };

            line.ComputeAmount();
            lines.Add(line);
        }

        return lines;
    }
}
