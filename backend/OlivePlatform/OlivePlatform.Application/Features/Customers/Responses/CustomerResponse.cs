namespace OlivePlatform.Application.Features.Customers.Responses;

public class CustomerResponse
{
    public int Id { get; set; }

    public string Reference { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string? Phone { get; set; }

    public string? Email { get; set; }

    public string? TaxId { get; set; }

    public string? Address { get; set; }

    public string? Notes { get; set; }

    public bool IsActive { get; set; }

    // Ventes livrées : nombre, litres et chiffre d'affaires TTC.
    public int SalesCount { get; set; }

    public decimal SoldLiters { get; set; }

    public decimal SalesAmount { get; set; }
}
