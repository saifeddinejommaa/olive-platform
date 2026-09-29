using MediatR;
using OlivePlatform.Application.Common;
using OlivePlatform.Domain;
using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Interfaces.Repositories;
using YourProject.Application.Constants;
using YourProject.Application.Services;

namespace OlivePlatform.Application.Features.Customers.Commands;

// ============================================================
// CREATE
// ============================================================

public class CreateCustomerCommand : IRequest<int>
{
    public string Name { get; set; } = null!;

    public string? Phone { get; set; }

    public string? Email { get; set; }

    // Matricule fiscal.
    public string? TaxId { get; set; }

    public string? Address { get; set; }

    public string? Notes { get; set; }
}

public class CreateCustomerCommandHandler : IRequestHandler<CreateCustomerCommand, int>
{
    private readonly ICustomerRepository _repository;
    private readonly IDocumentNumberService _documentNumberService;
    private readonly IUnitOfWork _unitOfWork;

    public CreateCustomerCommandHandler(
        ICustomerRepository repository,
        IDocumentNumberService documentNumberService,
        IUnitOfWork unitOfWork)
    {
        _repository = repository;
        _documentNumberService = documentNumberService;
        _unitOfWork = unitOfWork;
    }

    public async Task<int> Handle(CreateCustomerCommand request, CancellationToken cancellationToken)
    {
        var name = CustomerRules.RequireName(request.Name);

        if (await _repository.ExistsByNameAsync(name, null, cancellationToken))
        {
            throw new BusinessException($"Un client « {name} » existe déjà.");
        }

        var now = DateTime.UtcNow;

        var customer = new Customer
        {
            Reference = await _documentNumberService.GenerateAsync(
                DocumentTypes.Customer,
                DocumentPrefixes.Customer,
                now.Year,
                cancellationToken),
            Name = name,
            Phone = CustomerRules.Clean(request.Phone),
            Email = CustomerRules.Clean(request.Email),
            TaxId = CustomerRules.Clean(request.TaxId),
            Address = CustomerRules.Clean(request.Address),
            Notes = CustomerRules.Clean(request.Notes),
            IsActive = true,
            CreatedAt = now,
            UpdatedAt = now,
        };

        await _repository.AddAsync(customer, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return customer.Id;
    }
}

// ============================================================
// UPDATE
// ============================================================

public class UpdateCustomerCommand : CreateCustomerCommand
{
    public int Id { get; set; }

    public bool IsActive { get; set; } = true;
}

public class UpdateCustomerCommandHandler : IRequestHandler<UpdateCustomerCommand, int>
{
    private readonly ICustomerRepository _repository;
    private readonly IUnitOfWork _unitOfWork;

    public UpdateCustomerCommandHandler(
        ICustomerRepository repository,
        IUnitOfWork unitOfWork)
    {
        _repository = repository;
        _unitOfWork = unitOfWork;
    }

    public async Task<int> Handle(UpdateCustomerCommand request, CancellationToken cancellationToken)
    {
        var customer = await _repository.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new KeyNotFoundException($"Customer {request.Id} not found.");

        var name = CustomerRules.RequireName(request.Name);

        if (await _repository.ExistsByNameAsync(name, customer.Id, cancellationToken))
        {
            throw new BusinessException($"Un client « {name} » existe déjà.");
        }

        customer.Name = name;
        customer.Phone = CustomerRules.Clean(request.Phone);
        customer.Email = CustomerRules.Clean(request.Email);
        customer.TaxId = CustomerRules.Clean(request.TaxId);
        customer.Address = CustomerRules.Clean(request.Address);
        customer.Notes = CustomerRules.Clean(request.Notes);
        customer.IsActive = request.IsActive;
        customer.CreatedAt = DateTime.SpecifyKind(customer.CreatedAt, DateTimeKind.Utc);
        customer.UpdatedAt = DateTime.UtcNow;

        await _repository.UpdateAsync(customer, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return customer.Id;
    }
}

internal static class CustomerRules
{
    public static string RequireName(string? name)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new BusinessException("Le nom du client est obligatoire.");
        }

        return name.Trim();
    }

    // Texte facultatif : vide => null.
    public static string? Clean(string? value) =>
        string.IsNullOrWhiteSpace(value) ? null : value.Trim();
}
