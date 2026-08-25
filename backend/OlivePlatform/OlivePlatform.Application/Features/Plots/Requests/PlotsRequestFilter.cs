using OlivePlatform.Application.Common;

public class PlotsRequestFilter : PaginationRequest
{
    public string? Reference { get; set; }

    public string? Name { get; set; }

    public bool? IsActive { get; set; }
}