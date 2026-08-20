namespace OlivePlatform.Domain.Entities;

public class Tank
{
    public int Id { get; set; }
    public string Code { get;  set; } = null!;
    public string? Name { get;  set; }

    public decimal CapacityLiters { get;  set; }

    public string? Location { get;  set; }
    public string? TankType { get;  set; }

    public string Status { get;  set; }

    public string? Notes { get;  set; }
}