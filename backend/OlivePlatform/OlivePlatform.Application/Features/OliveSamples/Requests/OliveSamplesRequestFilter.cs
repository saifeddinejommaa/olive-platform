using OlivePlatform.Application.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace OlivePlatform.Application.Features.OliveSamples.Requests
{
    public class OliveSamplesRequestFilter : PaginationRequest
    {
        public string? SampleNumber { get; set; }

        public int? PurchaseId { get; set; }

        public string? SupplierName { get; set; }

        public string? Status { get; set; }

        public DateTime? FromDate { get; set; }

        public DateTime? ToDate { get; set; }
    }
}
