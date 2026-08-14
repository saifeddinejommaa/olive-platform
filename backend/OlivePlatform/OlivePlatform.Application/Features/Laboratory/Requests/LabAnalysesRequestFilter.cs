using OlivePlatform.Application.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace OlivePlatform.Application.Features.Laboratory.Requests
{
    public class LabAnalysesRequestFilter : PaginationRequest
    {
        public string? AnalysisNumber { get; set; }

        public int? SampleId { get; set; }

        public string? SampleNumber { get; set; }

        public string? AnalystName { get; set; }

        public string? GeneralQuality { get; set; }

        public DateTime? FromDate { get; set; }

        public DateTime? ToDate { get; set; }
    }
}
