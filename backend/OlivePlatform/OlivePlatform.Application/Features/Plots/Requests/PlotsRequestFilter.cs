using OlivePlatform.Application.Common;

public class PlotsRequestFilter : PaginationRequest
{
    public string? Code { get; set; }

    public string? Name { get; set; }

    public bool? IsActive { get; set; }
}