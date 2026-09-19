using System;
using System.Collections.Generic;
using System.Text;

namespace OlivePlatform.Application.Features.OlivePurchases.Responses
{
    public class SupplierDetailsResponse
    {
        public long Id { get; set; }

        public string Name { get; set; } = null!;

        public string? Reference { get; set; }

        public string? Phone { get; set; }

        public string? Address { get; set; }
    }
}
