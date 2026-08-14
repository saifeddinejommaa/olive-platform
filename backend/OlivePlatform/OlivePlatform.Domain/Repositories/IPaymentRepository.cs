using OlivePlatform.Domain.Entities;
using OlivePlatform.Domain.Repositories;

namespace OlivePlatform.Domain.Interfaces.Repositories;

public interface IPaymentRepository
    : IRepository<Payment>
{
    Task<Payment?> GetByNumberAsync(
        string paymentNumber,
        CancellationToken cancellationToken = default);

    Task<IReadOnlyList<Payment>> GetByInvoiceIdAsync(
        int invoiceId,
        CancellationToken cancellationToken = default);
}