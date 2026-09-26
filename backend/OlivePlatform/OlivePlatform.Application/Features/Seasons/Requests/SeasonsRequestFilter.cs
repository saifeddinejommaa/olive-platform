using OlivePlatform.Application.Common;
using OlivePlatform.Domain.Enums;

namespace OlivePlatform.Application.Features.Seasons.Requests
{
    public class SeasonsRequestFilter : PaginationRequest
    {
        public string? Label { get; set; }

        public SeasonStatus? Status { get; set; }
    }
}
