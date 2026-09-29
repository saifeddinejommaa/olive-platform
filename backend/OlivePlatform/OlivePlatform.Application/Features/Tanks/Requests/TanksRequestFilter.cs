using OlivePlatform.Application.Common;
using OlivePlatform.Domain.Enums;

namespace OlivePlatform.Application.Features.Tanks.Requests
{
    public class TanksRequestFilter : PaginationRequest
    {
        public string? Code { get; set; }

        public string? Name { get; set; }

        public TankType? TankType { get; set; }

        public OilCategory? OilCategory { get; set; }

        public string? Status { get; set; }
    }
}
