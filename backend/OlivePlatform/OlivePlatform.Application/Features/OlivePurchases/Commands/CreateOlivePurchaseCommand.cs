using MediatR;
using OlivePlatform.Application.Common;
using OlivePlatform.Application.Features.OlivePurchases.Requests;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Enums;
using OlivePlatform.Domain.Interfaces.Repositories;
using OlivePlatform.Domain.Repositories;
using YourProject.Application.Constants;
using YourProject.Application.Services;

namespace OlivePlatform.Application.Features.OlivePurchases.Commands.CreateOlivePurchase;

public class CreateOlivePurchaseCommand : IRequest<int>
{
    public DateOnly PurchaseDate { get; set; }
    public int? SupplierId { get; set; }
    public NewSupplierRequest? NewSupplier { get; set; }
    public PurchaseStatus Status { get; set; }
    public string? Notes { get; set; }
    public required List<NewOlivePurchaseItemRequest> Items { get; set; }
}

public class CreateOlivePurchaseCommandHandler
    : IRequestHandler<CreateOlivePurchaseCommand, int>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IOlivePurchaseRepository _repository;
    private readonly ISupplierRepository _supplierRepository;
    private readonly IDocumentNumberService _documentNumberService;
    private readonly IOliveAnalysisRepository _oliveAnalysisRepository;

    public CreateOlivePurchaseCommandHandler(
        IUnitOfWork unitOfWork,
        IOlivePurchaseRepository repository,
        ISupplierRepository supplierRepository,
        IDocumentNumberService documentNumberService,
        IOliveAnalysisRepository oliveAnalysisRepository)
    {
        _unitOfWork = unitOfWork;
        _repository = repository;
        _supplierRepository = supplierRepository;
        _documentNumberService = documentNumberService;
        _oliveAnalysisRepository = oliveAnalysisRepository;
    }

    public async Task<int> Handle(
        CreateOlivePurchaseCommand request,
        CancellationToken cancellationToken)
    {
        if (request.SupplierId is null && request.NewSupplier is null)
            throw new InvalidOperationException(
                "Vous devez fournir un fournisseur existant (SupplierId) ou les informations d'un nouveau fournisseur (NewSupplier).");

        var purchaseId = 0;

        await _unitOfWork.ExecuteInTransactionAsync(async ct =>
        {
            if (request.Items.Count == 0)
                throw new InvalidOperationException(
                    "Au moins une ligne d'achat doit être renseignée.");

            foreach (var item in request.Items)
            {
                if (item.AgreedQuantityKg <= 0)
                    throw new InvalidOperationException(
                        "La quantité doit être supérieure à 0.");

                if (item.PricePerKg <= 0)
                    throw new InvalidOperationException(
                        "Le prix par kg doit être supérieur à 0.");
            }

            var now = DateTime.UtcNow;

            int supplierId;

            if (request.SupplierId is not null)
            {
                supplierId = request.SupplierId.Value;
            }
            else
            {
                var supplierReference = await _documentNumberService.GenerateAsync(
                        DocumentTypes.Supplier,
                        DocumentPrefixes.Supplier,
                        now.Year,
                        ct);
                var newSupplier = new Supplier
                {
                    Reference = supplierReference,
                    Name = request.NewSupplier!.Name,
                    Address = request.NewSupplier.Address,
                    Phone = request.NewSupplier.Phone,
                    IsActive = true
                };

                await _supplierRepository.AddAsync(newSupplier, ct);
                await _unitOfWork.SaveChangesAsync(ct);

                supplierId = newSupplier.Id;
            }

            var purchaseNumber =
                await _documentNumberService.GenerateAsync(
                    DocumentTypes.OlivePurchase,
                    DocumentPrefixes.OlivePurchase,
                    now.Year,
                    ct);

            var purchase = new OlivePurchase
            {
                Reference = purchaseNumber,
                SupplierId = supplierId,
                PurchaseDate = request.PurchaseDate,
                Status = request.Status,
                Notes = request.Notes,
                UnpaidAmount = 0m,
                PaidAmount = 0m,
                CreatedAt = now,
                UpdatedAt = now

            };

            var itemsForAnalysis =
                new List<OlivePurchaseItem>();

            foreach (var item in request.Items)
            {
                var itemReference =
                    await _documentNumberService.GenerateAsync(
                        DocumentTypes.OlivePurchaseItem,
                        DocumentPrefixes.OlivePurchaseItem,
                        now.Year,
                        ct);

                var itemEntity = new OlivePurchaseItem
                {
                    Reference = itemReference,
                    VarietyId = item.VarietyId,
                    AgreedQuantityKg = item.AgreedQuantityKg,
                    PricePerKg = item.PricePerKg,
                    CreatedAt = now,
                    UpdatedAt = now
                };

                purchase.UnpaidAmount += item.AgreedQuantityKg * item.PricePerKg;
                purchase.PaidAmount = 0;
                purchase.IsPaid = false;

                purchase.Items.Add(itemEntity);

                if (item.GoesToAnalysis)
                {
                    itemsForAnalysis.Add(itemEntity);
                }
            }

            await _repository.AddAsync(
                purchase,
                ct);
            await _unitOfWork.SaveChangesAsync(ct);

            purchaseId = purchase.Id;

            foreach (var itemEntity in itemsForAnalysis)
            {
                var analysisReference =
                    await _documentNumberService.GenerateAsync(
                        DocumentTypes.OliveAnalyse,
                        DocumentPrefixes.OliveAnalyse,
                        now.Year,
                        ct);

                var analysisEntity = new OliveAnalysis
                {
                    Reference = analysisReference,
                    SourceType = InputSourceType.Purchase,
                    SourceId = itemEntity.Id,
                    CreatedAt = now,
                    UpdatedAt = now,
                    Status = ProductionStatus.Planned
                };

                await _oliveAnalysisRepository.AddAsync(
                    analysisEntity,
                    ct);
            }

            await _unitOfWork.SaveChangesAsync(ct);

        }, cancellationToken);

        return purchaseId;
    }
}