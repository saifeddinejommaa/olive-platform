using OlivePlatform.Application.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace OlivePlatform.Application.Features.Harvests.Requests
{
    public class HarvestsRequestFilter : PaginationRequest
    {
        public string? HarvestNumber { get; set; }

        public int? PlotId { get; set; }

        public DateOnly? FromDate { get; set; }

        public DateOnly? ToDate { get; set; }

        public string? QualityGrade { get; set; }
    }
}
