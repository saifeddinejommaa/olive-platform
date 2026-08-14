namespace OlivePlatform.Application.Features.Tanks.Responses;

public class TankForListResponse
{
    public int Total { get; set; }

    public int Id { get; set; }

    public string Code { get; set; } = null!;

    public string? Name { get; set; }

    public decimal CapacityLiters { get; set; }

    public decimal CurrentQuantityLiters { get; set; }

    public decimal AvailableCapacityLiters { get; set; }

    public decimal FillPercentage { get; set; }

    public string? Location { get; set; }

    public string? TankType { get; set; }

    public string Status { get; set; } = null!;
}