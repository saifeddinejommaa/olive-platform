using OlivePlatform.Application.Common;

namespace OlivePlatform.Application.Features.Tanks.Requests
{
    public class TanksRequestFilter : PaginationRequest
    {
        public string? Code { get; set; }

        public string? Name { get; set; }

        public string? Location { get; set; }

        public string? TankType { get; set; }

        public string? Status { get; set; }
    }
}
