using OlivePlatform.Application.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace OlivePlatform.Application.Features.Production.Requests
{
    public class ProductionBatchesRequestFilter : PaginationRequest
    {
        public string? BatchNumber { get; set; }

        public string? Status { get; set; }

        public DateOnly? FromDate { get; set; }

        public DateOnly? ToDate { get; set; }
    }
}
