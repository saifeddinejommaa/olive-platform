using OlivePlatform.Domain.Enums;

namespace OlivePlatform.Application.Features.Payments.Responses
{
    public class ProcessedPaymentResponse
    {
        public int Total { get; set; }
        public int Id { get; set; }
        public required string RecipientName { get; set; }
        public DateOnly PaymentDate { get; set; }
        public decimal Amount { get; set; }
        public PaymentMethod paymentMethod { get; set; }
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
