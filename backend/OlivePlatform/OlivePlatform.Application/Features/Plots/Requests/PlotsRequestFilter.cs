using OlivePlatform.Application.Common;
using OlivePlatform.Domain.Entities;

public class PlotsRequestFilter : PaginationRequest
{
    public string? Reference { get; set; }

    public string? Name { get; set; }

    public OliveVariety? OliveVariety { get; set; }
}