namespace OlivePlatform.Domain.Entities;

public class ExpenseCategory
{
    public int Id { get; set; }
    public string Code { get; private set; } = null!;
    public string Name { get; private set; } = null!;

    public int? ParentId { get; private set; }

    public string? Description { get; private set; }
}