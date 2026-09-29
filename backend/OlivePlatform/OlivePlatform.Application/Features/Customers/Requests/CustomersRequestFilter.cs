namespace OlivePlatform.Application.Features.Customers.Requests;

public class CustomersRequestFilter
{
    // Référence, nom, téléphone ou matricule fiscal.
    public string? Search { get; set; }

    public bool? IsActive { get; set; }
}
