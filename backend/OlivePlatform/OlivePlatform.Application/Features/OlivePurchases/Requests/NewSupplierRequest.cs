using System;
using System.Collections.Generic;
using System.Text;

namespace OlivePlatform.Application.Features.OlivePurchases.Requests
{
    public class NewSupplierRequest
    {
        public required string Name { get; set; }

        public string? Address { get; set; }

        public string? Phone { get; set; }
    }
}
