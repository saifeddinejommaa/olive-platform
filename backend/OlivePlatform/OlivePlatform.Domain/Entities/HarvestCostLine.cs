using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace OlivePlatform.Domain.Entities
{
    [Table("harvest_cost_line")]
    public class HarvestCostLine
    {
        [Column("id")]
        public long Id { get; set; }

        [Column("harvest_id")]
        public long HarvestId { get; set; }

        [Column("date")]
        public DateOnly Date { get; set; }

        [Column("type_id")]
        public int Type { get; set; }

        [Column("description")]
        public string? Description { get; set; }

        [Column("worker_name")]
        public string? WorkerName { get; set; }

        [Column("worker_identifier")]
        public string? WorkerIdentifier { get; set; }

        [Column("quantity")]
        public decimal Quantity { get; set; }

        [Column("unit")]
        public string? Unit { get; set; }

        [Column("unit_price")]
        public decimal UnitPrice { get; set; }

        [Column("total_amount")]
        public decimal TotalAmount { get; set; }

        [Column("notes")]
        public string? Notes { get; set; }

        [Column("is_paid")]
        public bool IsPaid { get; set; }

        [Column("paid_date")]
        public DateOnly? PaidDate { get; set; }

        [Column("paid_amount")]
        public decimal PaidAmount { get; set; }

        [Column("unpaid_amount")]
        public decimal UnpaidAmount { get; set; }
    }
}
