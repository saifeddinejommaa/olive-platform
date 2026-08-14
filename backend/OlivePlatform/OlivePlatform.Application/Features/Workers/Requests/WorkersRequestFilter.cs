using OlivePlatform.Application.Common;
using System;
using System.Collections.Generic;
using System.Text;

namespace OlivePlatform.Application.Features.Workers.Requests
{
    public class WorkersRequestFilter : PaginationRequest
    {
        public string? Code { get; set; }

        public string? Name { get; set; }

        public string? WorkerType { get; set; }

        public bool? IsActive { get; set; }
    }
}
