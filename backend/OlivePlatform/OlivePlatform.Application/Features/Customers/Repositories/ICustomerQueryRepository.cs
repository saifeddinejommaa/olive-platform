using OlivePlatform.Application.Features.Customers.Requests;
using OlivePlatform.Application.Features.Customers.Responses;

namespace OlivePlatform.Application.Features.Customers.Repositories;

public interface ICustomerQueryRepository
{
    Task<IReadOnlyList<CustomerResponse>> GetCustomersAsync(
        CustomersRequestFilter filter,
        CancellationToken cancellationToken = default);

    Task<CustomerResponse?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default);
}
