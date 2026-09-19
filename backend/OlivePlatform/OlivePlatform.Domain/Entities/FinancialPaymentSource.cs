using System.ComponentModel.DataAnnotations.Schema;

namespace OlivePlatform.Domain.Entities
{
    [Table("financial_payment_source")]
    public class FinancialPaymentSource
    {
        [Column("id")]
        public long Id { get; set; }

        [Column("financial_payment_id")]
        public long FinancialPaymentId { get; set; }

        [Column("source_type_id")]
        public int SourceTypeId { get; set; }

        [Column("source_id")]
        public long SourceId { get; set; }

        [Column("amount")]
        public decimal Amount { get; set; }

        [Column("notes")]
        public string? Notes { get; set; }

        public FinancialPayment FinancialPayment { get; set; } = null!;
    }
}
