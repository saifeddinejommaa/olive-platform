using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace OlivePlatform.Domain.Entities
{

    [Table("financial_payment")]
    public class FinancialPayment
    {
        [Column("id")]
        public long Id { get; set; }

        [Column("payment_date")]
        public DateOnly PaymentDate { get; set; }

        [Column("amount")]
        public decimal Amount { get; set; }

        [Column("payment_method_id")]
        public int? PaymentMethodId { get; set; }

        [Column("reference")]
        public string? Reference { get; set; }

        [Column("notes")]
        public string? Notes { get; set; }

        [Column("created_at")]
        public DateTime CreatedAt { get; set; }

        public ICollection<FinancialPaymentSource> Sources { get; set; } = [];

    }
}
